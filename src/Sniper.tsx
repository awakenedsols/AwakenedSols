
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

import { useNavigate } from 'react-router-dom';
import {Row, Col, Button} from 'react-bootstrap';
import { createTheme } from "@material-ui/core/styles";
import solanaIcon from './solanaIcon.png'
import globeIcon from './globeIcon.png'

import {Window} from './Window';
import { ContactSupportOutlined, Rowing } from '@material-ui/icons';
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
<<<<<<< HEAD
  background: linear-gradient(180deg, #604ae5 0%, #813eee 100%);
=======
  background: linear-gradient(180deg, #008000 0%, #59AD6B 100%);
>>>>>>> sniper
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const MintContainer = styled.div``; // add your owns styles here

export interface SniperProps {

}

const Sniper = (props: SniperProps) => {
  let navigate = useNavigate();


  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined,
  });


  const [isHolder, setIsHolder] = useState(false);

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
        if(anchorWallet){
          console.log(anchorWallet);
        }
  }, [anchorWallet]);
  
  
  const searchCollection = () => {
    var elem = document.getElementById("searchInput") as HTMLInputElement;
    var value = elem.value;
    console.log(value);
    navigate('/Collection/'+value);
  }
  
  const tableStyle = {
    backgroundColor: '##192026',
    color: "white"
  };

  const consoleStyle = {
    width: "75%",
    height:"10%",
    marginLeft: "10px",
    display: "inline-block",
    backgroundColor: "#192026",
    border: "1px solid white", 
    borderRadius: "15px",
    fontSize: "0.8em"
  };

  const green = {
    color: 'green',
    fontSize: "0.7em"
  }

  return (
    <main>
      {/* {wallet && <p>Balance: {(balance || 0).toLocaleString()} SOL</p>} */}
          <Container id="sniperContainer">
          <div style={{ width: "100%", margin: "0 15%"}}>
              <div style={{display:"inline-block", width:"20%"}}><img src={osIcon} style={{width:"20%", display:"inline-block", paddingBottom:"20px"}}></img><span style={{fontSize: "0.8em"}}>AwakenedSniper</span></div>
              <div style={consoleStyle}>
                <table style={{width:"100%"}}>
                  <th style={{width: "80%", paddingLeft:"10px"}}>AwakenedOS<span style={green}>v1.0</span></th>
                  <th style={{borderLeft: "1px solid white", borderRight: "1px solid white"}}><img src={globeIcon} style={{display:"inline-block", width:"20px"}}></img></th>
                  <th style={{fontSize: "0.8em", borderRadius: "5%"}}>{wallet ? (<>{wallet?.publicKey?.toString().substring(0, 15) + "..."}</>) : (<>Not Connected</>) }</th>
                </table>
              </div>
            </div>
              
            {!wallet.connected ? (
            <Container style={{ position: 'relative' }}>
              <Paper style={{padding: 24, paddingBottom: 10, backgroundColor: '#151A1F', borderRadius: 6, width:"25%", marginLeft: "47%"}}>
                <ConnectButton>Connect Wallet</ConnectButton>
              </Paper>
            </Container>
            ) : (
            <>
              <Row style={{margin: 0, width: "80vw"}}>
                <Col sm={12} lg={4}>
                  <Window title="New Collections">
                    <NewCollections wallet={anchorWallet?.publicKey}></NewCollections>
                  </Window>
                </Col>
                <Col sm={12} lg={8}>
                  <Window title="Popular Collections">
                    <CollectionsTable wallet={anchorWallet?.publicKey}></CollectionsTable>
                  </Window>
                </Col>
                <Col sm={12} lg={12}>
                 <div style={{margin:"5% 10%"}}>
                    <input id="searchInput" style={{width:"80%", marginRight: "15px"}} placeholder="search for a collection by symbol"></input>
                    <Button style={{backgroundColor:"#519C63", borderColor:"#519C63"}} onClick={searchCollection}>Search</Button>
                 </div>
                </Col>
                <Col sm={12} lg={12}>
                  <UserCollections wallet={anchorWallet?.publicKey}></UserCollections>
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
