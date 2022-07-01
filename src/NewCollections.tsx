import React, { ReactNode } from "react";
import {Row, Col, Container} from "react-bootstrap";
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

interface Props {
    children?: ReactNode
    // any props that come into the component
    wallet: any
}

export const NewCollections = ({ children, ...props }: Props) => {

  const [data, setData] = useState<any>();
  const wallet = props.wallet;

  const stylez = {
    height:"4%",
    marginBottom: "3%",
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
    var config = {
      method: 'get',
      url: 'https://api-devnet.magiceden.dev/v2/collections?offset=0&limit=50'
     };


    axios(config)
    .then(function (response) {
      //console.log('axios call');
      //console.log(JSON.stringify(response.data));
      setData(response.data);    
      return response.data;
      }).catch(function (error) {
      console.log(error);
    });
  }


  useEffect(() => {

    var windowElem = document.getElementsByClassName("windowChildren") as HTMLCollectionOf<HTMLElement>;
    if(windowElem){
        console.log(windowElem);
        windowElem[0].style.height = "100vh";
    }
    
    console.log('use effect');
    if(wallet){
    console.log('wallettt');
    console.log(wallet);
    }
    if(data){
    console.log(data);
    }
  });

useEffect(() => {
  const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
    console.log('use effect');
    getCollections();
  
    if(data){
      console.log(data);
    }
  
  }, 3000)

  return () => clearInterval(intervalId); //This is important
 
}, [useState])


return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
      {data ? (
          data.slice(0, Math.floor(data.length/2)).map((collection:any, i:number) => {
            return (
            <Paper style={stylez}>
              <div style={paperstylez}>
                <img src={collection.image} className="NewCollectionsImgs"></img>
                <p>{collection.name}</p>
                <p>FP: <img className="symbolIcon" src={solanaIcon}></img>{collection.floorPrice} 0.5</p>
              </div>
            </Paper>);
            })
        ) : (
          <div>
          <h1>Loading...</h1>
          </div>
      )}
      </Grid>

      <Grid item xs={6}>
        {data ? (
            data.slice(Math.floor(data.length/2), data.length-1).map((collection:any, i:number) => {
              return (
              <Paper style={stylez}>
                <div style={paperstylez}>
                  <img src={collection.image} className="NewCollectionsImgs"></img>
                  <p>{collection.name}</p>
                  <p>FP: <img className="symbolIcon" src={solanaIcon}></img>{collection.floorPrice} 0.5</p>
                </div>
              </Paper>);
              })
          ) : (<></>)}
      </Grid>
   </Grid>
  
);
};