import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";

// Endereços desconhecidos dentro da Área de Cliente: 404 próprio (area-cliente/not-found),
// com o título do 404 no separador.

export async function generateMetadata(): Promise<Metadata> {
  const { erros } = await getDictionary();
  return { title: erros.naoEncontrada.title, robots: { index: false } };
}

export default function RotaDesconhecidaAreaCliente() {
  notFound();
}
