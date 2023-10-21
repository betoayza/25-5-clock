import React, { useEffect, useState, useRef } from "react";
import moment from "moment";

export const Clock = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60 * 1000);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const alarmRef = useRef(null);

  const breakingTimeStyle = {
    color: "red",
  };

  const sessionTimeStyle = {
    color: "yellowgreen",
  };

  const stoppedStyle = {
    color: "red",
  };

  const handleStartStop = () => {
    setIsRunning((prevState) => !prevState);
    setIsStopped((prevState) => !prevState);
  };

  const handleRestartTimer = async () => {
    setIsBreakTime(false);
    setIsRunning(false);
    setTimeLeft(25 * 60 * 1000);
    setSessionLength(25);
    setBreakLength(5);

    playAlarm();
  }; //works

  const handleSessionLengthChange = (e) => {
    console.log(e.target.innerText);

    const operator = e.target.innerText.toString();

    switch (operator) {
      case "-":
        if (sessionLength >= 2 && sessionLength <= 60) {
          setSessionLength((prevState) => prevState - 1);
        } else return;

        break;

      case "+":
        if (sessionLength >= 1 && sessionLength <= 59) {
          setSessionLength((prevState) => prevState + 1);
        } else return;

        break;
    }
  }; // works

  const handleBreakLengthChange = (e) => {
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
  }; //works

  const playAlarm = () => {
    if (alarmRef.current) {
      alarmRef.current
        .play()
        .then(() => {})
        .catch((error) => error);
    }
  };

  // update timer by Session setup
  useEffect(() => {
    setTimeLeft(sessionLength * 60 * 1000);
  }, [sessionLength]);

  // handle break time beginning
  useEffect(() => {
    if (isBreakTime) {
      console.log("Is break time...");

      setTimeLeft(breakLength * 60 * 1000);

      playAlarm();
    }
  }, [isBreakTime]);

  // handle time points
  useEffect(() => {
    if (isRunning) {
      if (timeLeft === 0 && !isBreakTime) {
        const timer1 = setTimeout(() => {
          setIsBreakTime(true);
        }, 1000);

        return () => {
          clearTimeout(timer1);
        };
      }

      if (timeLeft === 0 && isBreakTime) {
        const timer2 = setTimeout(() => {
          handleRestartTimer();
        }, 1000);

        return () => {
          clearTimeout(timer2);
        };
      }
    }
  }, [timeLeft, isRunning, isBreakTime]);

  // Tick handler
  useEffect(() => {
    if (isRunning) {
      const countdownInterval = setInterval(
        () => setTimeLeft((prevTimeLeft) => prevTimeLeft - 1000),
        1000
      );

      return () => {
        clearInterval(countdownInterval);
      };
    }
  }, [isRunning, timeLeft]); //timeLeft es necesario en el tracker

  return (
    <div id="app-div">
      <h1>25+5 Clock</h1>

      <div id="break-session-div">
        <div>
          <label id="break-label">Break</label>
          <label id="break-length">{breakLength}</label>
          <button
            id="break-increment"
            onClick={handleBreakLengthChange}
            disabled={isStopped}
          >
            +
          </button>
          <button
            id="break-decrement"
            onClick={handleBreakLengthChange}
            disabled={isStopped}
          >
            -
          </button>
        </div>

        <div>
          <label id="session-label">Session</label>
          <label id="session-length">{sessionLength}</label>
          <button
            id="session-increment"
            onClick={handleSessionLengthChange}
            disabled={isStopped}
          >
            +
          </button>
          <button
            id="session-decrement"
            onClick={handleSessionLengthChange}
            disabled={isStopped}
          >
            -
          </button>
        </div>
      </div>

      <div>
        <label
          id="timer-label"
          style={
            isRunning
              ? isBreakTime
                ? breakingTimeStyle
                : sessionTimeStyle
              : timeLeft === sessionLength * 60 * 1000
              ? { color: "white" }
              : stoppedStyle
          }
        >
          {isRunning
            ? isBreakTime
              ? "break..."
              : "Timing..."
            : timeLeft === sessionLength * 60 * 1000
            ? "Session"
            : "Stopped"}
        </label>
        <label id="time-left">
          {timeLeft === 60 * 60 * 1000
            ? "60:00"
            : moment.utc(timeLeft).format("mm:ss")}
        </label>
      </div>
      <button id="start_stop" onClick={handleStartStop}>
        Start/Stop
      </button>
      <button
        id="reset"
        onClick={() => {
          setBreakLength(5);
          setSessionLength(25);
          handleRestartTimer();
        }}
      >
        Reset
      </button>
      <audio
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        type="audio/mpeg"
        className="clip"
        id="beep"
        ref={alarmRef}
      >
        Error
      </audio>
    </div>
  );
};
