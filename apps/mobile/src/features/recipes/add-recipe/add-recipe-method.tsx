import { Pressable, View } from "react-native";
import { ChevronRight, Pencil, Sparkles, Upload } from "lucide-react-native";
import { Text } from "@/components/ui/text";

export function AddRecipeMethodSelection({
  onManualPress,
}: {
  onManualPress: () => void;
}) {
  return (
    <View className="pt-4">
      <Text className="text-2xl font-bold text-foreground">
        How would you like to add your recipe?
      </Text>

      <View className="mt-6 gap-4">
        <AddRecipeMethodCard
          icon={<Pencil size={24} color="white" />}
          title="Enter Manually"
          description="Add your recipe step by step using a simple form."
          onPress={onManualPress}
        />

        <AddRecipeMethodCard
          icon={<Sparkles size={24} color="white" />}
          title="Paste Text"
          description="Paste a recipe and we'll extract the details."
          onPress={() => {}}
        />

        <AddRecipeMethodCard
          icon={<Upload size={24} color="white" />}
          title="Upload Photo"
          description="Take or upload a photo and we'll extract it for you."
          onPress={() => {}}
        />
      </View>

      <View className="mt-6 rounded-xl bg-brand/10 p-4">
        <Text className="font-semibold text-foreground">Tip</Text>
        <Text className="mt-1 text-sm text-muted-foreground">
          Our AI works best with clearly written recipes that include
          ingredients and instructions.
        </Text>
      </View>
    </View>
  );
}

function AddRecipeMethodCard({
  icon,
  title,
  description,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-xl border border-border bg-card p-4"
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-brand">
        {icon}
      </View>

      <View className="ml-4 flex-1">
        <Text className="font-semibold text-foreground">{title}</Text>
        <Text className="mt-1 text-sm text-muted-foreground">
          {description}
        </Text>
      </View>

      <ChevronRight size={20} className="text-muted-foreground" />
    </Pressable>
  );
}
