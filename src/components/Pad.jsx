function Pad({
  trackName,
  index,
  isActive,
  isAnimating,
  onToggle,
  onAnimationEnd,
}) {
  return (
    <div
      className={`pad ${trackName}-pad b${index}${isActive ? " active" : ""}`}
      style={{
        animation: isAnimating ? "playTrack 0.3s alternate ease-in-out 2" : "",
      }}
      onClick={() => onToggle(trackName, index)}
      onAnimationEnd={() => onAnimationEnd && onAnimationEnd(trackName, index)}
    ></div>
  );
}

export default Pad;
