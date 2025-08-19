# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native Web3 application that demonstrates a staking-based Todo List system on Monad testnet. Users must stake native MON tokens to create todo items and get their stake back when they complete tasks. The app showcases Web3Modal (AppKit) integration with Ethers.js for blockchain wallet connections and smart contract interactions.

## Key Architecture

- **Web3 Integration**: Uses Reown's AppKit (formerly Web3Modal) with Ethers.js provider
- **Wallet Support**: Supports multiple wallet connections including WalletConnect, Coinbase, and custom wallets
- **Chain Configuration**: Currently configured for Monad testnet (chainId: 10143) with mainnet and Polygon available as alternatives
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

# Alternative: Use Expo CLI (recommended for development)
npx expo start --clear
npx expo run:android --device
npx expo run:ios --device

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
- **src/App.tsx**: Main application entry point that configures AppKit for Monad testnet and renders the TodoList interface
- **src/views/TodoList.tsx**: Main todo list interface with contract integration for loading user todos and contract statistics
- **src/components/**: Todo-specific components:
  - **TodoItem.tsx**: Individual todo item display with completion functionality
  - **CreateTodo.tsx**: Form for creating new todos with staking requirements
  - **RequestModal.tsx**: Reusable modal for Web3 operation feedback
- **src/views/**: Reference Web3 interaction components (commented out in App.tsx):
  - **SignMessage.tsx**: Message signing functionality using ethers JsonRpcSigner
  - **SendTransaction.tsx**: Transaction sending with gas estimation and execution
  - **ReadContract.tsx**: Smart contract read operations (view functions)
  - **WriteContract.tsx**: Smart contract write operations (state-changing functions)
  - **SignTypedDataV4.tsx**: EIP-712 structured data signing for dApps

### Utilities and Configuration
- **src/utils/ChainUtils.ts**: Chain configurations with RPC URLs, explorers, and chain metadata. Supports mainnet, Polygon, and Monad testnet
- **src/utils/SiweUtils.ts**: Sign-In with Ethereum (SIWE) configuration with message creation, verification, and session management
- **src/utils/**: Contract ABIs including:
  - **stakingTodoListABI.ts**: Main contract ABI and address for the StakingTodoList contract (0xd880112AeC1307eBE2886e4fB0daec82564f3a65)
  - **usdtAbi.ts**, **wagmigotchiABI.ts**: Reference contract ABIs for example implementations
  - **eip712.ts**: EIP-712 type definitions for structured signing
- **src/components/RequestModal.tsx**: Reusable modal component for showing loading states, responses, and errors from Web3 operations

### Key Integration Points
- **AppKit Configuration**: Centralized in App.tsx with metadata, supported chains, custom wallets, and feature flags (swaps, onramp)
- **Provider Pattern**: Uses AppKit hooks (`useAppKitAccount`, `useAppKitProvider`) throughout view components for wallet state and provider access
- **Error Handling**: Consistent error handling pattern across all view components using RequestModal for user feedback

### Smart Contract Integration Pattern
**CRITICAL**: All contract interactions must use the `JsonRpcSigner` pattern for compatibility with AppKit:

```typescript
// Correct pattern (used by all working components):
import {BrowserProvider, Contract, JsonRpcSigner} from 'ethers';

const ethersProvider = new BrowserProvider(walletProvider);
const signer = new JsonRpcSigner(ethersProvider, address);
const contract = new Contract(contractAddress, contractABI, signer);

// NEVER use this pattern (causes failures):
const signer = await ethersProvider.getSigner();
```

- **Contract Operations**: All create/read/complete operations use this pattern
- **Transaction Handling**: Transactions return immediately with `.hash`, don't wait for `.wait()`
- **Error Handling**: Graceful fallbacks for network timeouts and RPC issues
- **State Management**: Automatic refresh after successful transactions

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
- **Supported Networks**: Currently configured for Monad testnet (chainId: 10143) with RPC URL `https://testnet-rpc.monad.xyz`
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

### StakingTodoList Contract
- **Contract Address**: `0xd880112AeC1307eBE2886e4fB0daec82564f3a65` on Monad testnet
- **Minimum Stake**: 1000000000000000 wei (0.001 MON tokens)
- **Key Functions**:
  - `createTodo(string memory _description)`: Creates todo with MON stake
  - `completeTodo(uint256 _todoId)`: Completes todo and returns stake
  - `getUserTodoDetails(address _user)`: Gets all todos for a user
  - `minimumStake()`: Returns required stake amount
  - `getTotalTodoCount()`, `getContractBalance()`: Contract statistics

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

## Troubleshooting

### Common Issues and Solutions

#### Contract Call Failures
- **"missing revert data" errors**: Usually indicates network/RPC issues, app gracefully falls back to empty state
- **Infinite loading**: All contract calls have timeout protection (8-15 seconds)
- **Wrong network errors**: App verifies chainId 10143 before making calls

#### Metro Bundler Issues
```bash
# Clear cache and restart
npx expo start --clear
# Kill existing Metro processes
pkill -f "expo run" || lsof -ti:8081 | xargs kill -9
```

#### React Native Development
```bash
# Clear all caches
npx react-native start --reset-cache
rm -rf node_modules && yarn install
cd ios && rm -rf Pods && pod install
```

#### Web3 Connection Issues
- Ensure wallet is connected to Monad testnet (chainId: 10143)
- Verify MON testnet tokens available for gas fees
- Check RPC endpoint availability: `https://testnet-rpc.monad.xyz`
- Use "Test Contract Connection" button in CreateTodo form for debugging