import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AC_COOKIE_NAME, backendFetch } from "@/lib/area-cliente/backend";

export async function POST() {
  const store = await cookies();
  const token = store.get(AC_COOKIE_NAME)?.value;

  if (token) {
    try {
      await backendFetch("/api/auth/logout/", { method: "POST", token });
    } catch (erro) {
      // Mesmo que o Django falhe a apagar o token, o cookie sai já a seguir — o
      // visitante nunca fica "preso" com sessão a meio por causa disto.
      console.error("Falha ao terminar sessão no backend:", erro);
    }
  }

  store.delete(AC_COOKIE_NAME);
  return NextResponse.json({ status: "terminada" });
}
