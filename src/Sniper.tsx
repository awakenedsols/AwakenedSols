import { useCallback, useEffect, useMemo, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import './home.css';
import styled from 'styled-components';
import { Container, Snackbar } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  Commitment,
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDialogButton } from '@solana/wallet-adapter-material-ui';
import {
  awaitTransactionSignatureConfirmation,
  CANDY_MACHINE_PROGRAM,
  CandyMachineAccount,
  createAccountsForMint,
  getCandyMachineState,
  getCollectionPDA,
  mintOneToken,
  SetupState,
} from './candy-machine';
import { AlertState, formatNumber, getAtaForMint, toDate } from './utils';
import { MintButton } from './MintButton';
import { GatewayProvider } from '@civic/solana-gateway-react';
import { sendTransaction } from './connection';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import axios from 'axios';

const ConnectButton = styled(WalletDialogButton)`
  width: 100%;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 5px;
  background: linear-gradient(180deg, #604ae5 0%, #813eee 100%);
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const MintContainer = styled.div``; // add your owns styles here

export interface SniperProps {
  candyMachineId?: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  txTimeout: number;
  rpcHost: string;
  network: WalletAdapterNetwork;
}

const Sniper = (props: SniperProps) => {
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined,
  });
  const [isHolder, setIsHolder] = useState(false);
  const [collections, setCollections] = useState<string>();

  const rpcUrl = props.rpcHost;
  const wallet = useWallet();

  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as anchor.Wallet;
  }, [wallet]);
  
  const getCollections = async () => {

    // await fetch("api-devnet.magiceden.dev/v2/launchpad/collections?offset=0&limit=200")
    // .then(response => response.text())
    // .then(result => setCollections(result))
    // .catch(error => console.log('error', error));


    // const response = await fetch("api-devnet.magiceden.dev/v2/launchpad/collections?offset=0&limit=200");
    // let data = await response.text();
    // setCollections(data);

    // var config = {
    //   method: 'get',
    //   url: 'api-devnet.magiceden.dev/v2/launchpad/collections?offset=0&limit=200'
    // };
    
    // axios(config)
    // .then(function (response) {
    //   console.log(JSON.stringify(response.data));
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });

  };
  
  useEffect(() => {
        console.log('use effect');
        getCollections();
        if(collections){
          console.log(collections);
        }
  }, []);

  return (
      <main>
    {/* {wallet && <p>Balance: {(balance || 0).toLocaleString()} SOL</p>} */}
    <div>
        <Container>
      {!wallet.connected ? (
             <Container maxWidth="xs" style={{ position: 'relative' }}>
               <Paper
             style={{
               padding: 24,
               paddingBottom: 10,
               backgroundColor: '#151A1F',
               borderRadius: 6,
             }}
           ><ConnectButton>Connect Wallet</ConnectButton></Paper>
           </Container>
          ) : (
            <>
             <h1 id="connected">sniper</h1>
            </>
          )}
      <Snackbar
        open={alertState.open}
        autoHideDuration={
          alertState.hideDuration === undefined ? 6000 : alertState.hideDuration
        }
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </Container>

        </div>
        {<div id="about"><div className="aboutContainer">
          <h1 className="h1">SNIPER</h1>
          
          </div></div>}

     </main>
     );
   };
export default Sniper;
