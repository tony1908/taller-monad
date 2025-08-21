import '@walletconnect/react-native-compat';

import React, {useEffect} from 'react';
import {Linking, SafeAreaView, StyleSheet} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import {
  createAppKit,
  defaultConfig,
  AppKitButton,
  AppKit,
} from '@reown/appkit-ethers-react-native';
import {FlexView, Text} from '@reown/appkit-ui-react-native';
import {handleResponse} from '@coinbase/wallet-mobile-sdk';
import {ENV_PROJECT_ID} from '@env';

import {TodoList} from './views/TodoList';
import {monadTestnet} from './utils/ChainUtils';

// 1. Get projectId at https://cloud.reown.com
const projectId = ENV_PROJECT_ID;

// 2. Define your chains
const chains = [monadTestnet];

// 3. Create config
const metadata = {
  name: 'AppKit Ethers',
  description: 'AppKit with Ethers',
  url: 'https://reown.com/appkit',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
  redirect: {
    native: 'rn-w3m-ethers-sample://',
  },
};

const config = defaultConfig({
  metadata,
});

const clipboardClient = {
  setString: async (value: string) => {
    Clipboard.setString(value);
  },
};

const customWallets = [
  {
    id: 'rn-wallet',
    name: 'RN Wallet',
    image_url:
      'https://github.com/reown-com/reown-docs/blob/main/static/assets/home/walletkitLogo.png?raw=true',
    mobile_link: 'rn-web3wallet://',
  },
];

// 3. Create modal
createAppKit({
  projectId,
  metadata,
  chains,
  config,
  // siweConfig,
  customWallets,
  clipboardClient,
  enableAnalytics: true,
  features: {
    swaps: true,
    onramp: true,
  },
  chainImages: {
    10143: 'https://icons.llamao.fi/icons/chains/rsz_monad.jpg',
    //5003: 'https://icons.llamao.fi/icons/chains/rsz_mantle.jpg',
    //84532: 'https://icons.llamao.fi/icons/chains/rsz_base.jpg',
  },
});

function App(): React.JSX.Element {
  // Coinbase sdk setup
  useEffect(() => {
    const sub = Linking.addEventListener('url', ({url}) => {
      const handledBySdk = handleResponse(new URL(url));
      if (!handledBySdk) {
        // Handle other deeplinks
      }
    });

    return () => sub.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlexView style={styles.header}>
        <AppKitButton balance="show" />
      </FlexView>
      <TodoList />
      <AppKit />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
});

export default App;
