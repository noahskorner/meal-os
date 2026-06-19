import * as React from "react";
import { Pressable, Text } from "react-native";
import { Pressable as SlotPressable } from "@rn-primitives/slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";

const buttonVariants = cva(
  "flex-row items-center justify-center rounded-2xl border border-transparent active:opacity-90 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-brand-500",
        secondary: "bg-white/10",
        outline: "border-zinc-800 bg-transparent",
      },
      size: {
        default: "min-h-12 px-5 py-3",
        sm: "min-h-10 px-4 py-2.5",
        lg: "min-h-14 px-6 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva("text-sm font-semibold", {
  variants: {
    variant: {
      default: "text-white",
      secondary: "text-white",
      outline: "text-zinc-100",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

type ButtonTextProps = React.ComponentPropsWithoutRef<typeof Text> &
  Pick<VariantProps<typeof buttonTextVariants>, "variant">;

const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(({ asChild = false, className, size, variant, ...props }, ref) => {
  const Component = asChild ? SlotPressable : Pressable;

  return (
    <Component
      className={cn(buttonVariants({ size, variant }), className)}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

const ButtonText = React.forwardRef<
  React.ElementRef<typeof Text>,
  ButtonTextProps
>(({ className, variant, ...props }, ref) => {
  return (
    <Text
      className={cn(buttonTextVariants({ variant }), className)}
      ref={ref}
      {...props}
    />
  );
});

ButtonText.displayName = "ButtonText";

export { Button, ButtonText, buttonTextVariants, buttonVariants };
