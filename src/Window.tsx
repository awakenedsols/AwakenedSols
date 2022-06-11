import React, { ReactNode } from "react";
import {Row, Col, Container} from "react-bootstrap";
import enlargeIcon from './enlargeIcon.png'

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
    paddingBottom:"5%",
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

  var windowElem = document.getElementById("window");
  if(windowElem){
    windowElem.style.overflowY = "scroll";
  }

  return (
    <div onClick={open} style={windowTopStyle} id="window">
        <Row>
            <Col style={{marginLeft:"1%"}}>x</Col>
            <Col xs={12} md={10} style={{textAlign:"center"}}><p>{props.title}</p></Col>
            <Col><img src={enlargeIcon} style={{width:"20px", marginLeft:"70%"}}></img></Col>
        </Row>
        <div style={windowStyle}>
            
            {children}
        </div>
    </div>
  );
};