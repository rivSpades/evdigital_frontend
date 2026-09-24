import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev: a Área de Cliente corre em clientes.localhost (ver .env.example, CLIENTES_URL).
  allowedDevOrigins: ["clientes.localhost", "www.localhost"],
  experimental: {
    // Cache de navegação no cliente (node_modules/next/dist/docs/01-app/03-api-reference/
    // 05-config/01-next-config-js/staleTimes.md). `dynamic`: uma página dinâmica já visitada
    // (Área de Cliente) volta a abrir sem ir ao servidor durante 30 s; por omissão
    // é 0 e cada clique repetido esperava pelo servidor. `static`: 3 min (o valor do exemplo da
    // documentação; por omissão 5) para as páginas estáticas prefetchadas e os esqueletos
    // (loading.tsx).
    // As mutações da Área de Cliente chamam `router.refresh()`, que invalida esta cache toda
    // (lista de pedidos depois de criar, conversa depois de comentar, perfil guardado).
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default nextConfig;
