import { ScrollViewStyleReset, useServerDocumentContext } from "expo-router/html";
import { type PropsWithChildren } from "react";

// Só roda no Node.js durante a renderização estática do site (não tem acesso
// ao DOM/navegador). Define o HTML raiz de todas as páginas web, incluindo o
// manifesto do PWA (pra permitir "Instalar aplicativo" de verdade no Android/Chrome).
export default function Root({ children }: PropsWithChildren) {
  const { headNodes, bodyNodes, htmlAttributes, bodyAttributes } = useServerDocumentContext();

  return (
    <html lang="pt-BR" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1B2CC1" />

        <ScrollViewStyleReset />

        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
