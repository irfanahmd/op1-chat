import React, { useEffect, useState, useRef } from 'react'
import './Operator.css'
import Synth from "../../components/Synth/Synth";

import { Knob, Pointer, Scale} from 'rc-knob'

import * as Tone from "tone";

import io from "socket.io-client";

var total;
var current;

const SOCKET_SERVER_URL = "http://localhost:3000";

const Operator = (props) => {


  const [attack, setAttack] = useState(0.005)
  const [decay, setDecay] = useState(0.1)
  const [sustain, setSustain] = useState(0.3)
  const [release, setRelease] = useState(1)
  
  const [synthType, setSynthType] = useState('Synth')

  // const { roomId } = props.match.params

  const canvasRef = useRef(null)

  const [value, setValue] = useState(-9);
  const[octave, setOctave] = useState(4)

  const synth = new Tone.PolySynth(Tone[synthType]).toDestination()
  
  const synthRef = useRef(synth)
  const socketRef  = useRef() 
 
  useEffect(() => {

    const activeSynths = {}
    const activeDrums = {}

    // socketRef.current = io(SOCKET_SERVER_URL, {
    //   query: { roomId }
    // })

    synthRef.current.volume.value = value
    console.log(synthRef)
    synthRef.current.set({
      envelope: {
        attack: attack,
        decay: decay,
        sustain: sustain,
        release: release
      }
    });
  }, [value, attack, decay, sustain, release, synthType])



  function draw(ctx, canvas) {

    // reset variables
    total = attack + decay + release;
    current = 60;

    //xaxis
    ctx.beginPath()
    ctx.lineWidth = 3;
    ctx.moveTo(60, 250);
    ctx.lineTo(450, 250);
    ctx.stroke();
    ctx.closePath();
  
    // Attack
    ctx.beginPath();
    ctx.moveTo(60, 250);
    ctx.lineTo(attack / total * 300 + current, 50);
    current += attack / total * 300;
  
    // Decay
    ctx.lineTo(decay / total * 300 + current, 250 - sustain * 200);
    current += decay / total * 300;
  
    // Sustain
    ctx.lineTo(current + 100, 250 - sustain * 200);
    current += 100;
  
    // Release
    ctx.lineTo(release / total * 300 + current, 250);
    current += release / total * 300;
  
    // stroke
    ctx.lineWidth = 4;
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.closePath();
  
    // RELEASE LINES
    if (release != 0) {
      // vertical release
      if(release / total > .1){
        ctx.moveTo(current - 10, 30);
        current -= release / total * 300;
        ctx.stroke();
        ctx.closePath();
      } else{
        
        ctx.stroke();
        ctx.closePath();
        current -= release / total * 300;
      }
    }
  
    // key released
    ctx.beginPath();
    ctx.lineTo(current, 260);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.closePath();
  
    // SUSTAIN LINES
    // vertical sustain black
    ctx.save()
    ctx.beginPath();
    ctx.moveTo(current, 250);
    ctx.lineTo(current, 250 - sustain * 200);
    ctx.setLineDash([2, 2]);
    ctx.stroke();
    ctx.closePath();
    ctx.restore()
    if (sustain != 0) {
      ctx.save()
      ctx.beginPath();
      if(sustain > 0.1){
        // vertical sustain blue
        // ctx.moveTo(current - 50, 250);
      }
      // horizontal sustain
      current -= 100;
      ctx.stroke();
      ctx.closePath();
    } 
    else {
      current -= 100;
    }
  
    // DECAY LINES
    if (decay != 0) {
      // vertical decay
      ctx.save()
      ctx.beginPath();
      ctx.moveTo(current, 250);
      ctx.lineTo(current, 250 - sustain * 200);
      ctx.setLineDash([2, 2]);
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#64CC7F";
      if(decay / total > .1){
        // horizontal decay
        ctx.moveTo(current - 10, 30);
        current -= decay / total * 300;
        ctx.stroke();
        ctx.closePath();
        ctx.restore()
      } else{
        ctx.stroke();
        ctx.closePath();
        ctx.restore()
        current -= decay / total * 300;
      }
    }
 
  
    // ATTACK LINES
    if (attack != 0) {
      // vertical attack
      ctx.save()
      ctx.beginPath();
      ctx.moveTo(current, 250);
      ctx.lineTo(current, 50);
      ctx.setLineDash([2, 2]);
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#7DB1EB";
      if(attack / total > .1){
        // horizontal attack
        ctx.moveTo(current - 10, 30);
        current -= attack / total * 300;
        ctx.stroke();
        ctx.closePath();
        ctx.restore()
      } else{
        ctx.stroke();
        ctx.closePath();
        ctx.restore()
        current -= attack / total * 300;
      }
    }
  }
  

  useEffect(() => {
    let canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.scale(0.5, 0.5)
    draw(ctx, canvas)

  }, [attack, decay, sustain, release])



  const handleVolume = (event) => {
    console.log(event);
    setValue(event);
  };

  const handleAttack = (event) => {
    setAttack(event);
    console.log(event)
  }

  const handleDecay = (event) => {
    setDecay(event);
    console.log(event)
  }

  const handleSustain = (event) => {
    setSustain(event);
    console.log(event)
  }

  const handleRelease = (event) => {
    setRelease(event);
    console.log(event)
  }



return (
  <>
  <div className='display-wrapper'>
    <div className= 'col'>
      <button className= "volume-key align-knob">
        <Knob 
        size={100}  
        angleOffset={220} 
        angleRange={280}
        steps={10}
        snap={false}
        min={-50}
        max={0}
        value={value}
        onChange={event => handleVolume(event)}
      >
        <Scale 
          tickWidth={2} 
          tickHeight={2} 
          radius={35} 
        />
        <circle
          r="25"
          cx="50"
          cy="50"
          fill="white"
        />,
        <Pointer 
          width={1} 
          height={20} 
          radius={5}
          type="rect"
          color="#ccc"
        />
      </Knob>
    </button>
      <button className= "synth-keys">METRONOME</button>
    </div>  
    <div className='display'>
    <canvas ref={canvasRef} height="164" width="246" ></canvas>
    </div>
    <div className= 'col'>
    <div className='row'>
      <button className= "parameters align-knob">
        <Knob 
          size={100}  
          angleOffset={220} 
          angleRange={360}
          steps={10}
          snap={false}
          min={0}
          max={2}
          onChange={event => handleAttack(event)}>
          <Scale 
            tickWidth={2} 
            tickHeight={2} 
            radius={35} 
          />
          <circle
            r="25"
            cx="50"
            cy="50"
            fill="#7DB1EB"
          />
          <Pointer 
            width={1} 
            height={20} 
            radius={5}
            type="rect"
            color="#ccc"
          />
        </Knob>
      </button>
      <button className= "parameters align-knob">
        <Knob 
        size={100}  
        angleOffset={220} 
        angleRange={360}
        steps={10}
        snap={false}
        min={0}
        max={2}
        onChange={event => handleDecay(event)}>
          <Scale 
            tickWidth={2} 
            tickHeight={2} 
            radius={35} 
          />
          <circle
            r="25"
            cx="50"
            cy="50"
            fill="#64CC7F"
          />,
          <Pointer 
            width={1} 
            height={20} 
            radius={5}
            type="rect"
            color="#ccc"
          />
        </Knob>
      </button>
      <button className= "parameters align-knob">
        <Knob 
        size={100}  
        angleOffset={220} 
        angleRange={360}
        steps={10}
        snap={false}
        min={0}
        max={1}
        onChange={event => handleSustain(event)}>
          <Scale 
            tickWidth={2} 
            tickHeight={2} 
            radius={35} 
          />
          <circle
            r="25"
            cx="50"
            cy="50"
            fill="white"
          />,
          <Pointer 
            width={1} 
            height={20} 
            radius={5}
            type="rect"
            color="#ccc"
          />
        </Knob>
      </button>
      <button className= "parameters align-knob">
        <Knob 
        size={100}  
        angleOffset={220} 
        angleRange={360}
        steps={10}
        snap={false}
        min={0}
        max={5}
        value={2}
        onChange={event => handleRelease(event)}
        >
          <Scale 
            tickWidth={2} 
            tickHeight={2} 
            radius={35} 
          />
          <circle
            r="25"
            cx="50"
            cy="50"
            fill="#F16F35"
          />,
          <Pointer 
            width={1} 
            height={20} 
            radius={5}
            type="rect"
            color="#ccc"
          />
        </Knob>
      </button>
    </div>
    <div className='row'>
      <button className= "synth-keys" onClick={() => {setSynthType('Synth')}}>1</button>
      <button className= "synth-keys" onClick={() => {setSynthType('FMSynth')}}>2</button>
      <button className= "synth-keys" onClick={() => {setSynthType('AMSynth')}}>3</button>
      <button className= "synth-keys">4</button>
      <button className= "synth-keys">5</button>
      <button className= "synth-keys">6</button>
      <button className= "synth-keys">7</button>
      <button className= "synth-keys">8</button>
    </div>
    </div>
    
  </div>
  <Synth synthRef={synthRef} octave={octave} setOctave={setOctave}/>
  </>
)

}

export default Operator;

