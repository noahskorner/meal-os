import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        onPress={() => {
          console.log("Button pressed");
        }}
      >
        <Text>Hello world</Text>
      </Button>
    </View>
  );
}
