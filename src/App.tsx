import "./App.css";
import { useMemo } from "react";

import Home from "./Home";
import Sniper from "./Sniper";
import Collection from './Collection';
import {Route, Routes} from 'react-router-dom'

import * as anchor from "@project-serum/anchor";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolletExtensionWallet,
} from "@solana/wallet-adapter-wallets";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";
import { createTheme, ThemeProvider } from "@material-ui/core";
import { DEFAULT_TIMEOUT } from './connection';
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { useQuery, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://graphql.icy.tools/graphql/",
  cache: new InMemoryCache()
});

const candyMachineId = new anchor.web3.PublicKey(
  process.env.REACT_APP_CANDY_MACHINE_ID!
);

const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;

const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost);

const txTimeout = 30000; // milliseconds (confirm this works for your project)

const theme = createTheme({
    palette: {
        type: 'dark',
    },
    overrides: {
        MuiButtonBase: {
            root: {
                justifyContent: 'flex-start',
            },
        },
        MuiButton: {
            root: {
                textTransform: undefined,
                padding: '12px 16px',
            },
            startIcon: {
                marginRight: 8,
            },
            endIcon: {
                marginLeft: 8,
            },
        },
    },
});

const App = () => {

  const endpoint = useMemo(() => clusterApiUrl(network), []);

  const wallets = useMemo(
    () => [
        getPhantomWallet(),
        getSlopeWallet(),
        getSolflareWallet(),
        getSolletWallet({ network }),
        getSolletExtensionWallet({ network })
    ],
    []
  );

  return (
      <ThemeProvider theme={theme}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletDialogProvider>
            <ApolloProvider client={client}>
                <Routes>
                  <Route path="/" element={HomeComponent()}/>
                  {/* <Route path="/Sniper" element={SniperComponent()}/> */}
                  <Route
                      path="/Collection/:id"
                      element={CollectionComponent()} />
                </Routes>
                </ApolloProvider>
            </WalletDialogProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ThemeProvider>
  );
};

export default App;

const HomeComponent = () => {
  return (
   <Home
   candyMachineId={candyMachineId}
   connection={connection}
   txTimeout={DEFAULT_TIMEOUT}
   rpcHost={rpcHost}
   network={network}
                />
  );
}

const SniperComponent = () => {
  return (
   <Sniper/>
  );
}

const CollectionComponent = () => {
  return (
   <Collection/>
  );
}