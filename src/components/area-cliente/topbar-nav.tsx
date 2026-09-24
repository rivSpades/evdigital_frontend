"use client";

import { usePathname } from "next/navigation";
import Link from "@/i18n/locale-link";
import { cn } from "@/lib/cn";

// Navegação da barra de topo da Área de Cliente (ver `topbar.tsx`): o item activo vem do
// segmento da rota e diz-se por peso e cor do texto, com aria-current="page".

export type TopbarNavItem = { href: string; segment: string; label: string };

export function TopbarNav({
  items,
  ariaLabel,
  className,
}: {
  items: TopbarNavItem[];
  ariaLabel: string;
  className?: string;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label={ariaLabel} className={cn("flex min-w-0 items-center gap-2xs", className)}>
      {items.map((item) => {
        const ativo = segments.includes(item.segment);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={ativo ? "page" : undefined}
            className={cn(
              "flex h-11 items-center px-sm font-body text-label whitespace-nowrap transition-colors",
              ativo
                ? "font-semibold text-text-primary"
                : "font-medium text-text-secondary hover:text-text-primary",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
