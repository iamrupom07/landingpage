import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, align = "center", className }: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto max-w-3xl", align === "center" ? "text-center" : "mx-0 text-left", className)}>
      {eyebrow ? <p className={cn("eyebrow mb-4", align === "center" && "mx-auto")}>{eyebrow}</p> : null}
      <h2 className="font-display text-3xl font-extrabold leading-[1.04] text-slate-950 sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? <p className="mt-5 text-lg leading-8 text-slate-600">{description}</p> : null}
    </div>
  );
}
