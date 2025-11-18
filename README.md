This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# System Requirements

Before getting started, ensure you have the following installed on your system:

## Required Software

- **Node.js**: >= 20.x (recommended: latest LTS version)

  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **Package Manager**: Choose one of the following:
  - **npm** (comes with Node.js)
  - **Yarn** (recommended for this project)
    - Install: `npm install -g yarn`
    - Verify installation: `yarn --version`

## Platform-Specific Requirements

### For iOS Development (macOS only)

- **macOS**: Latest version recommended
- **Xcode**: Latest version from Mac App Store
- **Xcode Command Line Tools**: Install via `xcode-select --install`
- **CocoaPods**: Ruby gem used for iOS dependency management
  - Install: `sudo gem install cocoapods`
  - Verify: `pod --version`
- **Ruby**: Usually pre-installed on macOS

### For Android Development

- **Java Development Kit (JDK)**: JDK 17 or higher
  - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or use OpenJDK
- **Android Studio**: Latest version
  - Download from [developer.android.com](https://developer.android.com/studio)
- **Android SDK**: Installed via Android Studio
  - Android SDK Platform 33 or higher
  - Android SDK Build-Tools
- **Environment Variables**:
  - `ANDROID_HOME` pointing to your Android SDK location
  - `JAVA_HOME` pointing to your JDK installation
- **Android Emulator** or physical device with USB debugging enabled

### For Web Development

- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **No additional setup required** - Webpack and dev server are included

## Development Tools (Optional but Recommended)

- **Git**: For version control
- **VS Code** or **Android Studio** / **Xcode**: For code editing and debugging
- **React Native Debugger**: For debugging React Native apps

## Verification

After installation, verify your setup:

```sh
# Check Node.js version
node --version

# Check package manager
npm --version  # or yarn --version

# For iOS (macOS only)
xcodebuild -version
pod --version

# For Android
java -version
adb version
```

> **Note**: For detailed setup instructions, refer to the official [React Native Environment Setup Guide](https://reactnative.dev/docs/set-up-your-environment).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
