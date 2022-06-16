import { Key, ReactChild, ReactFragment, ReactPortal, useCallback, useEffect, useMemo, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import './sniper.css';
import styled from 'styled-components';
import { Container, Snackbar } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDialogButton } from '@solana/wallet-adapter-material-ui';
import { AlertState, formatNumber, getAtaForMint, toDate } from './utils';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

import {Row, Col} from 'react-bootstrap';
import { createTheme } from "@material-ui/core/styles";
import solanaIcon from './solanaIcon.png'
import globeIcon from './globeIcon.png'

import {Window} from './Window';
import { Rowing } from '@material-ui/icons';
import { isWhiteSpaceLike } from 'typescript';
import {CollectionsTable} from "./CollectionsTable"
import { UserCollections } from './UserCollections';
import { NewCollections } from './NewCollections';
import { TimelineOppositeContent } from '@material-ui/lab';
import osIcon from './OSicon.png'

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

const theme = createTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#000000",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#6b6b6b",
            minHeight: 24,
            border: "3px solid #868600",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#2b2b2b",
          },
        },
      },
    },
  },
});


const Sniper = (props: SniperProps) => {
  
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined,
  });

  const [isHolder, setIsHolder] = useState(false);

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
  
 
  useEffect(() => {
        console.log('use effect');
        if(wallet){
          console.log(wallet);
        }
  });
  
  

  const tableStyle = {
    backgroundColor: '##192026',
    color: "white"
  };

  const consoleStyle = {
    width: "65%",
    height:"5%",
    marginLeft: "20px",
    display: "inline-block",
    backgroundColor: "#192026",
    border: "1px solid white", 
    borderRadius: "5%"
  };

  return (
    <main>
      {/* {wallet && <p>Balance: {(balance || 0).toLocaleString()} SOL</p>} */}
          <Container id="sniperContainer">
              <div style={{display:"inline-block", marginLeft:'15%'}}><img src={osIcon} style={{width:"50px", display:"inline-block", paddingBottom:"20px"}}></img><span style={{fontSize: "0.8em"}}>AwakenedSniper</span></div>
              <div style={consoleStyle}>
                <table style={{width:"100%"}}>
                  <th style={{width: "80%", }}>AwakenedOS</th>
                  <th style={{borderLeft: "1px solid white", borderRight: "1px solid white"}}><img src={globeIcon} style={{display:"inline-block", width:"20px"}}></img></th>
                  <th style={{fontSize: "0.8em", borderRadius: "5%"}}>{wallet? (<>wallet.PubKey</>) :(<>Not Connected</>) }</th>
                </table>
              </div>
              
            {!wallet.connected ? (
            <Container style={{ position: 'relative' }}>
              <Paper style={{padding: 24, paddingBottom: 10, backgroundColor: '#151A1F', borderRadius: 6,}}>
                <ConnectButton>Connect Wallet</ConnectButton>
              </Paper>
            </Container>
            ) : (
            <>
              <Row style={{margin: 0, width: "80vw"}}>
                <Col sm={12} lg={4}>
                  <Window title="New Collections">
                  <NewCollections wallet={wallet}></NewCollections>
                  </Window>
                </Col>
                <Col sm={12} lg={8}>
                  <Window title="Trending Collections">
                    <CollectionsTable wallet={wallet.publicKey}></CollectionsTable>
                  </Window>
                  <UserCollections wallet={wallet.publicKey}></UserCollections>
                </Col>
              </Row>
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

     </main>
     );
          
   };
export default Sniper;
