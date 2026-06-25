import { Input, type InputProps } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { ActivityIndicator, Pressable, View } from "react-native";

type SearchInputProps = Omit<InputProps, "className"> & {
  containerClassName?: string;
  inputClassName?: string;
  isLoading?: boolean;
  onClear?: () => void;
};

export function SearchInput({
  containerClassName,
  inputClassName,
  isLoading = false,
  onClear,
  value,
  ...props
}: SearchInputProps) {
  const { colorScheme } = useColorScheme();
  const palette = colorScheme === "dark" ? THEME.dark : THEME.light;
  const hasValue = typeof value === "string" && value.length > 0;

  return (
    <View className={cn("relative", containerClassName)}>
      <Input
        value={value}
        className={cn(
          "rounded-lg border-input bg-card pl-10 pr-10",
          inputClassName,
        )}
        placeholderTextColor={palette.mutedForeground}
        {...props}
      />

      <View className="absolute inset-y-0 left-0 w-10 items-center justify-center">
        <Icon as={Search} size={18} className="text-muted-foreground" />
      </View>

      <View className="absolute inset-y-0 right-0 w-10 items-center justify-center">
        <View className="relative h-5 w-5 items-center justify-center">
          <ActivityIndicator
            animating={isLoading}
            color={palette.mutedForeground}
            size="small"
            className="absolute"
          />

          {!isLoading && hasValue && onClear ? (
            <Pressable
              className="absolute h-5 w-5 items-center justify-center"
              hitSlop={8}
              onPress={onClear}
            >
              <Icon as={X} size={18} className="text-muted-foreground" />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}
