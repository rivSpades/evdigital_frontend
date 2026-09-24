import { notFound } from "next/navigation";

// Qualquer endereço em /<lang>/… que não corresponda a uma rota cai aqui e mostra o 404 de
// [lang]/not-found.tsx, no idioma da rota. Sem isto, com o layout raiz em [lang], o Next
// usaria a página 404 genérica (em inglês e fora do tema).

export default function RotaDesconhecida() {
  notFound();
}
