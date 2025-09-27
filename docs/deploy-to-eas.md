# Deploy to EAS

https://docs.expo.dev/build/setup/

```sh
npm install -g eas-cli
eas login

eas build:configure
eas build --platform android

eas build --platform ios
eas submit --platform ios
```

Follow this guide:

https://github.com/expo/fyi/blob/main/creating-google-service-account.md


```
eas submit --platform android
npx eas-cli deploy
```


```
npx expo export --platform web
npx serve dist -l 8081
```


# Create and run a cloud build for iOS device

https://docs.expo.dev/tutorial/eas/ios-development-build-for-devices/

```

npx eas device:create
npx eas build --platform ios --profile preview
```
