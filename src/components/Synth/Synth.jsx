import React, { useEffect, useState } from 'react'
import './Synth.css'
import { keyToNote, allKeys } from "../../utils/keymap";

import * as Tone from "tone";

const Synth = (props) => {

  const[octave, setOctave] = useState(4)
  const [keyState, setPressed] = useState(allKeys)

  let synth = new Tone.PolySynth().toDestination();

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [])

  function upHandler(){

  }
  
  function downHandler(){
    
  }

  function playNote(note) {
    synth.triggerAttack(note)
  }

  function stopNote(note) {
    synth.triggerRelease(note)
  }

  function getNote(key, shift) {
    if(shift){
      return `${keyToNote[key]}${octave+1}`
    } else {
      return `${keyToNote[key]}${octave}`
    }
  }




return (
<div>
  <div className= 'col-1'>
    <div className='note-wrapper'>
      {keyState.blackkeys.map((blackkey, index) => (
        <button
          className={
            "note-black" +
            " " +
            blackkey.id 
          }
          key={index}
          onMouseDown={() => playNote(getNote(blackkey.id[0], blackkey.shiftUp))}
          onMouseUp={() => stopNote(getNote(blackkey.id[0], blackkey.shiftUp))}
          onMouseOut={() => stopNote(getNote(blackkey.id[0], blackkey.shiftUp))}
        >
          {blackkey.id.toUpperCase()}
        </button>
      ))}
    </div>
    <div className='note-wrapper'>
      {keyState.whitekeys.map((whitekey, index) => (
        <button
          className={
            "note-white" +
            " " +
            whitekey.id
          }
          key={index}
          onMouseDown={() => playNote(getNote(whitekey.id, whitekey.shiftUp))}
          onMouseUp={() => stopNote(getNote(whitekey.id, whitekey.shiftUp))}
          onMouseOut={() => stopNote(getNote(whitekey.id, whitekey.shiftUp))}
        > 
          {whitekey.id}
        </button>
      ))}  
    </div>
  </div>
</div>

)
}

export default Synth