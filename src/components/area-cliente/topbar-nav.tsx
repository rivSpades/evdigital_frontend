"use client";

import { usePathname } from "next/navigation";
import Link from "@/i18n/locale-link";
import { cn } from "@/lib/cn";

export type TopbarNavItem = { href: string; segment: string; label: string };

export function TopbarNav({ items, ariaLabel }: { items: TopbarNavItem[]; ariaLabel: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label={ariaLabel} className="flex items-center gap-xs">
      {items.map((item) => {
        const ativo = segments.includes(item.segment);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={ativo ? "page" : undefined}
            className={cn(
              "rounded-[var(--radius-md)] px-md py-xs font-body text-label transition-colors",
              ativo
                ? "bg-bg-surface-hover font-medium text-text-primary"
                : "text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
