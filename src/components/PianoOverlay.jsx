const OCTAVE_3 = [
  { note: "C3", freq: 130.81, isBlack: false },
  { note: "C#3", freq: 138.59, isBlack: true },
  { note: "D3", freq: 146.83, isBlack: false },
  { note: "D#3", freq: 155.56, isBlack: true },
  { note: "E3", freq: 164.81, isBlack: false },
  { note: "F3", freq: 174.61, isBlack: false },
  { note: "F#3", freq: 185.0, isBlack: true },
  { note: "G3", freq: 196.0, isBlack: false },
  { note: "G#3", freq: 207.65, isBlack: true },
  { note: "A3", freq: 220.0, isBlack: false },
  { note: "A#3", freq: 233.08, isBlack: true },
  { note: "B3", freq: 246.94, isBlack: false },
];

const OCTAVE_4 = [
  { note: "C4", freq: 261.63, isBlack: false },
  { note: "C#4", freq: 277.18, isBlack: true },
  { note: "D4", freq: 293.66, isBlack: false },
  { note: "D#4", freq: 311.13, isBlack: true },
  { note: "E4", freq: 329.63, isBlack: false },
  { note: "F4", freq: 349.23, isBlack: false },
  { note: "F#4", freq: 369.99, isBlack: true },
  { note: "G4", freq: 392.0, isBlack: false },
  { note: "G#4", freq: 415.3, isBlack: true },
  { note: "A4", freq: 440.0, isBlack: false },
  { note: "A#4", freq: 466.16, isBlack: true },
  { note: "B4", freq: 493.88, isBlack: false },
  { note: "C5", freq: 523.25, isBlack: false },
];

export const PIANO_KEYS = [...OCTAVE_3, ...OCTAVE_4];

export const NOTE_FREQ_MAP = Object.fromEntries(
  PIANO_KEYS.map((k) => [k.note, k.freq])
);

function PianoOverlay({
  selectedStep,
  currentNote,
  isStepActive,
  onSelectNote,
  onClearStep,
  onClose,
}) {
  return (
    <div className="piano-overlay">
      <div className="piano-header">
        <div className="piano-instructions">
          <span className="piano-badge">
            {selectedStep !== null
              ? `Editing Synth Step ${selectedStep + 1}`
              : "Click a Synth step above to select it"}
          </span>
          {selectedStep !== null && isStepActive && currentNote && (
            <span className="piano-current-note">
              Assigned Pitch: <strong>{currentNote}</strong>
            </span>
          )}
          {selectedStep !== null && isStepActive && (
            <button
              type="button"
              className="piano-clear-btn"
              onClick={onClearStep}
            >
              Clear Step
            </button>
          )}
        </div>
        <button
          type="button"
          className="piano-close"
          onClick={onClose}
          aria-label="Close piano keyboard"
          title="Close piano keyboard"
        >
          &#10005;
        </button>
      </div>

      <div className="piano-keys">
        {PIANO_KEYS.map((keyObj) => {
          const isAssigned =
            selectedStep !== null &&
            isStepActive &&
            currentNote === keyObj.note;
          return (
            <button
              key={keyObj.note}
              type="button"
              className={`piano-key ${
                keyObj.isBlack ? "black-key" : "white-key"
              }${isAssigned ? " assigned" : ""}`}
              onClick={() => onSelectNote(keyObj.note)}
            >
              <span className="key-label">{keyObj.note}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PianoOverlay;
