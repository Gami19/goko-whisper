export function MemorialSilhouette() {
  return (
    <div className="memorial-silhouette memorial-silhouette--visible">
      <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="50" width="140" height="60" />
        <polygon points="100,10 170,50 30,50" />
        <rect x="55" y="70" width="20" height="40" />
        <rect x="125" y="70" width="20" height="40" />
        <rect x="85" y="65" width="30" height="45" />
        <line x1="100" y1="10" x2="100" y2="50" />
        <line x1="60" y1="50" x2="60" y2="30" />
        <line x1="140" y1="50" x2="140" y2="30" />
      </svg>
    </div>
  );
}
