import { Text } from "@/components/ui/text";
import * as React from "react";
import { View } from "react-native";

type TabPlaceholderScreenProps = {
  eyebrow: string;
  title: string;
  description: string;
  footer?: React.ReactNode;
};

export function TabPlaceholderScreen({
  eyebrow,
  title,
  description,
  footer,
}: TabPlaceholderScreenProps) {
  return (
    <View className="flex-1 bg-background px-6 py-10">
      <View className="flex-1 items-start justify-center">
        <View className="w-full max-w-md gap-4">
          <View className="self-start rounded-full bg-brand-muted px-3 py-1">
            <Text className="text-xs font-semibold uppercase tracking-[1px] text-brand">
              {eyebrow}
            </Text>
          </View>

          <View className="gap-3">
            <Text className="text-4xl font-semibold tracking-tight text-foreground">
              {title}
            </Text>
            <Text className="text-base leading-6 text-muted-foreground">
              {description}
            </Text>
          </View>

          {footer ? <View className="pt-4">{footer}</View> : null}
        </View>
      </View>
    </View>
  );
}
