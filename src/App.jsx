import { useState, useRef } from "react";
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

  // TODO (Step 3): Add `isPlaying` state (boolean) and `animatingPads` state ({ kick, snare, hihat } arrays)

  const kickAudioRef = useRef(null);
  const snareAudioRef = useRef(null);
  const hihatAudioRef = useRef(null);

  // TODO (Step 3): Add `indexRef = useRef(0)` to track the current 0..7 step across interval ticks
  // TODO (Step 3): Add a `useEffect` that runs a `setInterval` when `isPlaying` is true:
  //   - Calculate `step = indexRef.current % 8`
  //   - Trigger the `playTrack` animation for `step` on all three tracks
  //   - If a track's pad at `step` is active, reset `audioRef.current.currentTime = 0` and call `.play()`
  //   - Increment `indexRef.current`

  const togglePad = (track, index) => {
    if (track === "kick") {
      setKickPads((prev) => prev.map((val, i) => (i === index ? !val : val)));
    } else if (track === "snare") {
      setSnarePads((prev) => prev.map((val, i) => (i === index ? !val : val)));
    } else if (track === "hihat") {
      setHihatPads((prev) => prev.map((val, i) => (i === index ? !val : val)));
    }
  };

  // TODO (Step 3): Write `clearPadAnimation(track, index)` to reset animation state when `onAnimationEnd` fires

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
        />

        {/* TODO (Step 3): Toggle `isPlaying` onClick, add `active` class when playing, and switch text between "Stop" and "Play" */}
        <button className="play">Play</button>

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
