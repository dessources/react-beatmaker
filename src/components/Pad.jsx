function Pad({
  trackName,
  index,
  isActive,
  isSelected,
  label,
  isAnimating,
  onToggle,
  onAnimationEnd,
}) {
  return (
    <div
      className={`pad ${trackName}-pad b${index}${isActive ? " active" : ""}${
        isSelected ? " selected" : ""
      }`}
      style={{
        animation: isAnimating ? "playTrack 0.3s alternate ease-in-out 2" : "",
      }}
      onClick={() => onToggle(trackName, index)}
      onAnimationEnd={() => onAnimationEnd && onAnimationEnd(trackName, index)}
    >
      {label && <span className="pad-note-label">{label}</span>}
    </div>
  );
}

export default Pad;
