/**
 * Route Handler: GET /api/docs
 *
 * Serve o Swagger UI com o spec OpenAPI embutido inline.
 * Usar `spec:` em vez de `url:` elimina o fetch assíncrono que causava
 * "Unable to render this definition" — o parser recebia a resposta antes
 * dos scripts do CDN estarem prontos, ou recebia HTML em vez de JSON.
 */

import { NextResponse } from "next/server";

import { get_openapi_document } from "@/lib/openapi/registry";

const SWAGGER_UI_VERSION = "4.19.0";

export async function GET() {
  const spec = get_openapi_document();
  // JSON.stringify seguro para injeção inline num <script>:
  // substitui </script> para evitar que o parser HTML feche a tag precocemente
  const spec_json = JSON.stringify(spec).replace(/<\/script>/gi, "<\\/script>");

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LeadImobi — API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@${SWAGGER_UI_VERSION}/swagger-ui.css" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f7fa;
      min-height: 100vh;
    }

    /* Header — mesmo padrão do sistema (bg-slate-800/80, border-slate-700) */
    .docs-header {
      background: rgba(30, 41, 59, 0.85); /* slate-800/85 */
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-bottom: 1px solid #334155; /* slate-700 */
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .docs-header-left { display: flex; align-items: center; gap: 8px; }
    .docs-title {
      font-size: 20px;
      font-weight: 700;
      color: #facc15; /* yellow-400 */
      line-height: 1;
    }
    .docs-badge {
      background: rgba(148,163,184,0.1); /* slate-400/10 */
      border: 1px solid #475569; /* slate-600 */
      color: #94a3b8; /* slate-400 */
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .docs-back {
      color: #94a3b8; /* slate-400 */
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: color 0.15s;
    }
    .docs-back:hover { color: #f1f5f9; /* slate-100 */ }

    /* Wrapper */
    #swagger-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 28px 20px 60px;
    }

    /* Swagger UI overrides */
    .swagger-ui .topbar          { display: none !important; }
    .swagger-ui .info            { margin: 0 0 20px !important; padding: 24px !important; background: #fff; border-radius: 12px; box-shadow: 0 1px 6px rgba(0,0,0,0.07); }
    .swagger-ui .info .title     { font-size: 24px !important; color: #1a1a2e !important; font-weight: 800 !important; }
    .swagger-ui .scheme-container { background: #fff !important; border-radius: 10px !important; box-shadow: 0 1px 4px rgba(0,0,0,0.06) !important; padding: 14px 18px !important; margin-bottom: 18px !important; }
    .swagger-ui .opblock-tag     { border-bottom: 1px solid #e8ecf0 !important; font-size: 15px !important; font-weight: 700 !important; color: #1a1a2e !important; }
    .swagger-ui .opblock         { border-radius: 10px !important; box-shadow: 0 1px 4px rgba(0,0,0,0.06) !important; margin-bottom: 8px !important; border: none !important; overflow: hidden; }
    .swagger-ui .opblock.opblock-get    .opblock-summary { background: #f0f9ff !important; border-left: 4px solid #0ea5e9 !important; }
    .swagger-ui .opblock.opblock-post   .opblock-summary { background: #f0fdf4 !important; border-left: 4px solid #22c55e !important; }
    .swagger-ui .opblock.opblock-put    .opblock-summary { background: #fffbeb !important; border-left: 4px solid #f59e0b !important; }
    .swagger-ui .opblock.opblock-delete .opblock-summary { background: #fff1f2 !important; border-left: 4px solid #f43f5e !important; }
    .swagger-ui .opblock-summary-method { border-radius: 6px !important; font-weight: 700 !important; min-width: 72px !important; text-align: center !important; }
    .swagger-ui .btn.execute     { background: #0f3460 !important; border-color: #0f3460 !important; border-radius: 6px !important; font-weight: 600 !important; }
    .swagger-ui .btn.execute:hover { background: #16213e !important; }
  </style>
</head>
<body>
  <header class="docs-header">
    <div class="docs-header-left">
      <span style="font-size:22px;line-height:1">🏠</span>
      <span class="docs-title">LeadImobi</span>
    </div>
    <div style="display:flex;align-items:center;gap:14px">
      <span class="docs-badge">API Docs</span>
      <a href="/leads" class="docs-back">← Voltar ao app</a>
    </div>
  </header>

  <div id="swagger-wrapper">
    <div id="swagger-ui"></div>
  </div>

  <script src="https://unpkg.com/swagger-ui-dist@${SWAGGER_UI_VERSION}/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@${SWAGGER_UI_VERSION}/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function () {
      SwaggerUIBundle({
        spec: ${spec_json},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [SwaggerUIBundle.plugins.DownloadUrl],
        layout: 'StandaloneLayout',
        persistAuthorization: true,
        defaultModelsExpandDepth: 1,
        defaultModelExpandDepth: 1,
        docExpansion: 'list',
        filter: true,
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch']
      });
    };
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
