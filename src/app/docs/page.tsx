/**
 * Redireciona /docs → /api/docs
 *
 * O Swagger UI é servido como HTML puro via route handler (/api/docs)
 * para evitar o bug do swagger-ui-react@5.x com OpenAPI 3.1 no Turbopack:
 * "OpenApi3_1Element.refract is not a function"
 */

import { redirect } from "next/navigation";

export default function DocsPage() {
  redirect("/api/docs");
}
