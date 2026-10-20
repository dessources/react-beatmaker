import { useState, useRef, useEffect } from "react";
import Track from "./components/Track";

const KICK_OPTIONS = [
  { value: "./sounds/kick-classic.wav", label: "Classic Kick" },
  { value: "./sounds/kick-808.wav", label: "808 Kick" },
  { value: "./sounds/kick-heavy.wav", label: "Kick Heavy" },
  { value: "./sounds/kick-softy.wav", label: "Kick Softy" },
];

const SNARE_OPTIONS = [
  { value: "./sounds/snare-acoustic01.wav", label: "Classic Snare" },
  { value: "./sounds/snare-808.wav", label: "808 Snare" },
  { value: "./sounds/snare-vinyl02.wav", label: "Snare Vinyl" },
];

const HIHAT_OPTIONS = [
  { value: "./sounds/hihat-acoustic01.wav", label: "Hihat Acoustic" },
  { value: "./sounds/hihat-808.wav", label: "808 Hihat" },
];

function App() {
  const [kickPads, setKickPads] = useState(() => Array(8).fill(false));
  const [snarePads, setSnarePads] = useState(() => Array(8).fill(false));
  const [hihatPads, setHihatPads] = useState(() => Array(8).fill(false));

  const [kickSound, setKickSound] = useState("./sounds/kick-classic.wav");
  const [snareSound, setSnareSound] = useState("./sounds/snare-acoustic01.wav");
  const [hihatSound, setHihatSound] = useState("./sounds/hihat-acoustic01.wav");

  const [muted, setMuted] = useState([false, false, false]);
  // TODO (Step 4): Add `bpm` state (150) and `tempoText` state (150) for the tempo slider
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

    // TODO (Step 4): Replace hardcoded `150` with `bpm` state and include `bpm` in the dependency array
    const interval = (60 / 150) * 1000;
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
  }, [isPlaying]);

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
        <Track
          title="Kick"
          trackName="kick"
          trackIndex={0}
          options={KICK_OPTIONS}
          pads={kickPads}
          onTogglePad={togglePad}
          soundValue={kickSound}
          onChangeSound={handleChangeSound}
          isMuted={muted[0]}
          onToggleMute={handleMute}
          animatingPads={animatingPads.kick}
          onClearAnimation={clearPadAnimation}
        />

        <Track
          title="Snare"
          trackName="snare"
          trackIndex={1}
          options={SNARE_OPTIONS}
          pads={snarePads}
          onTogglePad={togglePad}
          soundValue={snareSound}
          onChangeSound={handleChangeSound}
          isMuted={muted[1]}
          onToggleMute={handleMute}
          animatingPads={animatingPads.snare}
          onClearAnimation={clearPadAnimation}
        />

        <Track
          title="Hihat"
          trackName="hihat"
          trackIndex={2}
          options={HIHAT_OPTIONS}
          pads={hihatPads}
          onTogglePad={togglePad}
          soundValue={hihatSound}
          onChangeSound={handleChangeSound}
          isMuted={muted[2]}
          onToggleMute={handleMute}
          animatingPads={animatingPads.hihat}
          onClearAnimation={clearPadAnimation}
        />

        <button
          className={`play${isPlaying ? " active" : ""}`}
          onClick={() => setIsPlaying((prev) => !prev)}
        >
          {isPlaying ? "Stop" : "Play"}
        </button>

        {/* TODO (Step 4): Wire up the range input with value={tempoText}, onChange to update tempoText, and onMouseUp/onTouchEnd/onKeyUp to update bpm */}
        <div className="tempo">
          <input
            type="range"
            className="tempo-slider"
            max="300"
            min="20"
            defaultValue="150"
          />
          <p>
            Tempo: <span className="tempo-nr">150</span>
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
