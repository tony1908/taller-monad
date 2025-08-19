import { defineChain } from 'viem';
import { mainnet as viemMainnet, polygon as viemPolygon } from 'viem/chains';

//export const mainnet = viemMainnet;

export const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://eth.merkle.io',
};

export const polygon = {
  chainId: 137,
  name: 'Polygon',
  currency: 'MATIC',
  explorerUrl: 'https://polygonscan.com',
  rpcUrl: 'https://polygon-rpc.com',
};

//export const polygon = viemPolygon;

export const monadTestnet = {
  chainId: 10143,
  name: 'Monad Testnet',
  currency: 'MON',
  explorerUrl: 'https://testnet.monadexplorer.com',
  rpcUrl: 'https://testnet-rpc.monad.xyz',
};

/*export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://testnet.monadexplorer.com',
    },
  },
  testnet: true,
});*/
