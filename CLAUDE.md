# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native demo application showcasing Web3Modal (AppKit) integration with Ethers.js for blockchain wallet connections and interactions. The app demonstrates various Web3 operations including signing messages, sending transactions, and smart contract interactions.

## Key Architecture

- **Web3 Integration**: Uses Reown's AppKit (formerly Web3Modal) with Ethers.js provider
- **Wallet Support**: Supports multiple wallet connections including WalletConnect, Coinbase, and custom wallets
- **Chain Configuration**: Pre-configured with Ethereum mainnet and Polygon networks
- **Authentication**: Includes SIWE (Sign-In with Ethereum) support via AuthProvider
- **Storage**: Uses MMKV for secure local storage

## Development Commands

### Dependency Installation
```bash
# Recommended: Use yarn (handles React Native dependencies better)
yarn install

# Alternative: Use npm with legacy peer deps
npm install --legacy-peer-deps

# Clean install if having issues
rm -rf node_modules yarn.lock && yarn install
```

### Build and Run
```bash
# Start Metro bundler
npm start
# or
yarn start

# Run on Android
npm run android
# or
yarn android

# Run on iOS (requires pod install first)
cd ios && pod install
npm run ios
# or  
cd ios && pod install
yarn ios

# Build Android release
npm run android:build
```

### Code Quality
```bash
# Run linting
npm run lint

# Run tests
npm run test
```

### Common Development Tasks
```bash
# Clean React Native cache and restart
npx react-native start --reset-cache

# Clean Android build
cd android && ./gradlew clean

# Reinstall iOS pods
cd ios && rm -rf Pods && pod install

# View device logs (Android)
npx react-native log-android

# View device logs (iOS)
npx react-native log-ios
```

## Core Components Structure

### Application Architecture
- **src/App.tsx**: Main application entry point that configures AppKit, defines supported chains, sets up providers (Auth, Coinbase), and renders the main UI with Web3 interaction buttons
- **src/views/**: Web3 interaction components that demonstrate different blockchain operations:
  - **SignMessage.tsx**: Message signing functionality using ethers JsonRpcSigner
  - **SendTransaction.tsx**: Transaction sending with gas estimation and execution
  - **ReadContract.tsx**: Smart contract read operations (view functions)
  - **WriteContract.tsx**: Smart contract write operations (state-changing functions)
  - **SignTypedDataV4.tsx**: EIP-712 structured data signing for dApps

### Utilities and Configuration
- **src/utils/ChainUtils.ts**: Chain configurations with RPC URLs, explorers, and chain metadata. Supports mainnet, Polygon, and Monad testnet
- **src/utils/SiweUtils.ts**: Sign-In with Ethereum (SIWE) configuration with message creation, verification, and session management
- **src/utils/**: Contract ABIs (USDT, Wagmigotchi) and EIP-712 type definitions for structured signing
- **src/components/RequestModal.tsx**: Reusable modal component for showing loading states, responses, and errors from Web3 operations

### Key Integration Points
- **AppKit Configuration**: Centralized in App.tsx with metadata, supported chains, custom wallets, and feature flags (swaps, onramp)
- **Provider Pattern**: Uses AppKit hooks (`useAppKitAccount`, `useAppKitProvider`) throughout view components for wallet state and provider access
- **Error Handling**: Consistent error handling pattern across all view components using RequestModal for user feedback

## Environment Setup

The app requires `ENV_PROJECT_ID` environment variable for Reown project configuration. This is configured via react-native-dotenv and the `.env` file.

**Required Environment Variables:**
- `ENV_PROJECT_ID`: Your Reown/WalletConnect project ID (get one at https://cloud.reown.com)

Create a `.env` file in the project root:
```
ENV_PROJECT_ID=your_project_id_here
```

## Web3 Configuration

### Chain Configuration
- **Chain Definitions**: `src/utils/ChainUtils.ts` contains chain configurations using a simplified format with `chainId`, `name`, `currency`, `explorerUrl`, and `rpcUrl`
- **Supported Networks**: Currently configured for Monad testnet (chainId: 10143), with mainnet and Polygon configurations available but commented out
- **Chain Images**: Custom chain icons configured in App.tsx `chainImages` mapping for wallet display

### Authentication and Session Management
- **SIWE Setup**: `src/utils/SiweUtils.ts` handles Sign-In with Ethereum protocol implementation
- **Session Storage**: Uses AsyncStorage for persisting authentication state
- **Nonce Generation**: Implements random nonce generation for security
- **Message Verification**: Configurable message verification logic for backend integration

### Deep Linking and Wallet Integration
- **App Scheme**: `rn-w3m-ethers-sample://` for wallet callbacks and deep linking
- **Coinbase Integration**: Coinbase Wallet SDK integration with URL handling in App.tsx
- **Custom Wallets**: Support for custom wallet definitions in AppKit configuration
- **WalletConnect**: Full WalletConnect v2 support via Reown AppKit

## Testing

Uses Jest with React Native preset. Test files should follow the pattern `*.test.tsx` in the `__tests__` directory.

## Platform Requirements

- Node.js >= 18
- React Native 0.73.4
- Expo SDK ^50.0.0
- iOS deployment requires Xcode and CocoaPods
- Android deployment requires Android Studio and Java

## Application Details

- **Android App ID**: `com.walletconnect.web3modal.rnethers`
- **Deep Link Scheme**: `rn-w3m-ethers-sample://`
- **App Name**: Web3ModalEthers

## Dependency Management and Known Issues

### Dependency Resolution Strategy
- **Package Resolutions**: Extensive `resolutions` section in package.json addresses security vulnerabilities and compatibility issues
- **React Native Compatibility**: Specific version pinning for React Native 0.73.4 and Expo SDK 50 compatibility
- **Web3 Dependencies**: Reown AppKit packages (v1.3.0) for Web3Modal functionality, ethers v6.15.0 for Ethereum interactions

### Development Environment
- **Node.js Requirement**: Node.js >= 18 specified in package.json engines
- **Bundle Resolution**: Metro bundler configuration for React Native with proper polyfills
- **TypeScript**: Full TypeScript support with React Native type definitions
- **Security Updates**: Package resolutions handle vulnerabilities in transitive dependencies (ws, ip, micromatch, etc.)

### Architecture Patterns
- **Hook-Based State Management**: Uses AppKit hooks (`useAppKitAccount`, `useAppKitProvider`) for wallet state throughout the application
- **Modal Pattern**: Consistent use of RequestModal component across all Web3 interaction components for user feedback
- **Provider Abstraction**: ethers.js BrowserProvider wraps the AppKit wallet provider for blockchain interactions
- **Error Boundary Pattern**: Try-catch blocks in all async Web3 operations with consistent error state management