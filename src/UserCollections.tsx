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

interface Props {
    children?: ReactNode
    // any props that come into the component
    wallet: any
}

export const UserCollections = ({ children, ...props }: Props) => {

  const [data, setData] = useState<any>();
  const wallet = props.wallet;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3
  };

  const carouelStyle = {
    height:"30%",
    width: "30%",
    border: "1px solid white",
    borderRadius: "25%"
  };

  const getCollections = async () => {
    console.log('get new colls');
    var config = {
      method: 'get',
      url: 'https://api-devnet.magiceden.dev/v2/wallets/EWmtsfBA8EikR3vvhsXgxn7cBQCUZfXJ7jMwXUpYRzXY/tokens?offset=0&limit=100&listStatus=both'
    };


    axios(config)
    .then(function (response) {
      console.log('axios call');
      console.log(response);
      console.log(JSON.stringify(response.data));
      setData(response.data);    
      return response.data;
      }).catch(function (error) {
      console.log(error);
    });
  }
  


  useEffect(() => {
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
  <div>
    <h3>My NFTs</h3>
  <Slider {...settings}>
          <div>
            <div className="NFTdiv">
              <h6>Awakened Sols</h6>
              <img src="logo.png" className="NFTimage"></img>
              <p>FP: <img className="symbolIcon" src={solanaIcon}></img>0.5</p>
            </div>
          </div>

          <div>
            <div className="NFTdiv">
              <h6>Awakened Sols</h6>
              <img src="logo.png" className="NFTimage"></img>
              <p>FP: <img className="symbolIcon" src={solanaIcon}></img>0.5</p>
            </div>
          </div>

          <div>
            <div className="NFTdiv">
              <h6>Awakened Sols</h6>
              <img src="logo.png" className="NFTimage"></img>
              <p>FP: <img className="symbolIcon" src={solanaIcon}></img>0.5</p>
            </div>
          </div>

          <div>
            <div className="NFTdiv">
              <h6>Awakened Sols</h6>
              <img src="logo.png" className="NFTimage"></img>
              <p>FP: <img className="symbolIcon" src={solanaIcon}></img>0.5</p>
            </div>
          </div>
   </Slider>
   </div>
  // <>
  // {data ? (
  //   <> 
  //   <Slider dots={true}>
  //     {data.map((collection:any) => (
        
  //         <div>
  //           <h3>{collection.name}</h3>
  //           <p><img className="symbolIcon" src={solanaIcon}></img>{collection.floorPrice}</p>
  //           <img src={collection.image}></img>
  //         </div>
    
  //     ))}
  //   </Slider>
  // </>
  //   ) : (
  //     <div>
  //     <h1>Loading...</h1>
  //    </div>
  // )}
  // </>
);
};