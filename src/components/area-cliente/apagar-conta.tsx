"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Notice } from "@/components/ui/notice";
import { ZonaPerigo } from "@/components/ui/zona-perigo";
import { useHrefAreaCliente } from "@/i18n/area-cliente-host";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

// Zona de perigo "Apagar conta" do separador Segurança (frames YxRui / Kcf0c por
// confirmar, ZWhYL a enviar, YysFI / V2exy pedido enviado do design-system.pen).
//
// "Apagar conta" abre o ds/overlay/veu-com-modal; "Pedir apagamento" chama
// POST /api/area-cliente/apagar-conta (o Django só envia um email à equipa). Com o pedido
// enviado, o botão dá lugar ao aviso "Pedido enviado." e o foco vai para lá (o botão que
// abriu o modal deixa de existir). Falha (429/502/rede): aviso de erro dentro do modal,
// que fica aberto para tentar de novo. 401: sessão perdida, volta a Entrar.

export function ApagarConta({
  lang,
  t,
}: {
  lang: Locale;
  t: Dictionary["areaCliente"]["definicoes"]["apagar"];
}) {
  const router = useRouter();
  const hrefAreaCliente = useHrefAreaCliente();
  const [aberto, setAberto] = useState(false);
  const [aEnviar, setAEnviar] = useState(false);
  const [erro, setErro] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const enviadoRef = useRef<HTMLDivElement>(null);

  // Corre depois de o modal fechar (efeitos dos filhos primeiro): o foco vai para o aviso.
  useEffect(() => {
    if (enviado) enviadoRef.current?.focus();
  }, [enviado]);

  function fechar() {
    setAberto(false);
    setErro(false);
  }

  async function pedirApagamento() {
    setErro(false);
    setAEnviar(true);
    try {
      const resposta = await fetch("/api/area-cliente/apagar-conta", { method: "POST" });
      if (resposta.status === 401) {
        router.push(hrefAreaCliente(lang, "/area-cliente/entrar"));
        return;
      }
      if (!resposta.ok) {
        setErro(true);
        return;
      }
      setEnviado(true);
      setAberto(false);
    } catch {
      setErro(true);
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <ZonaPerigo titleId="zona-perigo-titulo" title={t.title} description={t.body}>
      {enviado ? (
        <div ref={enviadoRef} tabIndex={-1} className="outline-none">
          <Notice tone="ok" role="status" title={t.sentTitle} description={t.sentBody} />
        </div>
      ) : (
        <Button variant="outline-danger" className="w-fit" onClick={() => setAberto(true)}>
          {t.cta}
        </Button>
      )}

      <Modal
        open={aberto}
        onClose={fechar}
        busy={aEnviar}
        closeLabel={t.close}
        title={t.modalTitle}
        description={t.modalBody}
        alert={erro ? <Notice tone="error" role="alert" title={t.err} /> : null}
      >
        <Button
          variant="outline"
          data-autofocus
          disabled={aEnviar}
          onClick={fechar}
          className="w-full md:w-auto"
        >
          {t.cancel}
        </Button>
        <Button
          variant="destructive"
          disabled={aEnviar}
          onClick={() => void pedirApagamento()}
          className="w-full md:w-auto"
        >
          {aEnviar ? t.sending : t.confirm}
        </Button>
      </Modal>
    </ZonaPerigo>
  );
}
