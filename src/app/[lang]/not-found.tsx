import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { NaoEncontrada } from "@/components/erros/nao-encontrada";
import { getDictionary } from "@/i18n/dictionaries";

// 404 do site público, no idioma da rota (frames YhUOx / LJWAP do design-system.pen).
// Serve os `notFound()` das páginas em [lang] e, via [lang]/[...rota]/page.tsx, qualquer
// endereço que não corresponda a uma rota.

export default async function NaoEncontradaSite() {
  const { common, erros } = await getDictionary();
  const t = erros.naoEncontrada;
  return (
    <>
      <Nav />
      <NaoEncontrada
        t={t}
        cta={common.cta}
        pathsTitle={t.pathsTitle}
        paths={[
          { href: "/", name: t.home, description: t.homeDescription },
          { href: "/servicos", name: common.nav.services, description: t.servicesDescription },
        ]}
      />
      <Footer />
    </>
  );
}
