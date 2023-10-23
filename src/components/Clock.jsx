import React, { useEffect, useState, useRef } from "react";
import moment from "moment";

const breakingTimeStyle = {
  color: "red",
};

const sessionTimeStyle = {
  color: "yellowgreen",
};

const stoppedStyle = {
  color: "red",
};

export const Clock = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60 * 1000);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isStopped, setIsStopped] = useState(true);
  const [timeStyle, setTimeStyle] = useState({ color: "white" });
  const [isBreakAndSessionEnabled, setIsBreakAndSessionEnabled] =
    useState(true);
  const alarmRef = useRef(null);

  const handleStartStop = () => {
    setIsRunning((prevState) => !prevState);
    setIsStopped((prevState) => !prevState);
    setIsBreakAndSessionEnabled(false);
  };

  const handleRestartTimer = async () => {
    setIsBreakTime(false);
    setIsRunning(false);
    setIsStopped(true);
    setTimeLeft(25 * 60 * 1000);
    setSessionLength(25);
    setBreakLength(5);
    setTimeStyle({ color: "white" });
    setIsBreakAndSessionEnabled(true);

    playAlarm();
    rewindAlarm();
  };

  const startNewSession = () => {
    setIsBreakTime(false);
    setSessionLength(25);
    setBreakLength(5);
    setTimeLeft(25 * 60 * 1000);
    setTimeStyle({ color: "white" });

    playAlarm();
    rewindAlarm();
  };

  const handleSessionLengthChange = (e) => {
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
  };

  const handleBreakLengthChange = (e) => {
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

  const playAlarm = () => {
    if (alarmRef.current) {
      alarmRef.current.currentTime = 0;
      alarmRef.current.play();
    }
  };

  const rewindAlarm = () => {
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    isBreakAndSessionEnabled && isStopped && setTimeStyle({ color: "white" });
    !isBreakAndSessionEnabled && isStopped && setTimeStyle(stoppedStyle);

    isRunning && !isBreakTime && setTimeStyle(sessionTimeStyle);
    !isBreakTime &&
      isRunning &&
      !isStopped &&
      !isBreakAndSessionEnabled &&
      setTimeStyle(sessionTimeStyle);

    isRunning && isBreakTime && setTimeStyle(breakingTimeStyle);
  }, [isRunning, isStopped, isBreakTime, isBreakAndSessionEnabled]);

  // update timer by Session setup
  useEffect(() => {
    setTimeLeft(sessionLength * 60 * 1000);
  }, [sessionLength]);

  // handle break time beginning
  useEffect(() => {
    if (isBreakTime) {
      setTimeLeft(breakLength * 60 * 1000);

      playAlarm();
    }
  }, [isBreakTime]);

  // handle time points
  useEffect(() => {
    if (isRunning) {
      if (timeLeft === 0 && !isBreakTime) {
        setTimeStyle(breakingTimeStyle);

        const timer1 = setTimeout(() => {
          setIsBreakTime(true);
        }, 1000);

        return () => {
          clearTimeout(timer1);
        };
      }

      if (timeLeft === 0 && isBreakTime) {
        setTimeStyle({ color: "white" });

        const timer2 = setTimeout(() => {
          startNewSession();
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
  }, [isRunning, timeLeft]);

  return (
    <div id="main-div">
      <div class="div-gen" id="title-div">
        <h1>25+5 Clock</h1>
      </div>

      <div id="break-session-div">
        <div class="div-gen format-break-session-div">
          <label id="break-label">Break</label>
          <label id="break-length">{breakLength}</label>
          <button
            id="break-increment"
            onClick={handleBreakLengthChange}
            disabled={!isBreakAndSessionEnabled}
          >
            +
          </button>
          <button
            id="break-decrement"
            onClick={handleBreakLengthChange}
            disabled={!isBreakAndSessionEnabled}
          >
            -
          </button>
        </div>

        <div class="div-gen format-break-session-div">
          <label id="session-label">Session</label>
          <label id="session-length">{sessionLength}</label>
          <button
            id="session-increment"
            onClick={handleSessionLengthChange}
            disabled={!isBreakAndSessionEnabled}
          >
            +
          </button>
          <button
            id="session-decrement"
            onClick={handleSessionLengthChange}
            disabled={!isBreakAndSessionEnabled}
          >
            -
          </button>
        </div>
      </div>

      <div class="div-gen">
        <label id="timer-label" style={timeStyle}>
          {isBreakAndSessionEnabled
            ? "Session"
            : isRunning
            ? isBreakTime
              ? "Break..."
              : "Timing..."
            : isStopped
            ? "Stopped"
            : "Timing..."}
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
