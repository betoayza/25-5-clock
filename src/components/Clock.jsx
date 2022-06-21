import React, {useState} from 'react'
import moment from 'moment';

export const Clock = () => {
  const [breakLength, setBreakLength] = useState("5");
  const [sessionLength, setSessionLength] = useState("25");
  const [timerLevel, setTimerLevel] = useState("Session")   
  const initialTime=moment('25:00', 'mm:ss');
  const [timeLeft, setTimeLeft] = useState(initialTime);

  return (
    <div>
        <h1>Clock</h1>
        <label htmlFor="" id="break-label">Break Length</label>
        <label htmlFor="" id="session-label">Session Length</label>
        <button id="break-decrement">asd</button>
        <button id="session-decrement">asd</button>
        <label htmlFor="" id="break-length">{breakLength}</label>
        <label htmlFor="" id="session-length">{sessionLength}</label>
        <div>
           <label id="timer-level">{timerLevel}</label>
           <h1 id="time-left">{timeLeft}></h1>
        </div>
    </div>
  )
}
