import { getAllProjects, getAllServices, getAllBlogPosts } from "../src/lib/content";
import { locales } from "../src/i18n/config";

// Todos os idiomas têm de ter exactamente as mesmas fichas (slugs) de serviços e
// projetos que o português — uma tradução em falta é erro de build, não página 404.
const ref = {
  projects: getAllProjects("pt").map((p) => p.slug).sort(),
  services: getAllServices("pt").map((s) => s.slug).sort(),
};

console.log(`pt: ${ref.projects.length} projetos, ${ref.services.length} serviços (esperado: 1 / 9)`);
if (ref.projects.length !== 1) throw new Error("Número de projetos inesperado.");
if (ref.services.length !== 9) throw new Error("Número de serviços inesperado.");

for (const lang of locales) {
  const projects = getAllProjects(lang).map((p) => p.slug).sort();
  const services = getAllServices(lang).map((s) => s.slug).sort();
  const posts = getAllBlogPosts(lang);
  console.log(`${lang}: ${projects.length} projetos, ${services.length} serviços, ${posts.length} posts`);
  if (projects.join() !== ref.projects.join()) throw new Error(`${lang}: projetos diferentes de pt.`);
  if (services.join() !== ref.services.join()) throw new Error(`${lang}: serviços diferentes de pt.`);
  if (posts.length !== 0) throw new Error(`${lang}: não deveria haver posts publicados ainda.`);
}

console.log("OK — camada de conteúdo válida.");
