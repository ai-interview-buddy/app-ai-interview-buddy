# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

```bash
npm install
```

2. Start the app

```bash
npx supabase start
npx supabase functions serve
npx expo start

adb reverse tcp:54321 tcp:54321
npx expo run:android

npx expo run:ios

# npx expo run:ios --device
# Change .env to EXPO_PUBLIC_SUPABASE_URL=http://YOUR_LOCAL_IP_HERE:54321
# npx expo run:android --device
# cd ios/ && pod install --repo-update && cd ..
# npx expo prebuild --clean 
```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# Setup env
https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build&platform=android&device=simulated

# Supabase

```sh
# start/restart
npx supabase stop && npx supabase start

# db migrations
npx supabase migration new career-profiles
npx supabase migration up 
# npx supabase db reset 

# functions
npx supabase functions new api
npx supabase functions serve

# functions debugging 
npx supabase functions serve --inspect-mode brk
chrome://inspect/
-> 127.0.0.1:8083
```

# Setup Auth Google

1. Create a google cloud project and then setup `3` Google OAuth 2.0 Client IDs
2. `Ai Interview Buddy - Web`: 
   - The value "Client ID" is used in .env
   - Also client and secret are used in `supabase/.env`
   - Important, in the toml file, `skip_nonce_check` should be true
3. `Ai Interview Buddy - Ios`: The value "iOS URL scheme" it's used in `.env` iosUrlScheme
4. `Ai Interview Buddy - Android`: The value "Client ID" is used in `android/app/.../strings.xml`
   - To get the sha1 certificate can be found by: `keytool -keystore ./android/app/debug.keystore -list -v`
   - The password is default, `android`
   - Then use the value SHA1

References:
- https://react-native-google-signin.github.io/docs/install
- https://www.youtube.com/watch?v=vojHmGUGUGc
- https://supabase.com/docs/guides/auth/social-login/auth-google
- https://developers.google.com/android/guides/client-auth
- https://github.com/flemingvincent/expo-supabase-starter/blob/main/context/supabase-provider.tsx

# Setup Auth IoS

Part 1 - creating a service:
1. Follow https://docs.expo.dev/versions/latest/sdk/apple-authentication/
2. Run `npx expo prebuild` and then `eas build --platform ios` (this will create the oAuth client in apple developer)
3. Navigate https://developer.apple.com/account > Identifiers > App IDs > [new Service ID]
4. Description as `Ai Interview Buddy - Web` and identifier as `com.aiinterviewbuddy.appinterviewbuddy.web`
5. Open the created record and make sure it has `Sign In with Apple` enabled and add:
   - Domains: app.aiinterviewbuddy.com,ihledqmotlhyxnqoipzd.supabase.co
   - Return URLs: https://app.aiinterviewbuddy.com/auth,https://ihledqmotlhyxnqoipzd.supabase.co/auth/v1/callback

Part 2 - creating a new key:
1. Navigate https://developer.apple.com/account > Identifiers > Keys > [new Key]
   - Name as `Ai Interview Buddy Web Key`
   - check the option `Sign in with Apple`
   - Configure/select `Primary App ID` as ``com.aiinterviewbuddy.appinterviewbuddy`
2. Copy the `Key ID` and download the `AuthKey_XXXXXXXXXX.p8`

Part 3 - convert all info into a jwt
1. Use the tool https://applekeygen.expo.app/ OR similar on https://supabase.com/docs/guides/auth/social-login/auth-apple
2. Inform: 
   - `Key ID` from step 2;
   - `Team ID` from apple developer account (corner top right)
   - `Client ID` equals com.aiinterviewbuddy.appinterviewbuddy.web
   - `Private Key` from step 2 `.p8` file
   Then generate your jwt client secret token
3. Navigate to `supabase > auth> providers > Apple`, and update:
   - Client IDs: com.aiinterviewbuddy.appinterviewbuddy.web,com.aiinterviewbuddy.appinterviewbuddy
   - Secret Key: from previous step

Steps 2 and 3 should be repeated every 6 months.

References:
- https://supabase.com/docs/guides/auth/social-login/auth-apple?queryGroups=platform&platform=react-native
- https://www.youtube.com/watch?v=-tpcZzTdvN0&t=270s
- https://www.youtube.com/watch?v=tqxTijhYhp8&t=1s

# Project colour scheme

Brand core:
* Primary (Yellow): #FFC629 → rgb(255, 198, 41)
* Secondary (Black): #1D252C → rgb(29, 37, 44)
* Tertiary (Soft white/Pollen/Gold):
   - Soft White: #FEFBED → rgb(254, 251, 237)
   - Pollen: #FFF7DE → rgb(255, 247, 222)
   - Golden Honey: #E3AA1F → rgb(227, 170, 31)

 # Backlog
-  [ ] Change the "delete" career track option to allow replacing positions that uses it
-  [ ] tech: extract all forms in a proper file; 
-  [ ] tech: review all exceptions to the controllers and proper logging; 
-  [ ] remove agent and use openai js
-  [ ] lunch ios
-  [ ] lunch android
-  [ ] add an option to "re-try" in the case upload fails
-  [ ] add an option to "choose" what mic to use
-  [ ] allow to rename or delete an interview
-  [ ] Improve the experience for the main save button
-  [ ] Create a dark mode
-  [ ] Recording interview: when start recording, also, create the record and store the fine in a "expected" location; Then allow to recover
-  [ ] Adding missing timeline items types (including interview schedulled and cv analyse)
-  [ ] Add option to delete an account
