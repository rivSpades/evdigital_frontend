import { cn } from "@/lib/cn";

// Cabeçalho de secção do frame Home: título $font-size-headline no wide e
// $font-size-title no narrow, subtítulo $font-size-body-lg / $font-size-body.

export function SectionTitle({
  children,
  className,
  id,
}: {
  children: string;
  className?: string;
  id?: string;
}) {
  return (
    <h2
      id={id}
      className={cn(
        "font-heading font-bold text-text-primary",
        "text-title tracking-[var(--letter-spacing-title)]",
        "lg:text-headline lg:tracking-[var(--letter-spacing-headline)]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function SectionHeading({
  title,
  subtitle,
  id,
}: {
  title: string;
  subtitle: string;
  id?: string;
}) {
  return (
    <div className="flex flex-col gap-xs lg:gap-sm">
      <SectionTitle id={id}>{title}</SectionTitle>
      <p className="font-body text-body text-text-secondary lg:max-w-[720px] lg:text-body-lg">
        {subtitle}
      </p>
    </div>
  );
}
