import Pad from "./Pad";

const PADS = [0, 1, 2, 3, 4, 5, 6, 7];

function Track({
  title,
  trackName,
  trackIndex,
  options,
  pads,
  onTogglePad,
  soundValue,
  onChangeSound,
  isMuted,
  onToggleMute,
  // TODO (Step 3): Accept animatingPads and onClearAnimation
}) {
  return (
    <div className={`${trackName}-track`}>
      <div className="controls">
        <h1>{title}</h1>
        <button
          data-track={trackIndex}
          className={`mute ${trackName}-volume${isMuted ? " active" : ""}`}
          onClick={() => onToggleMute(trackIndex)}
        >
          <i className="fas fa-volume-mute"></i>
        </button>
        <select
          name={`${trackName}-select`}
          id={`${trackName}-select`}
          value={soundValue}
          onChange={onChangeSound}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className={trackName}>
        {PADS.map((i) => (
          <Pad
            key={i}
            trackName={trackName}
            index={i}
            isActive={pads[i]}
            onToggle={onTogglePad}
            // TODO (Step 3): Pass isAnimating={animatingPads[i]} and onAnimationEnd={onClearAnimation}
          />
        ))}
      </div>
    </div>
  );
}

export default Track;
