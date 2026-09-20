import Link from "@/i18n/locale-link";
import { cn } from "@/lib/cn";

function Wordmark({ size = "nav" }: { size?: "nav" | "footer" }) {
  return (
    <span
      className={cn(
        "font-heading tracking-[var(--letter-spacing-title)]",
        size === "nav" ? "text-body-lg" : "text-title-sm",
      )}
    >
      <span className="font-bold text-text-accent">Ev</span>
      <span className="font-semibold text-text-primary">Digital</span>
    </span>
  );
}

export function BrandLink({ size = "nav" }: { size?: "nav" | "footer" }) {
  return (
    <Link href="/" className="flex h-11 items-center">
      <Wordmark size={size} />
    </Link>
  );
}
