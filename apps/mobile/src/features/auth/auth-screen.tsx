import { useAuth } from "@/features/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import * as React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from "react-native";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react-native";

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
          : "Account created and signed in.",
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
      <View className="w-full max-w-[420px] gap-3 rounded-lg">
        <View className="mt-3 gap-4">
          <View className="gap-2">
            <Label nativeID="email-label">Email</Label>
            <Input
              aria-labelledby="email-label"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              size="lg"
              placeholder="you@example.com"
              value={email}
            />
          </View>

          <View className="gap-2">
            <Label nativeID="password-label">Password</Label>
            <Input
              aria-labelledby="password-label"
              autoCapitalize="none"
              autoComplete={
                mode === "sign-in" ? "current-password" : "new-password"
              }
              onChangeText={setPassword}
              placeholder="Enter your password"
              size="lg"
              secureTextEntry
              value={password}
            />
          </View>

          {errorMessage ? (
            <Alert variant="destructive" icon={AlertCircleIcon}>
              <AlertTitle>{errorMessage}</AlertTitle>
            </Alert>
          ) : null}
          {noticeMessage ? (
            <Alert icon={AlertCircleIcon}>
              <AlertTitle>{noticeMessage}</AlertTitle>
            </Alert>
          ) : null}

          <Button
            variant="brand"
            className="mt-2"
            disabled={isSubmitting}
            onPress={handleSubmit}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text>{mode === "sign-in" ? "Sign in" : "Create account"}</Text>
            )}
          </Button>

          <Pressable
            disabled={isSubmitting}
            onPress={() => {
              setMode((currentMode) =>
                currentMode === "sign-in" ? "sign-up" : "sign-in",
              );
              setErrorMessage(null);
              setNoticeMessage(null);
            }}
          >
            <Text className="text-center text-sm text-muted-foreground font-medium">
              {mode === "sign-in" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <Text className="font-semibold text-brand text-sm">
                    Sign up
                  </Text>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Text className="font-semibold text-brand text-sm">
                    Sign in
                  </Text>
                </>
              )}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
