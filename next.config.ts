import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev: a Área de Cliente corre em clientes.localhost (ver .env.example, CLIENTES_URL).
  allowedDevOrigins: ["clientes.localhost", "www.localhost"],
};

export default nextConfig;
