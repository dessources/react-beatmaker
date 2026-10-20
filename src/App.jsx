import { useState } from "react";
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

  // TODO (Step 2): Add state for selected sounds (kickSound, snareSound, hihatSound)
  // TODO (Step 2): Add state for muted tracks (`[false, false, false]`)
  // TODO (Step 2): Create `useRef`s for the three <audio> elements (kickAudioRef, snareAudioRef, hihatAudioRef)

  const togglePad = (track, index) => {
    if (track === "kick") {
      setKickPads((prev) => prev.map((val, i) => (i === index ? !val : val)));
    } else if (track === "snare") {
      setSnarePads((prev) => prev.map((val, i) => (i === index ? !val : val)));
    } else if (track === "hihat") {
      setHihatPads((prev) => prev.map((val, i) => (i === index ? !val : val)));
    }
  };

  // TODO (Step 2): Write `handleMute(trackIndex)` to toggle track mute state and set `audioRef.current.volume` (0 or 1)
  // TODO (Step 2): Write `handleChangeSound(e)` to update the selected sound state when a <select> changes

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
        />

        <Track
          title="Snare"
          trackName="snare"
          trackIndex={1}
          options={SNARE_OPTIONS}
          pads={snarePads}
          onTogglePad={togglePad}
        />

        <Track
          title="Hihat"
          trackName="hihat"
          trackIndex={2}
          options={HIHAT_OPTIONS}
          pads={hihatPads}
          onTogglePad={togglePad}
        />

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

      {/* TODO (Step 2): Attach ref={...} and dynamic src={...} to each <audio> element */}
      <audio className="kick-sound" src="./sounds/kick-classic.wav"></audio>
      <audio
        className="snare-sound"
        src="./sounds/snare-acoustic01.wav"
      ></audio>
      <audio
        className="hihat-sound"
        src="./sounds/hihat-acoustic01.wav"
      ></audio>
    </>
  );
}

export default App;
