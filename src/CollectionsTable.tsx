import React, { ReactNode } from "react";
import {Row, Col, Container} from "react-bootstrap";
import enlargeIcon from './enlargeIcon.png'
import solanaIcon from './solanaIcon.png'
import styled from 'styled-components'
import { Key, ReactChild, ReactFragment, ReactPortal, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery, gql } from "@apollo/client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
} from "react-router-dom";
import './Window.css';
import { forEach } from "lodash";

interface Props {
    children?: ReactNode
    // any props that come into the component
    wallet: any
}

export const CollectionsTable = ({ children, ...props }: Props) => {

  const [data, setData] = useState<any>();
  const wallet = props.wallet;
  const apikey = process.env.REACT_ME_API_KEY;
  
  const getCollections = async () => {

    var config = {
      method: 'get',
      //url: 'https://api-mainnet.magiceden.dev/v2/launchpad/collections?offset=0&limit=300'
      url: "https://api-mainnet.magiceden.dev/popular_collections?timeRange=1d&edge_cache=true",
      params:{headers: { Authorization: "Bearer " + apikey }}
    };

    axios(config)
    .then(function (response) {
      //console.log(JSON.stringify(response.data));
      setData(response.data);
      return response.data;
      }).catch(function (error) {
      console.log(error);
    });
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
        text-align:right;
        border-bottom: 0;
      }
    }

    th{
      text-align:center;
      background-color: #192026;
      top:0;
      position:sticky;
    }

    tr:last-child.td:last-child{
      border-radius: 15px;
    }

    th,
    td {
      margin: 0;
      padding: 0.2rem;
    }
    tr:hover{
      background-color: #59AD6B;
    }
  }
`

useEffect(() => {
  if(!data){
    getCollections();
  }

  if(data){
    console.log('data');
    console.log(data);
  }

  const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
    console.log('use effect - get collections');
    getCollections();
  
    if(data){
      console.log('print data');
      console.log(data);
    }
  
  }, 3000)

  return () => clearInterval(intervalId); //This is important
 
}, [data])


useEffect(() => {
  console.log('use effect - wallet');
  if(wallet){
    //console.log(wallet);
  }
}, [useState, wallet]);


return (
  <>
  {data ? (
    <Styles>
      <div>
    <table>
      <thead>
        <tr>
          <th align="left">Name</th>
          <th align="left">FP</th>
          <th align="left">Avg. Price(30d)</th>
          <th align="left">Avg. Price(7d)</th>
          <th>Volume</th>
          <th></th>
        </tr>
      </thead>
      {data && 
      data.collections.map((collection:any, i:any) => (
          <tr 
            key={i}
          >
            <td style={{fontFamily: "Press Start 2P"}}>
            <Link to={`/Collection/${collection.symbol}`} className="collectionLink">{collection.name}</Link>
            </td>
            <td align="left"><Link to={`/Collection/${collection.symbol}`} className="collectionLink">{collection.floorPrice.value1h}</Link></td>
            <td align="left"><Link to={`/Collection/${collection.symbol}`}className="collectionLink">{Math.round(collection.avgPrice.prev30d * 100) /100}</Link></td>
            <td align="left"><Link to={`/Collection/${collection.symbol}`}className="collectionLink">{Math.round(collection.avgPrice.prev7d * 100) / 100}</Link></td>
            <td align="left"><Link to={`/Collection/${collection.symbol}`} className="collectionLink">{Math.floor(collection.txVolume.valueAT)}</Link></td>
            <td>{<img width={50} src={collection.image}></img>}</td>
          </tr>
        
        ))}
     
    </table>
    </div>
  </Styles> 
    ) : (
      <h1>Loading...</h1>
  )}
  </>
);
};