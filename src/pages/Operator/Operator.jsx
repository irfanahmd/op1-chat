import React, { useEffect, useState, useRef } from 'react'
import './Operator.css'
import Synth from "../../components/Synth/Synth";

import { Knob, Pointer, Scale} from 'rc-knob'

import * as Tone from "tone";

let synth = new Tone.PolySynth().toDestination()

const Operator = (props) => {

  const [value, setValue] = useState(-9);
  const[octave, setOctave] = useState(4)

  const synthRef = useRef(synth)

  useEffect(() => {
    synthRef.current.volume.value = value
  }, [value])

  const volume = (event) => {
    console.log(event);
    setValue(event);
  };


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
        onChange={event => volume(event)}
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

    </div>
    <div className= 'col'>
    <div className='row'>
      <button className= "parameters align-knob">        <Knob 
        size={100}  
        angleOffset={220} 
        angleRange={360}
        steps={10}
        snap={false}
        min={-50}
        max={0}
        value={value}
        onChange={event => {}}
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
          fill="#7DB1EB"
        />,
        <Pointer 
          width={1} 
          height={20} 
          radius={5}
          type="rect"
          color="#ccc"
        />
      </Knob></button>
      <button className= "parameters align-knob"><Knob 
        size={100}  
        angleOffset={220} 
        angleRange={360}
        steps={10}
        snap={false}
        min={-50}
        max={0}
        value={value}
        onChange={event => {}}
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
          fill="#64CC7F"
        />,
        <Pointer 
          width={1} 
          height={20} 
          radius={5}
          type="rect"
          color="#ccc"
        />
      </Knob></button>
      <button className= "parameters align-knob"><Knob 
        size={100}  
        angleOffset={220} 
        angleRange={360}
        steps={10}
        snap={false}
        min={-50}
        max={0}
        value={value}
        onChange={event => {}}
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
      </Knob></button>
      <button className= "parameters align-knob"><Knob 
        size={100}  
        angleOffset={220} 
        angleRange={360}
        steps={10}
        snap={false}
        min={-50}
        max={0}
        value={value}
        onChange={event => {}}
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
      </Knob></button>
    </div>
    <div className='row'>
    <button className= "synth-keys">1</button>
    <button className= "synth-keys">2</button>
    <button className= "synth-keys">3</button>
    <button className= "synth-keys">4</button>
    <button className= "synth-keys">5</button>
    <button className= "synth-keys">6</button>
    <button className= "synth-keys">7</button>
    <button className= "synth-keys">8</button>
    </div>
    </div>
    
    
  </div>
  <Synth synth={synth} octave={octave} setOctave={setOctave}/>
  </>
)

}

export default Operator;

