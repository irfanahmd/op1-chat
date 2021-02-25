import "./NavBar.css";
import "antd/dist/antd.css";
import React, {useState} from "react";
import { Link } from "react-router-dom";
import { Typography, Button } from 'antd';

const NavBar = (props) => {

  let nav = (
    <div>
      <Link to='/' className="NavBar-link">
        <Button type="text">Home</Button>
      </Link>  
      <a href='https://github.com/irfanahmd/op1-chat'>
        <Button type="text">Github</Button>
      </a> 
    </div>
  )

  return <div className="NavBar">{nav}</div>

}

export default NavBar;