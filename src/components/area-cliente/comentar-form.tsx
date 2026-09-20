"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { localizePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function ComentarForm({
  pedidoId,
  lang,
  t,
}: {
  pedidoId: string;
  lang: Locale;
  t: Dictionary["areaCliente"]["detalhe"]["comment"];
}) {
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState("");
  const [aEnviar, setAEnviar] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    if (!texto.trim()) {
      setErro(t.errEmpty);
      return;
    }

    setAEnviar(true);
    try {
      const resposta = await fetch(`/api/area-cliente/pedidos/${pedidoId}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: texto }),
      });

      if (resposta.status === 401) {
        router.push(localizePath(lang, "/area-cliente/entrar"));
        return;
      }

      if (!resposta.ok) {
        setErro(t.errSend);
        return;
      }

      setTexto("");
      router.refresh();
    } catch {
      setErro(t.errSend);
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-sm">
      <Textarea
        id="resposta"
        name="resposta"
        aria-label={t.ariaLabel}
        rows={3}
        placeholder={t.placeholder}
        value={texto}
        invalid={Boolean(erro)}
        onChange={(e) => setTexto(e.target.value)}
      />
      {erro ? <p className="font-body text-body text-feedback-error-fg">{erro}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={aEnviar}>
          {aEnviar ? t.submitting : t.submit}
        </Button>
      </div>
    </form>
  );
}
