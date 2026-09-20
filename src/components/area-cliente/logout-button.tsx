"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { localizePath, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

export function LogoutButton({ lang, label }: { lang: Locale; label: string }) {
  const router = useRouter();
  const [aSair, setASair] = useState(false);

  async function sair() {
    setASair(true);
    try {
      await fetch("/api/area-cliente/sair", { method: "POST" });
    } finally {
      router.push(localizePath(lang, "/area-cliente/entrar"));
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={sair}
      disabled={aSair}
      className={cn(
        "flex h-9 items-center gap-xs rounded-[var(--radius-sm)] px-sm",
        "font-body text-caption text-text-secondary transition-colors",
        "hover:bg-bg-surface-hover hover:text-text-primary disabled:opacity-60",
      )}
    >
      <LogOut size={16} strokeWidth={2} aria-hidden />
      {label}
    </button>
  );
}
