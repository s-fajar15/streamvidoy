import { forwardRef, type ButtonHTMLAttributes } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-sans text-[14px] font-medium leading-[1.30] tracking-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground rounded-full hover:bg-charcoal",
        accent: "bg-brand-green text-primary rounded-full hover:bg-brand-green-deep",
        secondary: "bg-transparent text-foreground border border-hairline rounded-full hover:bg-surface",
        onDark: "bg-white text-primary rounded-full hover:bg-slate-100",
        ghost: "bg-transparent text-foreground rounded-md hover:bg-surface px-3 py-2",
        icon: "bg-background text-foreground border border-hairline rounded-full h-[32px] w-[32px]",
      },
      size: {
        default: "px-[20px] py-[10px]",
        sm: "px-[16px] py-[8px]",
        icon: "h-[32px] w-[32px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
