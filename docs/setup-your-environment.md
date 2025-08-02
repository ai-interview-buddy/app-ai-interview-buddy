# Setup your environment

This guide goes through on how to setup your local computer.

# 1. Install Xcode OR Android Studio

You can start by setting up just your favorite option, either, android or ios. 

It's recommented to use the an emulator.

https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build&platform=ios&device=simulated

# 2. Install NodeJs

First install node by following: https://nodejs.org/en/download

Then run in the terminal: `npm install`

# 3. Install Docker

Follow this guide: https://docs.docker.com/desktop/

# 4. Supabase envs

Create a copy of the file `supabase/.env.template` as `supabase/.env`. By default, you can use the test user and don't need to fill in the oAuth social information.

Then create a copy of functions env file, from `supabase/functions/.env.template` to `supabase/functions/.env`. You will need to change the following values:
- **OPENAI_API_KEY**: Open AI is used to parse positions and as main LLM provider. You can follow this guide to issue a token: https://platform.openai.com/docs/api-reference/introduction
- **DEEPGRAM_API_KEY**: Deepgram is the provider of `speech to text` and `text to speech`. The trial/free account will do the job, follow this guide: https://developers.deepgram.com/docs/voice-agent

You should now be able to run supabase, mind this will take a while in the first time:

```sh
npx supabase start
```

Once it finishes, you should see a success message like the following. Two pieces of information will be used later: `API URL` and `anon key`.

```sh
Started supabase local development setup.

    API URL: http://127.0.0.1:54321
    GraphQL URL: http://127.0.0.1:54321/graphql/v1
    S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
    DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
    Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
    JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
    anon key: eyJhb....
    [...]
```

4. Config main `.env`

Now you should create a copy the file `.env.template` (in the root of the project) as `.env.local`.

You should change the following values:
- **EXPO_PUBLIC_SUPABASE_URL**: use the value `API URL` from supabase step
- **EXPO_PUBLIC_SUPABASE_ANON_KEY**: use the value `anon key` from supabase step

5. Running expo

Now you should be ready to start the project, you can find the commands in the main `readme.md`. 

For running expo in the web browser: `npx expo start`. 

For running expo in android: `npx expo run:android` or ios `npx expo run:ios`.
