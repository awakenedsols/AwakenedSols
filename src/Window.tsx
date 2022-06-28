import React, { ReactNode } from "react";
import {Row, Col, Container} from "react-bootstrap";
import enlargeIcon from './enlargeIcon.png'
import './Window.css'
import { Key, ReactChild, ReactFragment, ReactPortal, useCallback, useEffect, useMemo, useState } from 'react';

interface Props {
    children?: ReactNode,
    title: string
    // any props that come into the component
}

export const Window = ({ children, ...props }: Props) => {
  const open = () => {
    console.log('window opened');
  }

  const windowTopStyle = {
    backgroundColor: '#060B15',
    paddingTop: "5px",
    paddingBottom:"2%",
    border: "1px solid white",
    overflow: "hidden",
    borderRadius: "3%"
  };

  const windowStyle = {
    backgroundColor: '#060B15',
    padding:"30px",
    paddingBottom:"10px",
    paddingTop: "0",
    height:"60vh"
  };

  useEffect(() => {

    var windowElem = document.getElementById("window");
    if(windowElem){
      windowElem.style.overflowY = "scroll";
      windowElem.style.overflowX = "hidden";
    }
  });

  return (
    <div onClick={open} style={windowTopStyle} className="window">
        <Row>
            <Col style={{marginLeft:"1%"}}>x</Col>
            <Col xs={8} md={6} style={{textAlign:"center"}}><p>{props.title}</p></Col>
            <Col><img src={enlargeIcon} style={{width:"20px", marginLeft:"70%"}}></img></Col>
        </Row>
        <div style={windowStyle} className="windowChildren">
            
            {children}
        </div>
    </div>
  );
};