import React, { ReactNode } from "react";
import {Row, Col, Container} from "react-bootstrap";
import enlargeIcon from './enlargeIcon.png'
import solanaIcon from './solanaIcon.png'
import styled from 'styled-components'
import { Key, ReactChild, ReactFragment, ReactPortal, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery, gql } from "@apollo/client";

interface Props {
    children?: ReactNode
    // any props that come into the component
    wallet: any
}

export const CollectionsTable = ({ children, ...props }: Props) => {

  const [data, setData] = useState<any>();
  const wallet = props.wallet;

  const getCollections = async () => {

    var config = {
      method: 'get',
      url: 'https://api-devnet.magiceden.dev/v2/launchpad/collections?offset=0&limit=100'
    };

    axios(config)
    .then(function (response) {
      //console.log(JSON.stringify(response.data));
      setData(response.data);    
      return response.data;
      }).then(function(res) {
        // console.log('get stats');
        //   for(var x=0;x<res.length; x++){
        //     var getStats = {
        //       method: 'get',
        //       url: 'https://api-devnet.magiceden.dev/v2/collections/' + res[x].symbol + '/stats'
        //     };
    
        //     axios(getStats)
        //       .then(function (response) {
        //         console.log(response);
        //         response.data.map((stats:any) => {
        //           res[x].floorPrice = stats.floorPrice;
        //           res[x].volumeAll = stats.volumeAll
        //           res[x].listedCount = stats.listedCount
        //         });
        //       })
        //       .catch(function (error) {
        //         console.log(error);
        //       });
        //   }
      }).catch(function (error) {
      console.log(error);
    });
  }

  useEffect(() => {
        console.log('use effect');
        if(wallet){
          console.log(wallet);
        }
        if(data){
          //console.log(data);
        }
  });
  

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

useEffect(() => {
  const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
    console.log('use effect');
    getCollections();
  
    if(data){
      console.log(data);
    }
  
  }, 5000)

  return () => clearInterval(intervalId); //This is important
 
}, [useState])


return (
  <>
  {data ? (
    <Styles>
      <div>
    <table>
      <thead>
        <tr>
          <th align="left">Name</th>
          <th align="left">Launch Date</th>
          <th align="left">FP</th>
          <th align="left">Volume</th>
          <th align="left">Listed</th>
          <th align="left">Symbol</th>
        </tr>
      </thead>
      <tbody>
        {data.map((collection:any) => (
          <tr 
            key={collection.name}
          >
            <td style={{fontFamily: "Press Start 2P"}}>
              {collection.name} 
            </td>
            <td align="left">{new Date(collection.launchDatetime).toDateString()}</td>
            <td align="left"><img className="symbolIcon" src={solanaIcon}></img>{collection.floorPrice}</td>
            <td align="left">{collection.volumeAll}</td>
            <td align="left">{collection.listedCount}</td>
            <td style={{fontFamily: "Press Start 2P"}} align="left">{collection.symbol}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  </Styles> 
    ) : (
      <h1>Loading...</h1>
  )}
  </>
);
};