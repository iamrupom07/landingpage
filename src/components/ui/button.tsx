import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-5 text-sm font-bold transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-slate-950 text-white shadow-[0_14px_35px_rgba(15,23,42,0.18)] hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lift",
        primary:
          "bg-[linear-gradient(135deg,#0F172A_0%,#2563EB_52%,#16A34A_100%)] text-white shadow-glow hover:-translate-y-0.5 hover:shadow-lift",
        outline:
          "border border-slate-200 bg-white/90 text-slate-950 shadow-sm backdrop-blur hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-lift",
        ghost: "text-slate-700 hover:bg-white/80 hover:text-slate-950 hover:shadow-sm",
        link: "h-auto px-0 text-slate-950 underline-offset-4 hover:underline"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4",
        lg: "h-12 px-6",
        icon: "h-10 w-10 p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
