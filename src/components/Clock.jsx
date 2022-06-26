import React, {useState} from 'react'
import moment from 'moment';
import useCountDown from 'react-countdown-hook';

const initialTime = 60 * 1000 * 25; // initial time in milliseconds, defaults to 60000
const interval = 1000; // interval to change remaining time amount, defaults to 1000

//const initialTime=moment("25:00", "mmss").format("mm:ss");
console.log(initialTime);
console.log(typeof initialTime);
//const initialTime=moment.duration(25, "minutes");

export const Clock = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25); 
  const [timeLeft, { start, pause, resume, reset }] = useCountDown(initialTime, interval);
  const [timerState, setTimerState] = useState('stopping');
 
  const handleStartStop=()=>{
    switch(timerState){
      case 'stopping':
        start();
        setTimerState('running');
        break;
      case 'running':
        pause();
        setTimerState('paused');
        break;
      case 'paused':
        resume();  
        setTimerState('running');
        break;
    };    
  };

  const restart = () => {       
    reset();
    start();
  };

  return (
    <div id="app-div">
        <h1>25+5 Clock</h1>
        
        <div id="break-session-div">
          <div>
            <label id="break-label">Break Length</label>
            <label id="break-length">{breakLength}</label>
            <button id="break-decrement" onClick={()=>(breakLength > 0 && breakLength <= 60) ? setBreakLength(breakLength-1) : breakLength}>-</button>
            <button id="break-increment" onClick={()=>(breakLength >= 0 && breakLength < 60) ? setBreakLength(breakLength+1) : breakLength}>+</button>          
          </div>
         
          <div>
            <label id="session-label">Session Length</label>
            <label id="session-length">{sessionLength}</label>
            <button id="session-decrement" onClick={()=>(sessionLength > 0 && sessionLength <= 60) ? setSessionLength(sessionLength-1) : sessionLength}>-</button>
            <button id="session-increment" onClick={()=>(sessionLength >= 0 && sessionLength < 60) ? setSessionLength(sessionLength+1) : sessionLength}>+</button>
          </div>
        </div>
      
        <div>
           <label id="timer-label">Session</label>
           <label id="time-left">{moment(new Date(timeLeft).toISOString()).format("mm:ss")}</label>
        </div>
        <button id="start_stop" onClick={handleStartStop}>Start/Stop</button>
        <button id="reset" onClick={()=>{setBreakLength(5); setSessionLength(25); restart();}}>Reset</button>
    </div>
  )
}
