import { useAuth } from "@/features/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import * as React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from "react-native";

type AuthMode = "sign-in" | "sign-up";

export function AuthScreen() {
  const { signInWithPassword, signUpWithPassword } = useAuth();
  const [mode, setMode] = React.useState<AuthMode>("sign-in");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = React.useState<string | null>(null);

  async function handleSubmit() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setErrorMessage("Enter both an email address and password.");
      setNoticeMessage(null);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setNoticeMessage(null);

    try {
      if (mode === "sign-in") {
        const result = await signInWithPassword(normalizedEmail, password);

        if (result.errorMessage) {
          setErrorMessage(result.errorMessage);
          return;
        }

        return;
      }

      const result = await signUpWithPassword(normalizedEmail, password);

      if (result.errorMessage) {
        setErrorMessage(result.errorMessage);
        return;
      }

      setNoticeMessage(
        result.requiresEmailConfirmation
          ? "Account created. Confirm your email before signing in."
          : "Account created and signed in."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 items-center justify-center bg-stone-100 px-6"
    >
      <View className="w-full max-w-[420px] gap-3 rounded-lg p-6">
        <View className="mt-3 gap-4">
          <View className="gap-2">
            <Text variant="small" className="text-zinc-700">
              Email
            </Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              className="rounded-xl border border-zinc-300 bg-stone-50 px-3.5 py-3 text-base text-zinc-950"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#71717a"
              value={email}
            />
          </View>

          <View className="gap-2">
            <Text variant="small" className="text-zinc-700">
              Password
            </Text>
            <TextInput
              autoCapitalize="none"
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              className="rounded-xl border border-zinc-300 bg-stone-50 px-3.5 py-3 text-base text-zinc-950"
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#71717a"
              secureTextEntry
              value={password}
            />
          </View>

          {errorMessage ? <Text className="text-red-700">{errorMessage}</Text> : null}
          {noticeMessage ? <Text className="text-green-700">{noticeMessage}</Text> : null}

          <Button className="mt-2" disabled={isSubmitting} onPress={handleSubmit}>
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text>{mode === "sign-in" ? "Sign in" : "Create account"}</Text>
            )}
          </Button>

          <Pressable
            disabled={isSubmitting}
            onPress={() => {
              setMode((currentMode) => (currentMode === "sign-in" ? "sign-up" : "sign-in"));
              setErrorMessage(null);
              setNoticeMessage(null);
            }}
          >
            <Text className="text-center text-teal-700">
              {mode === "sign-in"
                ? "Need an account? Create one with email and password."
                : "Already have an account? Sign in instead."}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
