# Connect to the `ai-interview-buddy-prod` project

```sh
npx supabase login
npx supabase projects list
npx supabase link --project-ref ihledqmotlhyxnqoipzd
```

# Run the db migrations

```sh
npx supabase db push
```

# Config the oAuh Provider

1. Navigate `dashboard > Authentication > Sign In / Providers`
2. Disable Email and save 
3. Enable Google:
    - ClientId/Secret cames from Google Cloud https://www.youtube.com/watch?v=2SEz6SK_ekE&t=305s
    - Enable `Skip nonce checks`
    - Save

Remember to add the callback url to "Google Auth Platform" on https://console.cloud.google.com/auth/clients

# Edge Function Secrets

1. Navigate `dashboard > Edge Functions > Secrets`
2. Setup:
    - OPENAI_API_KEY
    - DEEPGRAM_API_KEY
    - ALLOWED_ORIGINS
    - see more details on setup-your-environment.md
3. Then deploy using the following command

```sh
npx supabase functions deploy api
```
