import Link from "@/i18n/locale-link";
import { ArrowLeft } from "lucide-react";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="-ml-xs inline-flex min-h-[var(--tap-target-min,44px)] w-fit items-center gap-xs rounded-[var(--radius-md)] px-xs font-body text-label font-medium text-text-link hover:text-text-accent"
    >
      <ArrowLeft size={18} strokeWidth={2} aria-hidden />
      {label}
    </Link>
  );
}
