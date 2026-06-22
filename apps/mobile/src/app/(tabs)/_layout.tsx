import { THEME } from "@/lib/theme";
import {
  BookOpenText,
  CalendarCheck2,
  House,
  ListChecks,
  UserRound,
  type LucideIcon,
} from "lucide-react-native";
import { Tabs } from "expo-router";
import { Platform, useColorScheme } from "react-native";

type TabBarIconProps = {
  color: string;
  icon: LucideIcon;
};

function TabBarIcon({ color, icon: Icon }: TabBarIconProps) {
  return <Icon color={color} size={20} strokeWidth={2.25} />;
}

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? THEME.dark : THEME.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.brand,
        tabBarInactiveTintColor: palette.mutedForeground,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: palette.card,
          borderTopColor: palette.border,
          height: Platform.select({ ios: 84, default: 72 }),
          paddingTop: 8,
          paddingBottom: Platform.select({ ios: 20, default: 8 }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon color={color} icon={House} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: "Plan",
          tabBarIcon: ({ color }) => (
            <TabBarIcon color={color} icon={CalendarCheck2} />
          ),
        }}
      />
      <Tabs.Screen
        name="lists"
        options={{
          title: "Lists",
          tabBarIcon: ({ color }) => (
            <TabBarIcon color={color} icon={ListChecks} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recipes",
          tabBarIcon: ({ color }) => (
            <TabBarIcon color={color} icon={BookOpenText} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <TabBarIcon color={color} icon={UserRound} />
          ),
        }}
      />
    </Tabs>
  );
}
