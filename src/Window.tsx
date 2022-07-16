import React, { ReactNode } from "react";
import {Row, Col, Container} from "react-bootstrap";
import enlargeIcon from './enlargeIcon.png'
import './Window.css'
import { Key, ReactChild, ReactFragment, ReactPortal, useCallback, useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Routes,
  useParams, 
} from "react-router-dom";

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
    borderRadius: "20px",
    height: "80vh"
  };

  const windowStyle = {
    backgroundColor: '#060B15',
    padding:"30px",
    paddingBottom:"10px",
    paddingTop: "0"
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
            <Col style={{marginLeft:"1%"}}><Link to={`/Sniper/`} key={props.title} className="link">x</Link></Col>
            <Col xs={8} md={6} style={{textAlign:"center"}}><p>{props.title}</p></Col>
            <Col></Col>
        </Row>
        <div style={windowStyle} className="windowChildren">
            
            {children}
        </div>
    </div>
  );
};