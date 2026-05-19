import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      // ── Rota de documentação: CSP permissivo para Swagger UI (CDN + eval) ──
      {
        source: "/api/docs",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Swagger UI (4.x) usa eval() internamente para montar o bundle
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com",
              "style-src 'self' 'unsafe-inline' https://unpkg.com",
              "img-src 'self' data: https:",
              "font-src 'self' https://unpkg.com",
              // Fetch do spec /api/openapi.json e possíveis requests do CDN
              "connect-src 'self' https://unpkg.com",
              // Swagger UI pode criar web workers via blob:
              "worker-src blob:",
            ].join("; "),
          },
        ],
      },
      // ── Todas as outras rotas: CSP restritivo ──
      {
        source: "/((?!api/docs).*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data:",
              "font-src 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
