import React, { useEffect, useState, useRef } from 'react'
import './Operator.css'
import Synth from "../../components/Synth/Synth";
import DrumPad from "../../components/DrumPad/DrumPad";

import "antd/dist/antd.css";
import { InputNumber, Button } from 'antd';

import { Knob, Pointer, Scale} from 'rc-knob'

import * as Tone from "tone";

import io from "socket.io-client";

// const SOCKET_SERVER_URL = "http://localhost:4000";
const SOCKET_SERVER_URL = "https://op1-chat.netlify.app/";

//draw function
let total;
let current;

const Operator = (props) => {

  //recording

  const recorder = new Tone.Recorder()
  
  const [showSynth, setShowSynth] = useState(true);
  const [showDrumPad, setShowDrumPad] = useState(false);

  const [synthType, setSynthType] = useState('Synth')
  const [volume, setVolume] = useState(-9);
  const[octave, setOctave] = useState(4)

  const [attack, setAttack] = useState(0.005)
  const [decay, setDecay] = useState(0.1)
  const [sustain, setSustain] = useState(0.3)
  const [release, setRelease] = useState(1)
  const [effectType, setEffectType] = useState('')

  const chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination().connect(recorder).start()
  const dist = new Tone.Distortion(0.8).toDestination().connect(recorder)
  const reverb = new Tone.Reverb().toDestination().connect(recorder)
  const feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toDestination().connect(recorder)

  const lowPass = new Tone.Filter({
    frequency: 11000,
  }).connect(recorder)
  
  const canvasRef = useRef(null)
  
  const synthRef = useRef()
  const kicksRef = useRef()
  const snaresRef = useRef()
  const hihatsRef = useRef()
  const socketRef  = useRef() 

  const { roomId } = props.match.params

  useEffect(()=> {

    if(effectType === 'chorus'){
      synthRef.current = new Tone.PolySynth(Tone[synthType]).connect(chorus).connect(recorder)

      kicksRef.current = new Tone.MembraneSynth().connect(chorus).connect(recorder)

      snaresRef.current = new Tone.NoiseSynth({
        volume: 5,
        noise: {
          type: 'pink',
          playbackRate: 3,
        },
        envelope: {
          attack: 0.001,
          decay: 0.20,
          sustain: 0,
          release: 0.03,
        },
      }).chain(lowPass, chorus).connect(recorder)

      hihatsRef.current = new Tone.NoiseSynth({
        volume: -10,
        envelope: {
          attack: 0.02,
          decay: 0.03
        }
      }).connect(chorus).connect(recorder)
      
    } else if(effectType === 'dist') {
      synthRef.current = new Tone.PolySynth(Tone[synthType]).connect(dist).connect(recorder)

      kicksRef.current = new Tone.MembraneSynth().connect(dist).connect(recorder)

      snaresRef.current = new Tone.NoiseSynth({
        volume: 5,
        noise: {
          type: 'pink',
          playbackRate: 3,
        },
        envelope: {
          attack: 0.001,
          decay: 0.20,
          sustain: 0,
          release: 0.03,
        },
      }).chain(lowPass, dist).connect(recorder)

      hihatsRef.current = new Tone.NoiseSynth({
        volume: -10,
        envelope: {
          attack: 0.02,
          decay: 0.03
        }
      }).connect(dist).connect(recorder)



    } else if(effectType === 'rev') {
      synthRef.current = new Tone.PolySynth(Tone[synthType]).connect(reverb).connect(recorder)

      kicksRef.current = new Tone.MembraneSynth().connect(reverb).connect(recorder)

      snaresRef.current = new Tone.NoiseSynth({
        volume: 5,
        noise: {
          type: 'pink',
          playbackRate: 3,
        },
        envelope: {
          attack: 0.001,
          decay: 0.20,
          sustain: 0,
          release: 0.03,
        },
      }).chain(lowPass, reverb).connect(recorder)

      hihatsRef.current = new Tone.NoiseSynth({
        volume: -10,
        envelope: {
          attack: 0.02,
          decay: 0.03
        }
      }).connect(reverb).connect(recorder)

    } else if(effectType === 'delay') {
      synthRef.current = new Tone.PolySynth(Tone[synthType]).connect(feedbackDelay).connect(recorder)

      kicksRef.current = new Tone.MembraneSynth().connect(feedbackDelay).connect(recorder)

      snaresRef.current = new Tone.NoiseSynth({
        volume: 5,
        noise: {
          type: 'pink',
          playbackRate: 3,
        },
        envelope: {
          attack: 0.001,
          decay: 0.20,
          sustain: 0,
          release: 0.03,
        },
      }).chain(lowPass, feedbackDelay).connect(recorder)

      hihatsRef.current = new Tone.NoiseSynth({
        volume: -10,
        envelope: {
          attack: 0.02,
          decay: 0.03
        }
      }).connect(feedbackDelay).connect(recorder)

    } else {
      synthRef.current = new Tone.PolySynth(Tone[synthType]).toDestination().connect(recorder)

      kicksRef.current = new Tone.MembraneSynth().toDestination().connect(recorder)
      snaresRef.current = new Tone.NoiseSynth({
        volume: 5,
        noise: {
          type: 'pink',
          playbackRate: 3,
        },
        envelope: {
          attack: 0.001,
          decay: 0.20,
          sustain: 0,
          release: 0.03,
        },
      }).connect(lowPass).toDestination().connect(recorder)

      hihatsRef.current = new Tone.NoiseSynth({
        volume: -10,
        envelope: {
          attack: 0.02,
          decay: 0.03
        }
      }).toDestination().connect(recorder)
    }

    const activeSynths = {}
    const activeKicks = {}
    const activeSnares = {}
    const activeHihats = {}
        
    socketRef.current = io(SOCKET_SERVER_URL, {
      query: { roomId }
    })

    socketRef.current.on('play', playMessage)

    function playMessage(note){
  
      const incomingNote = {
        ...note,
        ownedByCurrentUser: note.senderId === socketRef.current.id
      }

      let src = note.name

      if(note.instrument === 'synth' && note.type ==='attack'){

        if(!activeSynths[src]) {
          activeSynths[src] = synthRef.current
        }
        activeSynths[src].triggerAttack(src)
      }

      //account for change in octave

      if(note.instrument === 'synth' && note.type ==='release'){
        if(activeSynths[src]) { 
        activeSynths[src].triggerRelease(src)
        }
        let s = src.split("")[0]
        Object.keys(activeSynths).forEach((key) => {
          if(key.includes(s)){
            activeSynths[key].triggerRelease(key)
          } 
        })
      }

      if(note.instrument === 'drumpad' && note.name === 'a'){
        if(!activeKicks[src]) {
          activeKicks[src] = kicksRef.current
        }
        activeKicks[src].triggerAttackRelease('C0','2n'); 
      }

      if(note.instrument === 'drumpad' && note.name === 's'){
        if(!activeSnares[src]) {
          activeSnares[src] = snaresRef.current
        }
        activeSnares[src].triggerAttackRelease('16n'); 
      }

      if((note.instrument === 'drumpad' && note.name === 't') || (note.instrument === 'drumpad' && note.name === 'y')){
        if(!activeHihats[src]) {
          activeHihats[src] = hihatsRef.current
        }
        activeHihats[src].triggerAttackRelease('32n'); 
      }

    }

    return () => {
      socketRef.current.disconnect()
      Object.values(activeSynths).forEach((synth) => {
        synth.dispose()
      })
      Object.values(activeKicks).forEach((synth) => {
        synth.dispose()
      })
      Object.values(activeSnares).forEach((synth) => {
        synth.dispose()
      })
      Object.values(activeHihats).forEach((synth) => {
        synth.dispose()
      })
    }

  }, [synthType, effectType, roomId, showDrumPad, showSynth])
 
  useEffect(() => {

    synthRef.current.volume.value = volume
    kicksRef.current.volume.value = volume + 5
    snaresRef.current.volume.value = volume + 5
    hihatsRef.current.volume.value = volume

    synthRef.current.set({
      envelope: {
        attack: attack,
        decay: decay,
        sustain: sustain,
        release: release
      }
    }).connect(recorder)

    return synthRef.current

  }, [volume, attack, decay, sustain, release, synthType, effectType, showSynth])



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

    return canvasRef.current

  }, [attack, decay, sustain, release, synthType, effectType])



  const handleVolume = (event) => {
    setVolume(event);
  };

  const handleAttack = (event) => {
    setAttack(event);
    console.log(attack)
  }

  const handleDecay = (event) => {
    setDecay(event);
  }

  const handleSustain = (event) => {
    setSustain(event);
  }

  const handleRelease = (event) => {
    setRelease(event);
  }

  function toggleInstrument() {
    setShowSynth(!showSynth);
    setShowDrumPad(!showDrumPad);
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
        value={volume}
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
      <div className='row'>
      <button className= "synth-keys">
      <svg viewBox="0 0 56.693 56.693">
      <path d="M33.4 24c-.7 0-1.3.6-1.3 1.3 0 .2.1.5.2.6l-1.5 1.6-1.5-4.3c-.1-.2-.2-.3-.4-.3h-1.1c-.2 0-.3.1-.4.3l-3.2 9.2c0 .1 0 .3.1.4.1.1.2.2.3.2H32c.1 0 .2-.1.3-.2s.1-.2.1-.4L31 28.5l1.8-1.9c.2.1.4.1.6.1.7 0 1.3-.6 1.3-1.3s-.6-1.4-1.3-1.4zm-1.9 8.3h-6.3l2.9-8.4h.5l1.5 4.4-2.7 2.9.6.5 2.4-2.6 1.1 3.2z" class="f"></path>
      </svg>
      </button>
      </div>
    </div>  
    <div className='display'>
    <canvas ref={canvasRef} height="164" width="246" ></canvas>
    </div>
    <div className= 'col'>
    <div className='row'>
      <button className= "parameters align-knob" disabled={showDrumPad && true}>
        <Knob 
          size={100}  
          angleOffset={220} 
          angleRange={280}
          steps={10}
          snap={false}
          min={0}
          max={2}
          value={0}
          onChange={event => handleAttack(event)}
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
      <button className= "parameters align-knob" disabled={showDrumPad && true}>
        <Knob 
        size={100}  
        angleOffset={220} 
        angleRange={280}
        steps={10}
        snap={false}
        min={0}
        max={2}
        value={0}
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
      <button className= "parameters align-knob" disabled={showDrumPad && true}>
        <Knob 
        size={100}  
        angleOffset={220} 
        angleRange={280}
        steps={10}
        snap={false}
        min={0}
        max={1}
        value={3}
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
      <button className= "parameters align-knob" disabled={showDrumPad && true}>
        <Knob 
        size={100}  
        angleOffset={220} 
        angleRange={280}
        steps={10}
        snap={false}
        min={0}
        max={5}
        value={5}
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
      <button className= "synth-keys" onClick={() => {setSynthType('Synth')}} disabled={(synthType==='Synth' || showDrumPad) ? true : false}>1</button>
      <button className= "synth-keys" onClick={() => {setSynthType('DuoSynth')}} disabled={(synthType==='DuoSynth' || showDrumPad) ? true : false}>2</button>
      <button className= "synth-keys" onClick={() => {setSynthType('FMSynth')}} disabled={(synthType==='FMSynth' || showDrumPad) ? true : false}>3</button>
      <button className= "synth-keys" onClick={() => {setSynthType('AMSynth')}} disabled={(synthType==='AMSynth' || showDrumPad) ? true : false}>4</button>
      <button className= {(effectType!=='chorus') ? "synth-keys" : "synth-keys toggled"} onClick={() => {(effectType !=='chorus') ? setEffectType('chorus') : setEffectType('')}}>7 CHORUS</button>
      <button className= {(effectType!=='rev') ? "synth-keys" : "synth-keys toggled"} onClick={() => {(effectType !=='rev') ? setEffectType('rev') : setEffectType('')}}>8 REV</button>
            <button className= {(effectType!=='delay') ? "synth-keys" : "synth-keys toggled"} onClick={() => {(effectType !=='delay') ? setEffectType('delay') : setEffectType('')}}>9 DELAY</button>
      <button className= {(effectType!=='dist') ? "synth-keys" : "synth-keys toggled"} onClick={() => {(effectType !=='dist') ? setEffectType('dist') : setEffectType('')}}>0 DIST</button>
    </div>
    </div>
    
  </div>
  {showSynth && <Synth {...props} socketRef={socketRef} octave={octave} setOctave={setOctave} synthType= {synthType} setSynthType={setSynthType} effectType={effectType} setEffectType={setEffectType} toggleInstrument={toggleInstrument} recorder={recorder} synthRef={synthRef}/>} 
  {showDrumPad && <DrumPad {...props} toggleInstrument={toggleInstrument} socketRef={socketRef} synthType={synthType} setSynthType={setSynthType} effectType={effectType} setEffectType={setEffectType} recorder={recorder}/>}
  </>
)

}

export default Operator;

