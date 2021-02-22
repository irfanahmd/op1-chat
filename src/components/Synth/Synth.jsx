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
  }, [octave])


  function downHandler(event){
    if(!event.repeat) {
      const { key } = event;
      let lowkey = key.toLowerCase();
  
      if ("asdfghjkl;'".includes(lowkey)) {
        keyState.whitekeys.forEach((wkey, index) => {
          if(wkey.id === lowkey) {
            playNote(getNote(lowkey, wkey.shiftUp))
            togglePressedWhite(index)
            return;
          }
        })
      } else if ("qwertyuiop[".includes(lowkey)) {
        keyState.blackkeys.forEach((bkey, index) => {
          if(bkey.id[0] === lowkey || bkey.id[3] === lowkey)
          {
            playNote(getNote(lowkey, bkey.shiftUp))
            togglePressedBlack(index)
            return;
          }
        })
      } else {
        return;
      }
    }
  }


  function upHandler(event){

    const { key } = event;
    let lowkey = key.toLowerCase();

    if ("asdfghjkl;'".includes(lowkey)) {
      keyState.whitekeys.forEach((wkey,index) => {
        if(wkey.id === lowkey) {
          stopNote(getNote(lowkey, wkey.shiftUp))
          togglePressedWhite(index)
          return;
        }
      })
    } else if ("qwertyuiop[".includes(lowkey)) {
      keyState.blackkeys.forEach((bkey, index) => {
        if(bkey.id[0] === lowkey || bkey.id[3] === lowkey) {
          stopNote(getNote(lowkey, bkey.shiftUp))
          togglePressedBlack(index)
          return;
        }
      })
    } else {
      return;
    }
  }

  function togglePressedWhite(index) {
    let arrayCopy = [...keyState.whitekeys];
    arrayCopy[index].pressed = (!arrayCopy[index].pressed)
    setPressed({ ...keyState, whitekeys: arrayCopy });
  }

  function togglePressedBlack(index) {
    let arrayCopy = [...keyState.blackkeys];
    arrayCopy[index].pressed = (!arrayCopy[index].pressed)
    setPressed({ ...keyState, blackkeys: arrayCopy });
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
    <div className='display'>

    </div>
    <div className='note-wrapper'>
      {keyState.blackkeys.map((blackkey, index) => (
        <button
          className={blackkey.pressed ? 
            "active note-black " +
            blackkey.id 
            :
            "note-black " +
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
      <div className='note-wrapper'>
        <button className= "synth-keys" disabled='true'>🎹</button>
        <button className= "synth-keys">🥁</button>
      </div>
    </div>
    <div className='note-wrapper'>
      {keyState.whitekeys.map((whitekey, index) => (
        <button
          className={whitekey.pressed ? 
            "active note-white " +
            whitekey.id 
            :
            "note-white " +
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
      <div className='col-1'>
        <div className='note-wrapper'>
          <button className= "synth-keys">1</button>
          <button className= "synth-keys">2</button>
        </div>
        <div className='note-wrapper'>
          <button className= "synth-keys" disabled={(octave == 0) ? true : false}>＜</button>
          <button className= "synth-keys" disabled={(octave == 8) ? true : false}>＞</button>
        </div>
      </div>
    </div>
  </div>
</div>

)
}

export default Synth