import React, { useState, useEffect } from "react";
import moment from "moment";
import useCountDown from "react-countdown-hook";

const INITIAL_TIME = 25 * 60 * 1000; // initial time in milliseconds, defaults to 60000
const INTERVAL = 1000; // INTERVAL to change remaining time amount, defaults to 1000

export const Clock = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, { start, pause, resume }] = useCountDown(
    INITIAL_TIME,
    INTERVAL
  );
  const [timerState, setTimerState] = useState("stopping");
  const [breakTimer, setBreakTimer] = useState(null);

  const handleStartStop = () => {
    let bDbtn = document.getElementById("break-decrement");
    let bIbtn = document.getElementById("break-increment");
    let sDbtn = document.getElementById("session-decrement");
    let sIbtn = document.getElementById("session-increment");

    switch (timerState) {
      //first start
      case "stopping":
        // document.getElementById("timer-label").innerHTML = "Session";
        start(sessionLength * 60 * 1000);
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

        bDbtn.disabled = false;
        bIbtn.disabled = false;
        sDbtn.disabled = false;
        sIbtn.disabled = false;

        break;
      case "paused":
        resume();
        console.log("Running");
        setTimerState("running");

        bDbtn.disabled = true;
        bIbtn.disabled = true;
        sDbtn.disabled = true;
        sIbtn.disabled = true;

        break;
    }
  };

  const restart = () => {
    document.getElementById(
      "timer-label"
    ).innerHTML = `<span style='color: white'>Session</span>`;
    console.log("Reset clicked");
    start(INITIAL_TIME);
    pause();
  };

  const handleSessionLength = (e) => {
    console.log(e.target.innerText);
    const operator = e.target.innerText.toString();

    switch (operator) {
      case "-":
        if (sessionLength >= 2 && sessionLength <= 60) {
          setSessionLength(sessionLength - 1);
          start((sessionLength - 1) * 60 * 1000);
          pause();
        } else return;

        break;

      case "+":
        if (sessionLength >= 1 && sessionLength <= 59) {
          setSessionLength(sessionLength + 1);
          start((sessionLength + 1) * 60 * 1000);
          pause();
        } else return;

        break;
    }
  };

  const handleBreakLength = (e) => {
    console.log(e.target.innerText);
    const operator = e.target.innerText.toString();

    switch (operator) {
      case "-":
        if (breakLength > 1 && breakLength <= 60) {
          setBreakLength(breakLength - 1);
        } else return;

        break;

      case "+":
        if (breakLength >= 1 && breakLength <= 59) {
          setBreakLength(breakLength + 1);
        } else return;

        break;
    }
  };

  const showSession = () => {
    //console.log(timeLeft);
    let session = moment(new Date(timeLeft).toISOString()).format("mm:ss");
    console.log(session, typeof session);

    if (session === "00:00") {
      start(sessionLength * 60 * 1000);
      pause();
      console.log(timeLeft);
    } else {
      //start break
      if (session == "00:01") {
        console.log("Starting break in 1 second...");
        setTimeout(() => {
          document.getElementById(
            "timer-label"
          ).innerHTML = `<span style='color: red'>Break...</span>`;

          const playSound = async () => {
            const audio = document.getElementById("beep");
            console.log(audio);

            await audio
              .play()
              .then(() => {})
              .catch((error) => error);

            audio.currentTime = 0;
          };
          playSound();
          start(breakLength * 60 * 1000);
        }, 1000);
      }
    }

    return session;
  };

  return (
    <div id="app-div">
      <h1>25+5 Clock</h1>

      <div id="break-session-div">
        <div>
          <label id="break-label">Break Length</label>
          <label id="break-length">{breakLength}</label>
          <button id="break-decrement" onClick={handleBreakLength}>
            -
          </button>
          <button id="break-increment" onClick={handleBreakLength}>
            +
          </button>
        </div>

        <div>
          <label id="session-label">Session Length</label>
          <label id="session-length">{sessionLength}</label>
          <button id="session-decrement" onClick={handleSessionLength}>
            -
          </button>
          <button id="session-increment" onClick={handleSessionLength}>
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
      <audio
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        type="audio/mpeg"
        className="clip"
        id="beep"
      >
        Error
      </audio>
    </div>
  );
};
