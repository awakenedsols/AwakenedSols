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

interface Props {
    children?: ReactNode
    // any props that come into the component
    wallet: any
}

export const NewCollections = ({ children, ...props }: Props) => {

  const [data, setData] = useState<any>();
  const wallet = props.wallet;

  const stylez = {
    height:"100vh"
  };

  const getCollections = async () => {
    console.log('get new colls');
    var config = {
      method: 'get',
      url: 'https://api-devnet.magiceden.dev/v2/collections?offset=0&limit=200'
     };


    axios(config)
    .then(function (response) {
      console.log('axios call');
      console.log(JSON.stringify(response.data));
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
        windowElem[0].style.height = "103vh";
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
  
  }, 1000)

  return () => clearInterval(intervalId); //This is important
 
}, [useState])


return (
  <div style={stylez}>
   {data ? (
       data.map((collection:any) => (
           <div>
            <img src={collection.image} className="NewCollectionsImgs"></img>
            <h6>{collection.name}</h6>
            <p>FP: <img className="symbolIcon" src={solanaIcon}></img>{collection.floorPrice}</p>
           </div>
       ))
     ) : (
       <div>
       <h1>Loading...</h1>
      </div>
   )}
   </div>
  
);
};