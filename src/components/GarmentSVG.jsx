// Recreates the original garmentSVG() string-builder as real JSX shapes,
// so React can render and manage the SVG properly instead of injecting
// an HTML string.
const SHAPES = {
  tee: (color) => (
    <>
      <rect x="35" y="10" width="30" height="22" fill={color} />
      <rect x="10" y="24" width="80" height="20" fill={color} />
      <rect x="30" y="30" width="40" height="60" fill={color} />
    </>
  ),
  shirt: (color) => (
    <>
      <rect x="34" y="8" width="32" height="16" fill={color} />
      <rect x="12" y="20" width="76" height="14" fill={color} />
      <rect x="26" y="26" width="48" height="64" fill={color} />
      <rect x="46" y="26" width="8" height="64" fill="none" stroke={color} strokeWidth="1.4" opacity="0.5" />
    </>
  ),
  polo: (color) => (
    <>
      <rect x="36" y="9" width="28" height="14" fill={color} />
      <rect x="14" y="19" width="72" height="14" fill={color} />
      <rect x="28" y="25" width="44" height="65" fill={color} />
      <rect x="46" y="25" width="8" height="24" fill="none" stroke={color} strokeWidth="1.4" opacity="0.5" />
    </>
  ),
  hoodie: (color) => (
    <>
      <circle cx="50" cy="14" r="15" fill="none" stroke={color} strokeWidth="6" />
      <rect x="10" y="26" width="80" height="18" fill={color} />
      <rect x="26" y="34" width="48" height="56" fill={color} />
    </>
  ),
  trouser: (color) => (
    <>
      <rect x="30" y="8" width="40" height="18" fill={color} />
      <rect x="30" y="24" width="17" height="66" fill={color} />
      <rect x="53" y="24" width="17" height="66" fill={color} />
    </>
  ),
  jacket: (color) => (
    <>
      <rect x="30" y="8" width="40" height="14" fill={color} />
      <rect x="10" y="18" width="80" height="16" fill={color} />
      <rect x="22" y="24" width="56" height="66" fill={color} />
      <rect x="46" y="24" width="8" height="66" fill="none" stroke={color} strokeWidth="1.4" opacity="0.5" />
    </>
  ),
  crew: (color) => (
    <>
      <rect x="36" y="10" width="28" height="14" fill="none" stroke={color} strokeWidth="6" />
      <rect x="12" y="22" width="76" height="16" fill={color} />
      <rect x="28" y="30" width="44" height="60" fill={color} />
    </>
  ),
}

function GarmentSVG({ shape, color }) {
  const renderShape = SHAPES[shape] || SHAPES.tee
  return (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true" focusable="false">
      {renderShape(color)}
    </svg>
  )
}

export default GarmentSVG