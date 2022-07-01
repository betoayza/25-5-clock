import React, { useState, useEffect } from "react";
import moment from "moment";
import useCountDown from "react-countdown-hook";

//const initialTime = 25 * 60 * 1000; // initial time in milliseconds, defaults to 60000
const INTERVAL = 1000; // INTERVAL to change remaining time amount, defaults to 1000

export const Clock = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, { start, pause, resume, reset }] = useCountDown(
    breakLength,
    INTERVAL
  );
  const [timerState, setTimerState] = useState("stopping");
  const [breakFlag, setBreakFlag] = useState(false);


  const handleStartStop = () => {
    let bDbtn = document.getElementById("break-decrement-btn");
    let bIbtn = document.getElementById("break-increment-btn");
    let sDbtn = document.getElementById("session-decrement-btn");
    let sIbtn = document.getElementById("session-increment-btn");

    switch (timerState) {
      case "stopping":
        start();
        setBreakFlag(true);
        console.log("Running...");
        setTimerState("running");

        bDbtn.disabled = true;
        bIbtn.disabled = true;
        sDbtn.disabled = true;
        sIbtn.disabled = true;   

        break;

      case "running":
        pause();
        console.log("Paused.");
        setTimerState("paused");

        bDbtn = document.getElementById("break-decrement-btn");
        bIbtn = document.getElementById("break-increment-btn");
        bDbtn.disabled = false;
        bIbtn.disabled = false;
        sDbtn.disabled = false;
        sIbtn.disabled = false;

        break;
      case "paused":
        console.log("paused...");
        if(breakFlag===true){
          const session = moment(
            new Date(timeLeft).toISOString()
          ).format("mm:ss");
          console.log(session, typeof session);      
          
            const timerText = document.getElementById("timer-label");
            timerText.textContent = "Break...";
            const newTime = breakLength * 60 * 1000;
            setBreakFlag(false);
            start(newTime);
            
          }else{
          resume();
          console.log("Running");
          setTimerState("running");
  
          bDbtn.disabled = true;
          bIbtn.disabled = true;
          sDbtn.disabled = true;
          sIbtn.disabled = true;
        }

        break;
    }
  };

  const restart = () => {
    reset();
    start();
  };

  const handleSessionLength = (e) => {
    console.log(e.target.innerText);
    const operator = e.target.innerText.toString();

    switch (operator) {
      case "-":
        if (sessionLength >= 2 && sessionLength <= 60) {
          setSessionLength(sessionLength - 1);
          const newTime = (sessionLength - 1) * 60 * 1000;
          console.log(newTime);
          start(newTime);
          pause();
        } else sessionLength;

        break;

      case "+":
        if (sessionLength > 0 && sessionLength <= 59) {
          setSessionLength(sessionLength + 1);
          const newTime = (sessionLength + 1) * 60 * 1000;
          console.log(newTime);
          start(newTime);
          pause();
        } else sessionLength;

        break;
    }
  };

  const handleBreakLength = (e) => {
    console.log(e.target.innerText);
    const operator = e.target.innerText.toString();

    switch (operator) {
      case "-":
        if (breakLength >= 2 && breakLength <= 60) {
          setBreakLength(breakLength - 1);
        } else breakLength;

        break;

      case "+":
        if (breakLength > 0 && breakLength <= 59) {
          setBreakLength(breakLength + 1);
        } else breakLength;

        break;
    }
  };

  const showSession = () => {
    console.log(timeLeft);
    const session = moment(
      new Date(timeLeft).toISOString()
    ).format("mm:ss");
    console.log(session, typeof session);  

    return session;
  };

  return (
    <div id="app-div">
      <h1>25+5 Clock</h1>

      <div id="break-session-div">
        <div>
          <label id="break-label">Break Length</label>
          <label id="break-length">{breakLength}</label>
          <button id="break-decrement-btn" onClick={handleBreakLength}>
            -
          </button>
          <button id="break-increment-btn" onClick={handleBreakLength}>
            +
          </button>
        </div>

        <div>
          <label id="session-label">Session Length</label>
          <label id="session-length">{sessionLength}</label>
          <button id="session-decrement-btn" onClick={handleSessionLength}>
            -
          </button>
          <button id="session-increment-btn" onClick={handleSessionLength}>
            +
          </button>
        </div>
      </div>

      <div>
        <label id="timer-label">Session</label>
        <label id="time-left">{showSession()}</label>
      </div>
      <button id="start_stop" onClick={handleStartStop}>
        Start/Stop
      </button>
      <button
        id="reset"
        onClick={() => {
          setBreakLength(5);
          setSessionLength(25);
          restart();
        }}
      >
        Reset
      </button>
    </div>
  );
};
