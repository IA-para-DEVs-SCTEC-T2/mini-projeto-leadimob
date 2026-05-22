/**
 * Layout para página de documentação
 */

export const metadata = {
  title: "LeadImobi API Documentation",
  description: "Documentação interativa da API LeadImobi com Swagger UI",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
