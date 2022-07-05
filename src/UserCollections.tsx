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
import './userCollections.css';
import { getSliderUtilityClass } from "@mui/base";

interface Props {
    children?: ReactNode
    // any props that come into the component
    wallet: any
}

export const UserCollections = ({ children, ...props }: Props) => {

  const [data, setData] = useState<any>();
  const wallet = props.wallet;
  const [slides, setSlides] = useState<any>();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrow:true,
    initialSlide: 0
  };

  const carouelStyle = {
    height:"30%",
    width: "30%",
    border: "1px solid white",
    borderRadius: "20px"
  };

  const getSlides = () => {
    
    if(data){
      let slidess = [];
      slidess.push(
      data.map((collection:any, index:number) => (
        
        <div  data-index={index} key={index} className="NFTdiv">
           <a target="_blank" className="link" href={"https://www.magiceden.io/item-details/" + collection.tokenAddress}>
          <h6>{collection.name}</h6>
          <img className="NFTimage" src={collection.image}></img>
          <div style={{display: "inline-block"}}>
            <img className="symbolIcon" src={solanaIcon}></img><span>{collection.floorPrice}0.2</span>
          </div>
          </a>
        </div>
      )));

      setSlides(slidess);
      console.log(slides);
    }
  }

  const getCollections = async () => {
    var config = {
      method: 'get',
      url: 'https://api-mainnet.magiceden.dev/v2/wallets/'+ wallet + '/tokens?offset=0&limit=20&listStatus=both'
    };


    axios(config)
    .then(function (response) {
      //console.log('axios call user colecction');
      //console.log(response);
      //console.log(JSON.stringify(response.data));
      setData(response.data);    
      getSlides();
      return response.data;
      }).catch(function (error) {
      console.log(error);
    });
  }

useEffect(() => {
  const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
    console.log('use effect');
    getCollections();
  
    if(data){
      console.log(data);
    }
  
  }, 2000)

  return () => clearInterval(intervalId); //This is important
 
}, [slides, wallet])


return (
  <>
  <h4 style={{marginTop:"20px", textAlign:"center"}}>My NFTs</h4>
  {slides ? (
    <Slider {...settings} className="slider">
     {slides}
    </Slider>
    ) : (
      <div>
      <h1>Loading...</h1>
     </div>
  )}
  </>
);
};