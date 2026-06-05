export function MemorialSilhouette() {
  return (
    <div className="memorial-silhouette memorial-silhouette--visible">
      <svg viewBox="0 0 240 140" xmlns="http://www.w3.org/2000/svg">
        {/* 屋根・ペディメント */}
        <polygon points="120,8 210,52 30,52" />
        <line x1="120" y1="8" x2="120" y2="52" />

        {/* 外壁 */}
        <rect x="30" y="52" width="180" height="78" />

        {/* 下見板張り（縦縞） */}
        <line x1="50" y1="52" x2="50" y2="130" />
        <line x1="70" y1="52" x2="70" y2="130" />
        <line x1="90" y1="52" x2="90" y2="130" />
        <line x1="110" y1="52" x2="110" y2="130" />
        <line x1="130" y1="52" x2="130" y2="130" />
        <line x1="150" y1="52" x2="150" y2="130" />
        <line x1="170" y1="52" x2="170" y2="130" />
        <line x1="190" y1="52" x2="190" y2="130" />

        {/* 二階フロアライン */}
        <line x1="30" y1="82" x2="210" y2="82" />

        {/* アーチ型窓（二階・強調） */}
        <path d="M 58 58 L 58 78 Q 73 88 88 78 L 88 58 Z" />
        <path d="M 152 58 L 152 78 Q 167 88 182 78 L 182 58 Z" />

        {/* アーチ型窓（一階） */}
        <path d="M 58 90 L 58 108 Q 73 118 88 108 L 88 90 Z" />
        <path d="M 152 90 L 152 108 Q 167 118 182 108 L 182 90 Z" />

        {/* 正面入口 */}
        <rect x="105" y="95" width="30" height="35" />
        <path d="M 105 95 L 120 82 L 135 95" />
      </svg>
    </div>
  );
}
