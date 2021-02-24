import React, {useRef, useEffect} from 'react'
import { Link, useHistory} from "react-router-dom";
import "./Landing.css";
import "antd/dist/antd.css";

import { Input, Button, Image, Typography } from 'antd';

const { Text} = Typography;

const Landing = () => {
  const [roomName, setRoomName] = React.useState("");

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  }

  const roomInput = useRef(null)
  const history= useHistory()

  useEffect(()=> {
    roomInput.current.focus()
  }, [])

  return (

    <div>
      <div className="outerDiv">
        <div className='enterRoom'>
          <h2 style={{display: 'inline'}}>OP-1 CHAT </h2> 
          <Text code>Developed for the Mintbean JS MusicHacks: Web-Beats Hackathon</Text>
          
          <p>A simple to use web-based synthesizer that allows artists to play live in real time with each other via chat rooms </p>
          <Input
          type='text'
          placeholder='Enter Room Name'
          value= {roomName}
          ref={roomInput}
          onChange={handleRoomNameChange}
          onPressEnter={() => history.push(`/${roomName}`)}
          />
          <Link to={`/${roomName}`}> 
            <Button type='primary' block>Create/Join Room</Button>
          </Link>
        </div>
      </div>
    </div>

  )
}

export default Landing;