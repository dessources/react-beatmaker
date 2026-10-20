import { useState, useRef, useEffect } from "react";

const PADS = [0, 1, 2, 3, 4, 5, 6, 7];

function App() {
  const [kickPads, setKickPads] = useState(() => Array(8).fill(false));
  const [snarePads, setSnarePads] = useState(() => Array(8).fill(false));
  const [hihatPads, setHihatPads] = useState(() => Array(8).fill(false));

  const [kickSound, setKickSound] = useState("./sounds/kick-classic.wav");
  const [snareSound, setSnareSound] = useState("./sounds/snare-acoustic01.wav");
  const [hihatSound, setHihatSound] = useState("./sounds/hihat-acoustic01.wav");

  const [muted, setMuted] = useState([false, false, false]);
  const [bpm, setBpm] = useState(150);
  const [tempoText, setTempoText] = useState(150);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animatingPads, setAnimatingPads] = useState({
    kick: Array(8).fill(false),
    snare: Array(8).fill(false),
    hihat: Array(8).fill(false),
  });

  const kickAudioRef = useRef(null);
  const snareAudioRef = useRef(null);
  const hihatAudioRef = useRef(null);
  const indexRef = useRef(0);

  const stateRef = useRef({ kickPads, snarePads, hihatPads });
  useEffect(() => {
    stateRef.current = { kickPads, snarePads, hihatPads };
  }, [kickPads, snarePads, hihatPads]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = (60 / bpm) * 1000;
    const timer = setInterval(() => {
      const step = indexRef.current % 8;
      const { kickPads: kp, snarePads: sp, hihatPads: hp } = stateRef.current;

      setAnimatingPads((prev) => {
        const kick = [...prev.kick];
        const snare = [...prev.snare];
        const hihat = [...prev.hihat];
        kick[step] = true;
        snare[step] = true;
        hihat[step] = true;
        return { kick, snare, hihat };
      });

      if (kp[step] && kickAudioRef.current) {
        kickAudioRef.current.currentTime = 0;
        kickAudioRef.current.play();
      }
      if (sp[step] && snareAudioRef.current) {
        snareAudioRef.current.currentTime = 0;
        snareAudioRef.current.play();
      }
      if (hp[step] && hihatAudioRef.current) {
        hihatAudioRef.current.currentTime = 0;
        hihatAudioRef.current.play();
      }

      indexRef.current += 1;
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, bpm]);

  const togglePad = (track, index) => {
    if (track === "kick") {
      setKickPads((prev) => prev.map((val, i) => (i === index ? !val : val)));
    } else if (track === "snare") {
      setSnarePads((prev) => prev.map((val, i) => (i === index ? !val : val)));
    } else if (track === "hihat") {
      setHihatPads((prev) => prev.map((val, i) => (i === index ? !val : val)));
    }
  };

  const clearPadAnimation = (track, index) => {
    setAnimatingPads((prev) => {
      const updated = [...prev[track]];
      updated[index] = false;
      return { ...prev, [track]: updated };
    });
  };

  const handleMute = (trackIndex) => {
    setMuted((prev) => {
      const next = [...prev];
      next[trackIndex] = !next[trackIndex];
      const volume = next[trackIndex] ? 0 : 1;
      if (trackIndex === 0 && kickAudioRef.current) {
        kickAudioRef.current.volume = volume;
      } else if (trackIndex === 1 && snareAudioRef.current) {
        snareAudioRef.current.volume = volume;
      } else if (trackIndex === 2 && hihatAudioRef.current) {
        hihatAudioRef.current.volume = volume;
      }
      return next;
    });
  };

  const handleChangeSound = (e) => {
    const { name, value } = e.target;
    if (name === "kick-select") {
      setKickSound(value);
    } else if (name === "snare-select") {
      setSnareSound(value);
    } else if (name === "hihat-select") {
      setHihatSound(value);
    }
  };

  return (
    <>
      <div className="sequencer">
        <div className="kick-track">
          <div className="controls">
            <h1>Kick</h1>
            <button
              data-track="0"
              className={`mute kick-volume${muted[0] ? " active" : ""}`}
              onClick={() => handleMute(0)}
            >
              <i className="fas fa-volume-mute"></i>
            </button>
            <select
              name="kick-select"
              id="kick-select"
              value={kickSound}
              onChange={handleChangeSound}
            >
              <option value="./sounds/kick-classic.wav">Classic Kick</option>
              <option value="./sounds/kick-808.wav">808 Kick</option>
              <option value="./sounds/kick-heavy.wav">Kick Heavy</option>
              <option value="./sounds/kick-softy.wav">Kick Softy</option>
            </select>
          </div>
          <div className="kick">
            {PADS.map((i) => (
              <div
                key={i}
                className={`pad kick-pad b${i}${kickPads[i] ? " active" : ""}`}
                style={{
                  animation: animatingPads.kick[i]
                    ? "playTrack 0.3s alternate ease-in-out 2"
                    : "",
                }}
                onClick={() => togglePad("kick", i)}
                onAnimationEnd={() => clearPadAnimation("kick", i)}
              ></div>
            ))}
          </div>
        </div>

        <div className="snare-track">
          <div className="controls">
            <h1>Snare</h1>
            <button
              data-track="1"
              className={`mute snare-volume${muted[1] ? " active" : ""}`}
              onClick={() => handleMute(1)}
            >
              <i className="fas fa-volume-mute"></i>
            </button>
            <select
              name="snare-select"
              id="snare-select"
              value={snareSound}
              onChange={handleChangeSound}
            >
              <option value="./sounds/snare-acoustic01.wav">
                Classic Snare
              </option>
              <option value="./sounds/snare-808.wav">808 Snare</option>
              <option value="./sounds/snare-vinyl02.wav">Snare Vinyl</option>
            </select>
          </div>
          <div className="snare">
            {PADS.map((i) => (
              <div
                key={i}
                className={`pad snare-pad b${i}${snarePads[i] ? " active" : ""}`}
                style={{
                  animation: animatingPads.snare[i]
                    ? "playTrack 0.3s alternate ease-in-out 2"
                    : "",
                }}
                onClick={() => togglePad("snare", i)}
                onAnimationEnd={() => clearPadAnimation("snare", i)}
              ></div>
            ))}
          </div>
        </div>

        <div className="hihat-track">
          <div className="controls">
            <h1>Hihat</h1>
            <button
              data-track="2"
              className={`mute hihat-volume${muted[2] ? " active" : ""}`}
              onClick={() => handleMute(2)}
            >
              <i className="fas fa-volume-mute"></i>
            </button>
            <select
              name="hihat-select"
              id="hihat-select"
              value={hihatSound}
              onChange={handleChangeSound}
            >
              <option value="./sounds/hihat-acoustic01.wav">
                Hihat Acoustic
              </option>
              <option value="./sounds/hihat-808.wav">808 Hihat</option>
            </select>
          </div>
          <div className="hihat">
            {PADS.map((i) => (
              <div
                key={i}
                className={`pad hihat-pad b${i}${hihatPads[i] ? " active" : ""}`}
                style={{
                  animation: animatingPads.hihat[i]
                    ? "playTrack 0.3s alternate ease-in-out 2"
                    : "",
                }}
                onClick={() => togglePad("hihat", i)}
                onAnimationEnd={() => clearPadAnimation("hihat", i)}
              ></div>
            ))}
          </div>
        </div>

        <button
          className={`play${isPlaying ? " active" : ""}`}
          onClick={() => setIsPlaying((prev) => !prev)}
        >
          {isPlaying ? "Stop" : "Play"}
        </button>

        <div className="tempo">
          <input
            type="range"
            className="tempo-slider"
            max="300"
            min="20"
            value={tempoText}
            onChange={(e) => setTempoText(e.target.value)}
            onMouseUp={(e) => setBpm(e.target.value)}
            onTouchEnd={(e) => setBpm(e.target.value)}
            onKeyUp={(e) => setBpm(e.target.value)}
          />
          <p>
            Tempo: <span className="tempo-nr">{tempoText}</span>
          </p>
        </div>
      </div>

      <audio
        ref={kickAudioRef}
        className="kick-sound"
        src={kickSound}
      ></audio>
      <audio
        ref={snareAudioRef}
        className="snare-sound"
        src={snareSound}
      ></audio>
      <audio
        ref={hihatAudioRef}
        className="hihat-sound"
        src={hihatSound}
      ></audio>
    </>
  );
}

export default App;
