import { supabase } from "@/lib/supabase";
import {
  createWebClient,
  type components,
  type WebClientOptions,
} from "@/lib/web-client";

export type ListIngredientResponse =
  components["schemas"]["ListIngredientResponse"];
export type ListIngredientsResponse =
  components["schemas"]["ListIngredientsResponse"];

const webUrl = process.env.EXPO_PUBLIC_WEB_URL;

if (!webUrl) {
  throw new Error("Missing EXPO_PUBLIC_WEB_URL for the mobile app.");
}

export function createWebApiClient(options: WebClientOptions = {}) {
  const baseFetch = options.fetch ?? globalThis.fetch;

  return createWebClient({
    baseUrl: webUrl,
    ...options,
    async fetch(request) {
      const headers = new Headers(request.headers);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${session.access_token}`);
      }

      return baseFetch(new Request(request, { headers }));
    },
  });
}

export const webApiClient = createWebApiClient();
