import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
  type BottomSheetModalProps,
} from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";
import * as React from "react";
import { View } from "react-native";

type BottomSheetProps = Omit<
  BottomSheetModalProps,
  "backgroundStyle" | "handleIndicatorStyle" | "handleStyle"
>;

const SHEET_RADIUS = 24;

function BottomSheetOverlay(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.6}
      pressBehavior="close"
      {...props}
    />
  );
}

const BottomSheet = React.forwardRef<
  React.ElementRef<typeof BottomSheetModal>,
  BottomSheetProps
>(function BottomSheet(
  {
    enableDismissOnClose = true,
    enablePanDownToClose = true,
    children,
    ...props
  },
  ref,
) {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? THEME.dark : THEME.light;

  return (
    <BottomSheetModal
      ref={ref}
      backgroundStyle={{
        backgroundColor: theme.card,
        borderRadius: SHEET_RADIUS,
      }}
      backdropComponent={BottomSheetOverlay}
      enableDismissOnClose={enableDismissOnClose}
      enablePanDownToClose={enablePanDownToClose}
      handleIndicatorStyle={{
        backgroundColor: theme.mutedForeground,
        height: 4,
        width: 40,
      }}
      handleStyle={{
        paddingTop: 8,
      }}
      {...props}
    >
      {children}
    </BottomSheetModal>
  );
});

type BottomSheetContentProps = React.ComponentProps<typeof BottomSheetView> & {
  className?: string;
};

function BottomSheetContent({
  children,
  className,
  ...props
}: BottomSheetContentProps) {
  return (
    <BottomSheetView {...props}>
      <View className={cn("gap-4 px-6 pb-8 pt-2", className)}>{children}</View>
    </BottomSheetView>
  );
}

export { BottomSheet, BottomSheetContent };
