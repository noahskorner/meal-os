# Mobile App

The Expo app now includes Supabase email/password authentication with protected routing.

## Environment

Copy `apps/mobile/.env.example` to `apps/mobile/.env` and provide:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

These values are safe to expose in the client when Row Level Security is enabled in Supabase.

## Run

From the repository root:

```bash
npm install
npm run start --workspace=mobile
```

If Supabase email confirmation is enabled, new users will need to confirm their email before the app can create an authenticated session.
