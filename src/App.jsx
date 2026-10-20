// Welcome to the React Beatmaker Workshop!
//
// In this starter step, the entire UI is rendered as static JSX.
//
// TODO (Step 1):
// 1. Complete `src/components/Pad.jsx` and `src/components/Track.jsx`.
// 2. Use `useState` to manage the 8 pads for each track (kick, snare, hihat).
// 3. Write a `togglePad(track, index)` function to toggle a pad's active state on click.
// 4. Replace the hardcoded track markup below with three `<Track />` components!

const PADS = [0, 1, 2, 3, 4, 5, 6, 7];

function App() {
  return (
    <>
      <div className="sequencer">
        {/* TODO (Step 1): Replace these three track divs with reusable <Track /> components */}
        <div className="kick-track">
          <div className="controls">
            <h1>Kick</h1>
            <button data-track="0" className="mute kick-volume">
              <i className="fas fa-volume-mute"></i>
            </button>
            <select name="kick-select" id="kick-select">
              <option value="./sounds/kick-classic.wav">Classic Kick</option>
              <option value="./sounds/kick-808.wav">808 Kick</option>
              <option value="./sounds/kick-heavy.wav">Kick Heavy</option>
              <option value="./sounds/kick-softy.wav">Kick Softy</option>
            </select>
          </div>
          <div className="kick">
            {PADS.map((i) => (
              <div key={i} className={`pad kick-pad b${i}`}></div>
            ))}
          </div>
        </div>

        <div className="snare-track">
          <div className="controls">
            <h1>Snare</h1>
            <button data-track="1" className="mute snare-volume">
              <i className="fas fa-volume-mute"></i>
            </button>
            <select name="snare-select" id="snare-select">
              <option value="./sounds/snare-acoustic01.wav">
                Classic Snare
              </option>
              <option value="./sounds/snare-808.wav">808 Snare</option>
              <option value="./sounds/snare-vinyl02.wav">Snare Vinyl</option>
            </select>
          </div>
          <div className="snare">
            {PADS.map((i) => (
              <div key={i} className={`pad snare-pad b${i}`}></div>
            ))}
          </div>
        </div>

        <div className="hihat-track">
          <div className="controls">
            <h1>Hihat</h1>
            <button data-track="2" className="mute hihat-volume">
              <i className="fas fa-volume-mute"></i>
            </button>
            <select name="hihat-select" id="hihat-select">
              <option value="./sounds/hihat-acoustic01.wav">
                Hihat Acoustic
              </option>
              <option value="./sounds/hihat-808.wav">808 Hihat</option>
            </select>
          </div>
          <div className="hihat">
            {PADS.map((i) => (
              <div key={i} className={`pad hihat-pad b${i}`}></div>
            ))}
          </div>
        </div>

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
