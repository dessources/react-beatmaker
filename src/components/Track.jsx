import Pad from "./Pad";

const PADS = [0, 1, 2, 3, 4, 5, 6, 7];

function Track({
  title,
  trackName,
  trackIndex,
  options,
  pads,
  onTogglePad,
  // TODO (Step 2): Accept soundValue, onChangeSound, isMuted, onToggleMute
  // TODO (Step 3): Accept animatingPads, onClearAnimation
}) {
  return (
    <div className={`${trackName}-track`}>
      <div className="controls">
        <h1>{title}</h1>
        {/* TODO (Step 2): Add `active` class when isMuted is true, and wire onClick to onToggleMute(trackIndex) */}
        <button data-track={trackIndex} className={`mute ${trackName}-volume`}>
          <i className="fas fa-volume-mute"></i>
        </button>
        {/* TODO (Step 2): Make <select> a controlled input with value={soundValue} and onChange={onChangeSound} */}
        <select name={`${trackName}-select`} id={`${trackName}-select`}>
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
