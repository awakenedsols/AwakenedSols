import { Key, ReactChild, ReactFragment, ReactPortal, useCallback, useEffect, useMemo, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import {Row, Col, Button} from "react-bootstrap";
import styled from 'styled-components';
import { Container, Snackbar } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import { WalletDialogButton } from '@solana/wallet-adapter-material-ui';
import { AlertState, formatNumber, getAtaForMint, toDate } from './utils';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import './sniper.css';
import { createTheme } from "@material-ui/core/styles";
import solanaIcon from './solanaIcon.png'
import globeIcon from './globeIcon.png'
import axios from 'axios';
import {Window} from './Window';
import osIcon from './OSicon.png'
import './Collection.css';
import moment from 'moment';
import {
    BrowserRouter as Router,
    Link,
    Route,
    Routes,
    useParams, 
  } from "react-router-dom";
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

  import {Line} from "react-chartjs-2";
const ConnectButton = styled(WalletDialogButton)`
  width: 100%;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 5px;
  background: linear-gradient(180deg, #008000 0%, #59AD6B 100%);
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const MintContainer = styled.div``; // add your owns styles here

export interface CollectionProps {
}

const Collection = (props: CollectionProps) => {

    let { id } = useParams();
    const [data, setData] = useState<any>();
    const [limit, setLimit] = useState<number>();
    const [listings, setListings] = useState<any>();
    const [activity, setActivities] = useState<any>();
    const [chartdata, setChartData] = useState<any>();
 
    const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined,
  });

  const [isHolder, setIsHolder] = useState(false);
  const [timeFilter, setTimeFilter] = useState(1);
  
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

  const getCollection = async () => {
    var config = {
      method: 'get',
      url: 'https://api-mainnet.magiceden.dev/v2/collections/' + id + '/stats'
    };


    axios(config)
    .then(function (response) {
      //console.log('axios call user colecction');
      //console.log(response);
      console.log(JSON.stringify(response.data));
      setData(response.data);    
      return response.data;
      }).catch(function (error) {
      console.log(error);
    });
  }

  const getListings = async () => {
    var config = {
      method: 'get',
      url: 'https://api-mainnet.magiceden.dev/v2/collections/' + id + '/listings?offset=0&limit=20'
    };


    axios(config)
    .then(function (response) {
      //console.log('axios call user colecction');
      //console.log(response);
      console.log(JSON.stringify(response.data));
      setListings(response.data);    
      return response.data;
      }).catch(function (error) {
      console.log(error);
    });
  }

  const getActivities = async () => {
    if(limit){
    var config = {
      method: 'get',
      url: 'https://api-mainnet.magiceden.dev/v2/collections/' + id + '/activities?offset=0&limit='+limit
    };
  }else{
    var config = {
      method: 'get',
      url: 'https://api-mainnet.magiceden.dev/v2/collections/' + id + '/activities?offset=0&limit='+100
    };
  }


    axios(config)
    .then(function (response) {
      //console.log('axios call user colecction');
      //console.log(response);
      //console.log("activities");
      //console.log(JSON.stringify(response.data));
      setActivities(response.data);    
      return response.data;
      }).catch(function (error) {
      console.log(error);
    });

    if(activity){
        let objArray: { price: any; time: string; }[] = [];
        activity.forEach((item:any)=> {
            const obj = {price: item.price, time: moment.unix(item.blockTime).format("YYYY-MM-DD HH:mm:ss")};
        objArray.push(obj);
        })
        

        const chartData = {
           labels: objArray.map(o => o.time),
           datasets: [
             {
               label: 'Sale',
               data: objArray.map( o => o.price),
               borderColor: 'green',
               backgroundColor: 'white',
             }
           ],
         };

         setChartData(chartData);
    }
  }

  const buyClicked = (tokenMint:any, sellerPubKey:any, auctionHouseAddress:any, price:any, tokenAta:any) => {
    var url="api-devnet.magiceden.dev/v2/instructions/buy_now?buyer=" + wallet.publicKey + "&seller=" + sellerPubKey + "&auctionHouseAddress=" + auctionHouseAddress + "&tokenMint=" + tokenMint + "&tokenATA=" + tokenAta + "&price=" + price + "&buyerExpiry=0&sellerExpiry=-1"
    console.log(url);
    //todo
  }
    
  const loadMoreClicked = () => {
    if(limit){
      console.log(limit);
      console.log('load more')
      var newLimit = limit + 100;
      setLimit(newLimit);
      console.log('new limit: ' + limit);
      getActivities();
    } 
  }

  useEffect(() => {

    if(!limit){
      setLimit(100);
    }

    const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
      console.log('use effect');
      getCollection();
    
      if(data){
        //console.log(data);
      }
    
    }, 2000)

    return () => clearInterval(intervalId); //This is important
   
}, [data, wallet, limit])

    useEffect(() => {
        const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
          console.log('use effect');
          getListings();
          if(listings){
            console.log(listings);
          }
        
        }, 5000)
      
  
    return () => clearInterval(intervalId); //This is important
   
  }, [listings, wallet])
  
  useEffect(() => {
    const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
      console.log('use effect');
      getActivities();
      if(activity){
        //console.log(activity);
      }
    
    }, 5000)


return () => clearInterval(intervalId); //This is important

}, [activity, wallet])

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

const options = {
    
    responsive: true,
    type: "line",
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Analytics',
      },
    },
    scales: {
        x: {
          adapters: {
            type: 'time',
            distribution: 'linear',
            time: {
              parser: 'yyyy-MM-dd hh:mm:ss',
              unit: 'hour',
            },
            title: {
              display: true,
              text: 'Date'
            }
          }
        }
      }
  };

  const chartStyles = {
    height:"80%",
    width:"90%",
    marginLeft: "5%"
  };

  const stylez = {
    marginBottom: "3px",
    overflow:"hidden",
    textOverflow:"ellipsis",
    backgroundColor: "#192026"
  };

  const paperstylez = {
    textAlign: 'center' as const,
    marginTop: "2px",
    margin: "5% 0"
  };

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

  const Styles = styled.div`
  div{
   
  }
  table {
    background-color: #192026;
    color:white;
    border-spacing: 0;
    position:relative;
    width:100%;
    overflow-y:scroll;
    overflow-x:hidden;
    
    tr {
      td {
        border-bottom: 0;
        width:auto;
      }
    }

    th{
      background-color: #192026;
      top:0;
      position:sticky;
    }

    th,
    td {
      margin: 0;
      padding: 0.2rem;
    }
  }
`

  return (
    <main>
      {/* {wallet && <p>Balance: {(balance || 0).toLocaleString()} SOL</p>} */}
          <Container id="CollectionContainer">
            <div style={{ width: "100%", margin: "0 25%"}}>
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
                <></>
             )}

            {wallet && data &&
                <div style={{width:"80vw", marginLeft: "13%"}}>
                    <h3>{data.symbol}</h3>
                    <Window title={"Listings"}>
                            <Grid container spacing={4} className="stickyheader">
                                <Grid item xs={6} lg={3} >
                                    <p className="headerItem">FP: {data.floorPrice/1000000000}</p>
                                </Grid>
                                <Grid item xs={6} lg={3} >
                                    <p className="headerItem">Avg Price: {data.avgPrice24hr/1000000000}</p>
                                </Grid>
                                <Grid item xs={6} lg={3} >
                                    <p className="headerItem">Listed: {data.listedCount}</p>
                                </Grid>
                                <Grid item xs={6} lg={3} >
                                    <p className="headerItem">Volume: {data.volumeAll/1000000000}</p>
                                </Grid>
                            </Grid>
                        {!listings ? (
                            <></>
                        ) : (
                            <Grid container spacing={4} style={{marginTop:"2%"}}>
                            {listings.sort((a:any, b:any) => a.price > b.price ? 1 : -1).map((listing:any) => (
                                <Grid item xs={12} lg={3}>
                                    <Paper style={stylez} className="paper">
                                        <div style={paperstylez}>
                                            <a target="_blank" className="link" href={"https://www.magiceden.io/item-details/" + listing.tokenAddress}>
                                                <p>Price: {listing.price}</p>
                                                <img src={listing.extra.img} className="NewCollectionsImgs"></img>
                                            </a>
                                        </div>
                                        <Button onClick={() => buyClicked(listing.tokenMint, listing.sellerPubKey, listing.auctionHouseAddress, listing.price, listing.tokenAta)} style={{marginBottom:"20px", backgroundColor:"#59AD6B", marginLeft:"40%"}}>Buy</Button>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                        )}
                    </Window>
                </div>
                 } 

            {wallet && activity && chartdata &&
                <div style={{width:"80vw", height:"100vh", marginLeft: "13%", marginTop:"20px", marginBottom:"20px"}}>
                    <Window title={"Activity"}>
                    <Line options={options as any} data={chartdata} style={chartStyles}></Line>
                    <Styles>
                        <div>
                        <table>
                        <thead>
                            <tr>
                            <th align="left"></th>
                            <th align="left">Buyer</th>
                            <th align="left">Seller</th>
                            <th align="left">Price</th>
                            <th align="left">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activity.map((activity:any) => (
                            
                            <tr key={moment.unix(activity.blockTime).format("YYYY-MM-DD HH:mm:ss")} >
                              
                                <td align="left"> 
                                    <a target="_blank" className="link" href={"https://www.magiceden.io/item-details/" + activity.tokenMint}>
                                        <img className="activityImg" src={activity.image}></img>
                                    </a>
                                </td>

                                <td align="left"> 
                                    <a target="_blank" className="link" href={"https://www.magiceden.io/u/" + activity.buyer}>
                                        <p>{activity.buyer?.substring(0, 15)}</p>
                                    </a>
                                </td>

                                <td align="left"> 
                                    <a target="_blank" className="link" href={"https://www.magiceden.io/u/" + activity.seller}>
                                       <p>{activity.seller?.substring(0, 15)}</p>
                                    </a>
                                </td>

                                <td align="left"> 
                                    <a target="_blank" className="link" href={"https://www.magiceden.io/item-details/" + activity.tokenMint}>
                                       <p>{activity.price}</p>
                                    </a>
                                </td>

                                <td align="left"> 
                                    <a target="_blank" className="link" href={"https://www.magiceden.io/item-details/" + activity.tokenMint}>
                                       <p>{moment.unix(activity.blockTime).format("YYYY-MM-DD HH:mm:ss")}</p>
                                    </a>
                                </td>
                            </tr>
                            
                            ))}
                        </tbody>
                        </table>
                        {data && limit && limit < 951 ? (<Button onClick={loadMoreClicked} style={{backgroundColor:"#59AD6B", marginLeft:"45%", marginTop:"10px"}}>Load More</Button>) : (<></>)}
                        </div>
                    </Styles> 
                    </Window>
                </div>
                 }     

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
export default Collection;