import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Platform, TextInput } from "react-native";

const inputVariants = cva(
  "dark:bg-input/30 border-input bg-background text-foreground flex w-full min-w-0 flex-row items-center rounded-md border shadow-sm shadow-black/5",
  {
    variants: {
      size: {
        sm: "h-9 px-3 py-1 text-sm leading-5",
        default: "h-10 px-3 py-1 text-base leading-5 sm:h-9",
        lg: "h-11 px-4 py-2 text-base leading-6 sm:h-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type InputProps = React.ComponentProps<typeof TextInput> &
  React.RefAttributes<TextInput> &
  VariantProps<typeof inputVariants>;

function Input({ className, size, ...props }: InputProps) {
  return (
    <TextInput
      className={cn(
        inputVariants({ size }),
        props.editable === false &&
          cn(
            "opacity-50",
            Platform.select({
              web: "disabled:pointer-events-none disabled:cursor-not-allowed",
            }),
          ),
        Platform.select({
          web: cn(
            "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          ),
          native: "placeholder:text-muted-foreground/50",
        }),
        className,
      )}
      {...props}
    />
  );
}

export { Input, inputVariants };
export type { InputProps };
