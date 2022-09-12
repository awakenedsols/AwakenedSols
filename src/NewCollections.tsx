import React, { ReactNode } from "react";
import {Row, Col, Container, Button} from "react-bootstrap";
import enlargeIcon from './enlargeIcon.png'
import solanaIcon from './solanaIcon.png'
import styled from 'styled-components'
import { Key, ReactChild, ReactFragment, ReactPortal, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './NewCollections.css';
import Grid from '@material-ui/core/Grid'
import Paper from "@material-ui/core/Paper";
import { margin } from "@mui/system";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
} from "react-router-dom";
interface Props {
    children?: ReactNode
    // any props that come into the component
    wallet: any
}

export const NewCollections = ({ children, ...props }: Props) => {

  const [data, setData] = useState<any>();
  const [loadMore, setLoadMore] = useState<boolean>();
  const wallet = props.wallet;
  const apikey = process.env.REACT_ME_API_KEY;
  
  const stylez = {
    height:"250px",
    marginBottom: "5%",
    overflow:"hidden",
    textOverflow:"ellipsis",
    backgroundColor: "#192026"
  };

  const paperstylez = {
    textAlign: 'center' as const,
    marginTop: "20%"
  };

  const getCollections = async () => {
    console.log('get new colls');
    if(loadMore){
    var config = {
      method: 'get',
      url: 'https://api-mainnet.magiceden.dev/new_collections?more=true',
      headers: { Authorization: "Bearer " + apikey }
     };
    }else{
      console.log('get collections')
      var config = {
        method: 'get',
        url: 'https://api-mainnet.magiceden.dev/new_collections',
        headers: { Authorization: "Bearer " + apikey }
       };
    }

    axios(config)
    .then(function (response) {
      console.log('axios call');
      console.log((response.data));
      setData(response.data);    
      return response.data;
      }).catch(function (error) {
      console.log(error);
    });
  }
  
  const loadMoreClicked = () => {
    if(loadMore){
      console.log(loadMore);
      console.log('load more')
      setLoadMore(true);
      getCollections();
    }
    
  }


  useEffect(() => {

    var windowElem = document.getElementsByClassName("windowChildren") as HTMLCollectionOf<HTMLElement>;
    if(windowElem){
        //console.log(windowElem);
        windowElem[0].style.height = "100vh";
    }
    
    console.log('use effect');
    if(wallet){
    //console.log('wallettt');
    //console.log(wallet);
    }
    if(data){
    //console.log(data);
    }

    if(loadMore){
      console.log(loadMore);
    }
  }, [data, loadMore, wallet]);

useEffect(() => {
  const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
    console.log('use effect');
    getCollections();
  
    if(data){
      //console.log(data);
    }
  
  }, 2000)

  return () => clearInterval(intervalId); //This is important
 
}, [data])


return (
  <div style={{marginBottom:"70%"}}>
    <Grid container spacing={2}>
      <Grid item xs={6}>
      {data ? (
          data.collections.slice(0, Math.floor(data.collections.length/2)).map((collection:any, i:number) => {
            return (
            <Paper style={stylez} className="paper">
              <div style={paperstylez}>
                <img src={collection.image} className="NewCollectionsImgs"></img>
                <Link to={`/Collection/${collection.symbol}`} key={collection.symbol} className="collectionLink"> <p>{collection.name}</p></Link>
                {/* <p>FP: <img className="symbolIcon" src={solanaIcon}></img>{collection.floorPrice} 0.5</p> */}
              </div>
            </Paper>);
            })
        ) : (
          <div>
          <h3>Loading...</h3>
          </div>
      )}
      </Grid>

      <Grid item xs={6}>
        {data ? (
            data.collections.slice(Math.floor(data.collections.length/2), data.collections.length-1).map((collection:any, i:number) => {
              return (
              <Paper style={stylez} className="paper">
                <div style={paperstylez}>
                  <img src={collection.image} className="NewCollectionsImgs"></img>
                  <Link to={`/Collection/${collection.symbol}`} key={collection.symbol} className="collectionLink"> <p>{collection.name}</p></Link>
                  {/* <p>FP: <img className="symbolIcon" src={solanaIcon}></img>{collection.floorPrice} 0.5</p> */}
                </div>
              </Paper>);
              })
          ) : (<></>)}
      </Grid>
   </Grid>
   {data && !loadMore ? (<Button onClick={loadMoreClicked} style={{backgroundColor:"#59AD6B", borderColor:"#59AD6B", marginLeft:"30%", marginTop:"10px"}}>Load More</Button>) : (<></>)}
   </div>
);
};