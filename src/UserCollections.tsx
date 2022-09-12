import React, { ReactNode, useRef, Ref } from "react";
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
import './userCollections.css';
import { getSliderUtilityClass } from "@mui/base";
import { getElementAtEvent } from "react-chartjs-2";

interface Props {
    children?: ReactNode
    // any props that come into the component
    wallet: any
}

export const UserCollections = ({ children, ...props }: Props) => {

  const [data, setData] = useState<any>();
  const wallet = props.wallet;
  const [slides, setSlides] = useState<any>();
  const [isHolder, setIsHolder] = useState(true);
  const [listing, setListing] = useState<any>();
  const apikey = process.env.REACT_ME_API_KEY;

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrow:true,
    initialSlide: 0,
    autoplay: false,
    pauseOnHover:true
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
      if(isHolder){
        slidess.push(
        data.map((collection:any, index:number) => (
          
          <div  data-index={index} key={index} className="NFTdiv">
            <a target="_blank" className="link" href={"https://www.magiceden.io/item-details/" + collection.mintAddress}>
            <h6>{collection.name}</h6>
            <img className="NFTimage" src={collection.image}></img>
            {/* <div style={{display: "inline-block"}}>
              <img className="symbolIcon" src={solanaIcon}></img>{collection.floorPrice}0.2
            </div> */}
            </a>
            {/* {!listing && <Button onClick={listClicked} style={{marginBottom:"20px", backgroundColor:"#59AD6B", borderColor:"#59AD6B"}}>List</Button>}
            {listing && 
            <>
              <input id="priceInput" style={{display:"block", width:"10%", margin:"0 auto", marginBottom:"10px"}} placeholder="SOL" type="number"></input> 
              <Button onClick={sellClicked} style={{marginBottom:"20px", backgroundColor:"#59AD6B", borderColor:"#59AD6B"}}>Sell</Button>
            </>
            } */}
          </div>
        )));
      }else{
        slidess.push(
          data.map((collection:any, index:number) => (
            
            <div  data-index={index} key={index} className="NFTdiv">
              <a target="_blank" className="link" href={"https://www.magiceden.io/item-details/" + collection.mintAddress}>
              <h6>{collection.name}</h6>
              <img className="NFTimage" src={collection.image}></img>
              {/* <div style={{display: "inline-block"}}>
                <img className="symbolIcon" src={solanaIcon}></img>{collection.floorPrice}0.2
              </div> */}
              </a>
            </div>
          )));
      }

      setSlides(slidess);
      console.log(slides);
    }
  }

  const listClicked = () => {
    setListing(true);
  }

  const sellClicked = () => {
    var inputElem = document.getElementById("priceInput") as HTMLInputElement;

    console.log(inputElem.value);//todo - not working - value empty

    var sellUrl = "api-devnet.magiceden.dev/v2/instructions/sell?seller={{sellerPubKey}}&auctionHouseAddress={{auctionHouseAddress}}&tokenMint={{mintAccAddress}}&tokenAccount={{tokenAccount}}&price={{price}}&sellerReferral={{sellerReferalWallet}}";
  }

  const getCollections = async () => {
    var config = {
      method: 'get',
      url: 'https://api-mainnet.magiceden.dev/v2/wallets/'+ wallet + '/tokens?offset=0&limit=10&listStatus=unlisted',
      params:{headers: { Authorization: "Bearer " + apikey }, 'Access-Control-Allow-Origin': '*',}
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
      console.log('user collections');
      //console.log(data);
    }
  
  }, 3000)

  return () => clearInterval(intervalId); //This is important
 
}, [slides, wallet, data, listing])


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