import { BookOpen, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { levelLabel, type BlogLevel } from "@/lib/blog";
import { getDictionary } from "@/i18n/dictionaries";

// Etiqueta de nível repetida em todos os frames de blog do .pen: badge neutra em
// $font-size-caption, com ícone de 14 (book-open para simples, terminal para técnico).

export async function LevelBadge({ level }: { level: BlogLevel }) {
  const { blog: t } = await getDictionary();
  const Icon = level === "simples" ? BookOpen : Terminal;

  return (
    <Badge tone="neutral" size="sm" icon={<Icon size={14} strokeWidth={2} aria-hidden />}>
      {levelLabel(t, level)}
    </Badge>
  );
}
