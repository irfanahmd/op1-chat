import React, { useEffect, useState } from 'react'
import './Synth.css'
import { keyToNote, allKeys } from "../../utils/keymap";

import * as Tone from "tone";




const Synth = (props) => {

  
  const [keyState, setPressed] = useState(allKeys)

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [props.octave])


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
    props.synth.triggerAttack(note)
  }

  function stopNote(note) {
    props.synth.triggerRelease(note)
  }

  function getNote(key, shift) {
    if(shift){
      return `${keyToNote[key]}${props.octave+1}`
    } else {
      return `${keyToNote[key]}${props.octave}`
    }
  }

  function handleOctaveUp() { 
    if (props.octave < 8) {
     props.setOctave(props.octave + 1)
   } 
 }

 function handleOctaveDown() {
   if (props.octave > 0)
   {
     props.setOctave(props.octave - 1)
   }
 }


return (
<div>
  <div className= 'col'>
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
        <button className= "synth-keys" disabled={true}>
          <svg viewBox="0 0 56.693 56.693">
          <path  fill="#0098D4" d="M31.93 32.047c-.848 0-1.536-.688-1.536-1.535v-4.42c0-.403-.33-.73-.733-.73-.406 0-.736.327-.736.73l-.026 4.422c0 .845-.688 1.533-1.535 1.533s-1.535-.688-1.535-1.535v-4.42c0-.403-.33-.73-.735-.73-.406 0-.736.327-.736.73l-.01 4.42c0 .847-.687 1.535-1.533 1.535-.847 0-1.536-.688-1.536-1.535v-.4h.8v.4c0 .405.33.734.736.734.404 0 .733-.33.733-.734l.01-4.42c0-.844.688-1.532 1.536-1.532.847 0 1.536.688 1.536 1.533v4.42c0 .404.328.733.733.733s.734-.33.734-.734l.026-4.42c0-.844.69-1.532 1.538-1.532.847 0 1.535.688 1.535 1.533v4.42c0 .404.33.733.734.733s.734-.33.734-.734l-.01-4.418c0-.846.69-1.534 1.536-1.534s1.535.688 1.535 1.533v.4h-.8v-.4c0-.404-.33-.732-.735-.732s-.735.33-.735.733l.01 4.418c0 .848-.69 1.537-1.536 1.537z" class="f"></path>
          </svg>
        </button>
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
      <div className='col'>
        <div className='note-wrapper'>
          <button className= "synth-keys">REC</button>
          <button className= "synth-keys">PLAY</button>
        </div>
        <div className='note-wrapper'>
          <button className= "synth-keys" disabled={(props.octave == 0) ? true : false} onClick={handleOctaveDown}>＜</button>
          <button className= "synth-keys" disabled={(props.octave == 8) ? true : false} onClick={handleOctaveUp}>＞</button>
        </div>
      </div>
    </div>
  </div>
</div>

)
}

export default Synth