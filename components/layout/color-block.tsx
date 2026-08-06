import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const colorBlockVariants = cva(
  "w-full rounded-none md:rounded-lg px-6 py-12 md:p-[48px] my-[96px]",
  {
    variants: {
      color: {
        lime: "bg-block-lime text-ink",
        lilac: "bg-block-lilac text-ink",
        navy: "bg-block-navy text-inverse-ink",
        cream: "bg-block-cream text-ink",
        mint: "bg-block-mint text-ink",
        pink: "bg-block-pink text-ink",
        coral: "bg-block-coral text-ink",
      },
    },
    defaultVariants: {
      color: "lime",
    },
  }
)

export interface ColorBlockProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof colorBlockVariants> {}

const ColorBlock = React.forwardRef<HTMLDivElement, ColorBlockProps>(
  ({ className, color, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(colorBlockVariants({ color, className }))}
        {...props}
      />
    )
  }
)
ColorBlock.displayName = "ColorBlock"

export { ColorBlock, colorBlockVariants }