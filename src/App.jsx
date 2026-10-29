import { useState, useRef, useEffect, useCallback } from "react";
import Track from "./components/Track";
import PianoOverlay, { NOTE_FREQ_MAP } from "./components/PianoOverlay";

const NUM_STEPS = 16;

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

const SYNTH_OPTIONS = [
  { value: "sawtooth", label: "Sawtooth Lead" },
  { value: "square", label: "Retro Square" },
  { value: "triangle", label: "Warm Triangle" },
  { value: "sine", label: "Pure Sine" },
];

function App() {
  const [kickPads, setKickPads] = useState(() => Array(NUM_STEPS).fill(false));
  const [snarePads, setSnarePads] = useState(() =>
    Array(NUM_STEPS).fill(false)
  );
  const [hihatPads, setHihatPads] = useState(() =>
    Array(NUM_STEPS).fill(false)
  );
  const [synthPads, setSynthPads] = useState(() =>
    Array(NUM_STEPS).fill(false)
  );
  const [synthNotes, setSynthNotes] = useState(() =>
    Array(NUM_STEPS).fill("C4")
  );

  const [kickSound, setKickSound] = useState("./sounds/kick-classic.wav");
  const [snareSound, setSnareSound] = useState("./sounds/snare-acoustic01.wav");
  const [hihatSound, setHihatSound] = useState("./sounds/hihat-acoustic01.wav");
  const [synthSound, setSynthSound] = useState("sawtooth");

  const [muted, setMuted] = useState([false, false, false, false]);
  const [bpm, setBpm] = useState(150);
  const [tempoText, setTempoText] = useState(150);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isComposing, setIsComposing] = useState(false);
  const [selectedSynthStep, setSelectedSynthStep] = useState(0);

  const [animatingPads, setAnimatingPads] = useState({
    kick: Array(NUM_STEPS).fill(false),
    snare: Array(NUM_STEPS).fill(false),
    hihat: Array(NUM_STEPS).fill(false),
    synth: Array(NUM_STEPS).fill(false),
  });

  const kickAudioRef = useRef(null);
  const snareAudioRef = useRef(null);
  const hihatAudioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const indexRef = useRef(0);

  const playSynthTone = useCallback((note, waveform, isSynthMuted) => {
    if (isSynthMuted) return;
    const freq = NOTE_FREQ_MAP[note] || 261.63;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioCtx();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = waveform || "sawtooth";
    osc.frequency.setValueAtTime(freq, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2200, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.25);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }, []);

  const stateRef = useRef({
    kickPads,
    snarePads,
    hihatPads,
    synthPads,
    synthNotes,
    synthSound,
    muted,
  });

  useEffect(() => {
    stateRef.current = {
      kickPads,
      snarePads,
      hihatPads,
      synthPads,
      synthNotes,
      synthSound,
      muted,
    };
  }, [kickPads, snarePads, hihatPads, synthPads, synthNotes, synthSound, muted]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = (60 / bpm) * 1000;
    const timer = setInterval(() => {
      const step = indexRef.current % NUM_STEPS;
      const {
        kickPads: kp,
        snarePads: sp,
        hihatPads: hp,
        synthPads: syp,
        synthNotes: syn,
        synthSound: sys,
        muted: m,
      } = stateRef.current;

      setAnimatingPads((prev) => {
        const kick = [...prev.kick];
        const snare = [...prev.snare];
        const hihat = [...prev.hihat];
        const synth = [...prev.synth];
        kick[step] = true;
        snare[step] = true;
        hihat[step] = true;
        synth[step] = true;
        return { kick, snare, hihat, synth };
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
      if (syp[step]) {
        playSynthTone(syn[step], sys, m[3]);
      }

      indexRef.current += 1;
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, bpm, playSynthTone]);

  const togglePad = (track, index) => {
    if (track === "kick") {
      setKickPads((prev) => prev.map((val, i) => (i === index ? !val : val)));
    } else if (track === "snare") {
      setSnarePads((prev) => prev.map((val, i) => (i === index ? !val : val)));
    } else if (track === "hihat") {
      setHihatPads((prev) => prev.map((val, i) => (i === index ? !val : val)));
    } else if (track === "synth") {
      if (isComposing) {
        setSelectedSynthStep(index);
      } else {
        setSynthPads((prev) =>
          prev.map((val, i) => (i === index ? !val : val))
        );
      }
    }
  };

  const handleOpenCompose = () => {
    setIsPlaying(false);
    setIsComposing(true);
    if (selectedSynthStep === null) {
      setSelectedSynthStep(0);
    }
  };

  const handleCloseCompose = () => {
    setIsComposing(false);
  };

  const handleSelectPianoNote = (note) => {
    const targetStep = selectedSynthStep !== null ? selectedSynthStep : 0;
    if (selectedSynthStep === null) {
      setSelectedSynthStep(0);
    }
    setSynthNotes((prev) =>
      prev.map((val, i) => (i === targetStep ? note : val))
    );
    setSynthPads((prev) =>
      prev.map((val, i) => (i === targetStep ? true : val))
    );
    playSynthTone(note, synthSound, false);
  };

  const handleClearSynthStep = () => {
    if (selectedSynthStep === null) return;
    setSynthPads((prev) =>
      prev.map((val, i) => (i === selectedSynthStep ? false : val))
    );
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
    } else if (name === "synth-select") {
      setSynthSound(value);
    }
  };

  const synthPadLabels = synthPads.map((isActive, idx) =>
    isActive ? synthNotes[idx] : ""
  );

  return (
    <>
      <div className={`sequencer${isComposing ? " composing-open" : ""}`}>
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

        <Track
          title="Synth"
          trackName="synth"
          trackIndex={3}
          options={SYNTH_OPTIONS}
          pads={synthPads}
          padLabels={synthPadLabels}
          selectedStep={isComposing ? selectedSynthStep : null}
          onTogglePad={togglePad}
          soundValue={synthSound}
          onChangeSound={handleChangeSound}
          isMuted={muted[3]}
          onToggleMute={handleMute}
          animatingPads={animatingPads.synth}
          onClearAnimation={clearPadAnimation}
          onCompose={handleOpenCompose}
          isComposing={isComposing}
        />

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

      {isComposing && (
        <PianoOverlay
          selectedStep={selectedSynthStep}
          currentNote={
            selectedSynthStep !== null ? synthNotes[selectedSynthStep] : null
          }
          isStepActive={
            selectedSynthStep !== null ? synthPads[selectedSynthStep] : false
          }
          onSelectNote={handleSelectPianoNote}
          onClearStep={handleClearSynthStep}
          onClose={handleCloseCompose}
        />
      )}

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
