import Pad from "./Pad";

const PADS = Array.from({ length: 16 }, (_, i) => i);

function Track({
  title,
  trackName,
  trackIndex,
  options,
  pads,
  padLabels,
  selectedStep,
  onTogglePad,
  soundValue,
  onChangeSound,
  isMuted,
  onToggleMute,
  animatingPads,
  onClearAnimation,
  onCompose,
  isComposing,
}) {
  return (
    <div className={`${trackName}-track`}>
      <div className="controls">
        <div className="track-title-group">
          <h1>{title}</h1>
          {onCompose && (
            <button
              type="button"
              className={`compose-btn${isComposing ? " active" : ""}`}
              onClick={onCompose}
            >
              Compose
            </button>
          )}
        </div>
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
            isSelected={selectedStep === i}
            label={padLabels ? padLabels[i] : null}
            isAnimating={animatingPads[i]}
            onToggle={onTogglePad}
            onAnimationEnd={onClearAnimation}
          />
        ))}
      </div>
    </div>
  );
}

export default Track;
