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
import axios from 'axios';
import { useQuery, gql } from "@apollo/client";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { createTheme } from "@material-ui/core/styles";
import solanaIcon from './solanaIcon.png'
import ethereumIcon from './ethereumIcon.png'
import {Window} from './Window';
import { Rowing } from '@material-ui/icons';

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


//icy tools trending collections on eth query
const TRENDING_COLLECTIONS_QUERY = gql`
query TrendingCollections {
  contracts(orderBy: SALES, orderDirection: DESC) {
    edges {
      node {
        address
        ... on ERC721Contract {
          name
          stats {
            totalSales
            average
            ceiling
            floor
            volume
          }
          symbol
        }
      }
    }
  }
}
`;

const Sniper = (props: SniperProps) => {
  const { data, loading, error } = useQuery(TRENDING_COLLECTIONS_QUERY, {
    context: {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_ICY_API_KEY
        }
    }
})
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

    //opensea
    // const options = {method: 'GET', headers: {Accept: 'application/json'}};

    // fetch('https://api.opensea.io/api/v1/collections?offset=0&limit=300', options)
    //   .then(response => response.json())
    //   .then(response => console.log(response))
    //   .catch(err => console.error(err));
  }

  useEffect(() => {
        console.log('use effect');
        //getCollections();
        if(collections){
          console.log(collections);
        }

        if(data){
          console.log(data);
        }

        if(error){
          console.log(error);
        }

        if(loading){
          console.log('loading');
        }
  });
  
  if (loading) return <h1 style={{fontFamily: "SinMedia Sans"}}>"Loading..."</h1>;
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
             {data ? ( <div id="sniperContainer">
          <h3>Awakened Sniper</h3>
          <Window title="Trending Collections">
            <div id="tableContainer">
            <table aria-label="simple table" className="dataTable">
              <thead className="tableHead">
                <tr>
                  <th className="tableCell" align="left">Name</th>
                  <th className="tableCell" align="left">FP</th>
                  <th className="tableCell" align="left">Ceiling</th>
                  <th className="tableCell" align="left">Volume</th>
                  <th className="tableCell" align="left">Total Sales</th>
                  <th className="tableCell" align="left">Average</th>
                  <th className="tableCell"  align="left">Symbol</th>
                </tr>
              </thead>
              <tbody>
                {data.contracts.edges.map((collection: { node: { name: Key | null | undefined; stats: { floor: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; ceiling: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; volume: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; totalsales: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; average: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; }; symbol: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; }; }) => (
                  <tr 
                    key={collection.node.name}
                   
                  >
                     <td className="tableCellText">
                      {collection.node.name} 
                    </td>
                    <td className="tableCell">
                      {collection.node.stats.floor}
                    </td>
                    <td className="tableCell" align="left">{collection.node.stats.ceiling}</td>
                    <td className="tableCell"align="left">{collection.node.stats.volume}</td>
                    <td className="tableCell" align="left">{collection.node.stats.totalsales}</td>
                    <td className="tableCell"align="left">{collection.node.stats.average}</td>
                    <td className="tableCellText" align="left"><img className="symbolIcon" src={ethereumIcon}></img>{collection.node.symbol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </Window>
          </div>
          ): (
            <>
             <h1>Loading...</h1>
            </>
          )}
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
       

     </main>
     );
          
   };
export default Sniper;
