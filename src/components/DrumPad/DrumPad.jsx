import React, { useEffect, useState } from 'react'
import './DrumPad.css'
import { keyToNote, drumKeys } from "../../utils/keymap";

const DrumPad = (props) => {

  const [keyState, setPressed] = useState(drumKeys)
  const [isRecording, setIsRecording] = useState(true)

  useEffect(() => {

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [props.effectType, props.showDrumPad])


  function downHandler(event){
    if(!event.repeat) {
      const { key } = event;
      let lowkey = key.toLowerCase();

      if(key === '7') {
        (props.effectType !=='chorus') ?
          props.setEffectType('chorus') :
          props.setEffectType('')
      }

      if(key === '8') {
        (props.effectType !=='rev') ?
        props.setEffectType('rev') :
        props.setEffectType('')
      }

      if(key === '9') {
        (props.effectType !=='delay') ?
        props.setEffectType('delay') :
        props.setEffectType('')
      }

      if(key === '0') {
        (props.effectType !=='dist') ?
        props.setEffectType('dist') :
        props.setEffectType('')
      }

      if(lowkey === 'a') {
        keyState.whitekeys.forEach((wkey, index) => {
          if(wkey.id[0] === lowkey) {
            playKick()
            togglePressedWhite(index)
            return;
          }
        })
      } else if(lowkey === 's') {
        keyState.whitekeys.forEach((wkey, index) => {
          if(wkey.id[0] === lowkey) {
            playSnare()
            togglePressedWhite(index)
            return;
          }
        })
      } else if(lowkey === 't' || lowkey === 'y') {
        keyState.blackkeys.forEach((bkey, index) => {
          if(bkey.id[0] === lowkey || bkey.id[3] === lowkey) {
            playHihat()
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

    if(lowkey === 'a') {
      keyState.whitekeys.forEach((wkey, index) => {
        if(wkey.id[0] === lowkey) {
          togglePressedWhite(index)
          return;
        }
      })
    }

    if(lowkey === 's') {
      keyState.whitekeys.forEach((wkey, index) => {
        if(wkey.id[0] === lowkey) {
          togglePressedWhite(index)
          return;
        }
      })
    }

    if(lowkey === 't' || lowkey === 'y') {
      keyState.blackkeys.forEach((bkey, index) => {
        if(bkey.id[0] === lowkey || bkey.id[3] === lowkey) {
          togglePressedBlack(index)
          return;
        }
      })
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

  function playKick() {
    props.socketRef.current.emit('play', {name: 'a', type: 'attackrelease', instrument: 'drumpad'})
  }

  function playSnare() {
    props.socketRef.current.emit('play', {name: 's', type: 'attackrelease', instrument: 'drumpad'})
  }

  function playHihat() {
    props.socketRef.current.emit('play', {name: 't', type: 'attackrelease', instrument: 'drumpad'})
  }

  function toggleRecorder() {
    if(isRecording === true) {
      setIsRecording(!isRecording)
      props.recorder.start()
    } else {
      setTimeout(async () => {
        // the recorded audio is returned as a blob
        const recording = await props.recorder.stop();
        // download the recording by creating an anchor element and blob url
        const url = URL.createObjectURL(recording);
        const anchor = document.createElement("a");
        anchor.download = "recording.webm";
        anchor.href = url;
        anchor.click();
        setIsRecording(!isRecording)
      }, 1000);
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
              : blackkey.disabled ? 
              "note-black disabled " +
              blackkey.id 
              :
              "note-black " +
              blackkey.id 
            }
            key={index}
            disabled={blackkey.disabled}
          >
            {blackkey.id}
          </button>
        ))}
      <div className='note-wrapper'>
        <button className= "synth-keys" onClick={props.toggleInstrument}>
          <svg viewBox="0 0 56.693 56.693">
          <path  fill="#0098D4" d="M31.93 32.047c-.848 0-1.536-.688-1.536-1.535v-4.42c0-.403-.33-.73-.733-.73-.406 0-.736.327-.736.73l-.026 4.422c0 .845-.688 1.533-1.535 1.533s-1.535-.688-1.535-1.535v-4.42c0-.403-.33-.73-.735-.73-.406 0-.736.327-.736.73l-.01 4.42c0 .847-.687 1.535-1.533 1.535-.847 0-1.536-.688-1.536-1.535v-.4h.8v.4c0 .405.33.734.736.734.404 0 .733-.33.733-.734l.01-4.42c0-.844.688-1.532 1.536-1.532.847 0 1.536.688 1.536 1.533v4.42c0 .404.328.733.733.733s.734-.33.734-.734l.026-4.42c0-.844.69-1.532 1.538-1.532.847 0 1.535.688 1.535 1.533v4.42c0 .404.33.733.734.733s.734-.33.734-.734l-.01-4.418c0-.846.69-1.534 1.536-1.534s1.535.688 1.535 1.533v.4h-.8v-.4c0-.404-.33-.732-.735-.732s-.735.33-.735.733l.01 4.418c0 .848-.69 1.537-1.536 1.537z" ></path>
          </svg>
        </button>
        <button className= "synth-keys" onClick={props.toggleInstrument} disabled={true}>
        <svg viewBox="0 0 56.693 56.693">
        <path fill="red" d="M33.103 28.223c0-2.64-2.147-4.787-4.786-4.787s-4.786 2.147-4.786 4.787c0 2.502 1.938 4.538 4.387 4.746v2.08h.8v-2.08c2.45-.21 4.386-2.246 4.386-4.747zm-4.385 3.944v-1.933c.5-.17.867-.63.867-1.187 0-.7-.57-1.27-1.268-1.27-.712 0-1.27.54-1.27 1.227 0 .565.372 1.046.87 1.226v1.938c-2.008-.204-3.586-1.885-3.586-3.945 0-2.198 1.79-3.986 3.986-3.986s3.985 1.788 3.985 3.986c.003 2.06-1.575 3.74-3.582 3.944z" class="f"></path>
        </ svg>
        </button>
      </div>
    </div>
    <div className='note-wrapper'>
    {keyState.whitekeys.map((whitekey, index) => (
        <button
          className={whitekey.pressed ? 
            "active note-white " +
            whitekey.id 
            : whitekey.disabled ?
            "note-white disabled " +
            whitekey.id :
            "note-white " +
            whitekey.id 
          }
          key={index}
          disabled={whitekey.disabled}
        > 
          {whitekey.id}
        </button>
      ))}  
      <div className='col'>
        <div className='note-wrapper'>
          <button className= {isRecording ? "synth-keys" : "synth-keys red"} onMouseDown={toggleRecorder}>REC</button>
          <button className= "synth-keys">PLAY</button>
        </div>
        <div className='note-wrapper'>
          <button className= "synth-keys" disabled={true}>＜</button>
          <button className= "synth-keys" disabled={true}>＞</button>
        </div>
      </div>
    </div>
  </div>
</div>

)
}

export default DrumPad