import React from 'react'
import './Synth.css'


const Synth = (props) => {

  const keyState = {
    blackobjects: [
      { id: "q  w", pressed: false, shiftUp: false},
      { id: "e", pressed: false, shiftUp: false},
      { id: "r", pressed: false, shiftUp: false},
      { id: "t y", pressed: false, shiftUp: true},
      { id: "u", pressed: false, shiftUp: true},
      { id: "i  o", pressed: false, shiftUp: true},
      { id: "p", pressed: false, shiftUp: true},
      { id: "[", pressed: false, shiftUp: true},
    ],
    whiteobjects: [
      { id: "a", pressed: false, shiftUp: false },
      { id: "s", pressed: false, shiftUp: false },
      { id: "d", pressed: false, shiftUp: false },
      { id: "f", pressed: false, shiftUp: false },
      { id: "g", pressed: false, shiftUp: true },
      { id: "h", pressed: false, shiftUp: true },
      { id: "j", pressed: false, shiftUp: true },
      { id: "k", pressed: false, shiftUp: true },
      { id: "l", pressed: false, shiftUp: true },
      { id: ";", pressed: false, shiftUp: true },
      { id: "'", pressed: false, shiftUp: true },
    ],
  }

return (
<div>
<div>
  {keyState.blackobjects.map((blackkey, index) => (
    <button
      className={
        "note-black" +
        " " +
        blackkey.id 
      }
      key={index}
    >
      {blackkey.id.toUpperCase()}
    </button>
  ))}
</div>
<div>
  {keyState.whiteobjects.map((whitekey, index) => (
    <button
      className={
        "note-white" +
        " " +
        whitekey.id
      }
      key={index}
    > 
    <div>
      <div>
      {whitekey.id}
      </div>
    </div>
    </button>
  ))}  
</div>

</div>

)
}

export default Synth