import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Armazenamento em memória para contagem de requisições por IP
const request_counts = new Map<string, { count: number; reset_at: number }>();

// Configurações do rate limiting
const LIMIT = 10; // requisições
const WINDOW = 60_000; // por minuto (60 segundos)

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Proteção de rotas — autenticação
  const session = await auth();
  
  // Redirecionar para login se tentar acessar /leads/* sem autenticação
  if (pathname.startsWith('/leads') && !session?.user?.corretor_id) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // Redirecionar para /leads se tentar acessar /auth/* já autenticado
  if (pathname.startsWith('/auth') && session?.user?.corretor_id) {
    return NextResponse.redirect(new URL('/leads', request.url));
  }
  // Aplicar rate limiting apenas nas rotas de criação de leads
  if (request.nextUrl.pathname === "/leads/novo" ||
      request.nextUrl.pathname.startsWith("/leads") && request.method === "POST") {

    // Obter IP do cliente (considerando proxies)
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ??
               request.headers.get("x-real-ip") ??
               "unknown";

    const now = Date.now();
    const entry = request_counts.get(ip);

    if (!entry || now > entry.reset_at) {
      // Primeira requisição ou janela expirou - resetar contador
      request_counts.set(ip, { count: 1, reset_at: now + WINDOW });
    } else if (entry.count >= LIMIT) {
      // Limite excedido - retornar erro 429
      return new Response(
        JSON.stringify({
          error: "Too Many Requests",
          message: `Rate limit exceeded. Maximum ${LIMIT} requests per minute allowed.`,
          retry_after: Math.ceil((entry.reset_at - now) / 1000),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil((entry.reset_at - now) / 1000).toString(),
            "X-RateLimit-Limit": LIMIT.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": entry.reset_at.toString(),
          },
        },
      );
    } else {
      // Incrementar contador
      entry.count++;

      // Adicionar headers informativos sobre rate limit
      const response = new Response(null, { status: 200 });
      response.headers.set("X-RateLimit-Limit", LIMIT.toString());
      response.headers.set("X-RateLimit-Remaining", (LIMIT - entry.count).toString());
      response.headers.set("X-RateLimit-Reset", entry.reset_at.toString());
    }
  }

  // Limpeza periódica de entradas expiradas (executar a cada 5 minutos)
  if (Math.random() < 0.01) { // 1% de chance por requisição
    const now = Date.now();
    for (const [ip, entry] of request_counts.entries()) {
      if (now > entry.reset_at) {
        request_counts.delete(ip);
      }
    }
  }
}

export const config = {
  matcher: ['/leads/:path*', '/auth/:path*'],
}