import { supabase } from "@/lib/supabase";
import { createClient, type Client, type Config } from "@repo/web-api-client";

const webUrl = process.env.EXPO_PUBLIC_WEB_URL;

if (!webUrl) {
  throw new Error("Missing EXPO_PUBLIC_WEB_URL for the mobile app.");
}

export type WebApiClient = Client;
export type WebApiClientOptions = Config;

export function createWebApiClient(options: WebApiClientOptions = {}) {
  const baseFetch = options.fetch ?? globalThis.fetch;

  return createClient({
    baseUrl: webUrl,
    ...options,
    async fetch(input, init) {
      const request = new Request(input, init);
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
