import { Text } from "@/components/ui/text";
import type { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type HeaderProps = {
  left?: ReactNode;
  title: string;
  right?: ReactNode;
};

export function Header({ left, title, right }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-background px-4"
      style={{
        paddingTop: insets.top,
        height: 64 + insets.top,
      }}
    >
      <View className="flex-1 flex-row items-center">
        <View className="flex-1 items-start justify-center">
          {left ?? <HeaderSpacer />}
        </View>

        <View className="flex-1 items-center justify-center px-3">
          <Text
            className="text-base font-semibold text-foreground"
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        <View className="flex-1 items-end justify-center">
          {right ?? <HeaderSpacer />}
        </View>
      </View>
    </View>
  );
}

function HeaderSpacer() {
  return <View className="h-10 w-10" />;
}
