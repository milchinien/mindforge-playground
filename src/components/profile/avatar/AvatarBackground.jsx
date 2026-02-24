// ============= BACKGROUND =============
export default function renderBackground(bgStyle, uid) {
  const gradientBgs = {
    sunset: { stops: [['#ff6b35', 0], ['#4a1a6b', 100]], dir: 'y' },
    galaxy: null,
    fire: { stops: [['#ff8f00', 0], ['#e65100', 50], ['#b71c1c', 100]], dir: 'y-reverse' },
    ocean: { stops: [['#0077b6', 0], ['#023e8a', 50], ['#03045e', 100]], dir: 'y' },
    forest: { stops: [['#2d6a4f', 0], ['#1b4332', 100]], dir: 'y' },
    neon: { stops: [['#7b2ff7', 0], ['#2196F3', 50], ['#00e5ff', 100]], dir: 'x' },
    arctic: { stops: [['#e3f2fd', 0], ['#90caf9', 50], ['#42a5f5', 100]], dir: 'y' },
    cherry: { stops: [['#f8bbd0', 0], ['#e91e63', 60], ['#880e4f', 100]], dir: 'y' },
    candy: { stops: [['#f48fb1', 0], ['#ce93d8', 33], ['#90caf9', 66], ['#80deea', 100]], dir: 'x' },
    mindforge: { stops: [['#f97316', 0], ['#ea580c', 50], ['#9a3412', 100]], dir: 'y' },
  }
  const solidBgs = {
    gray: '#374151',
    blue: '#1e3a5f',
    purple: '#4a1a6b',
    green: '#1a4a2e',
    red: '#7f1d1d',
    pink: '#831843',
  }

  if (solidBgs[bgStyle]) {
    return <circle cx="100" cy="100" r="98" fill={solidBgs[bgStyle]} />
  }

  if (bgStyle === 'galaxy') {
    return (
      <>
        <defs>
          <radialGradient id={`bg-galaxy-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a0533" />
            <stop offset="50%" stopColor="#0d1b3e" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="98" fill={`url(#bg-galaxy-${uid})`} />
        <circle cx="55" cy="38" r="1" fill="white" opacity="0.8" />
        <circle cx="140" cy="55" r="1.5" fill="white" opacity="0.6" />
        <circle cx="35" cy="130" r="1" fill="#4FC3F7" opacity="0.6" />
        <circle cx="160" cy="140" r="1" fill="#9C27B0" opacity="0.8" />
        <circle cx="80" cy="165" r="0.8" fill="white" opacity="0.5" />
        <circle cx="120" cy="30" r="0.8" fill="#FFD700" opacity="0.6" />
      </>
    )
  }

  const cfg = gradientBgs[bgStyle]
  if (cfg) {
    const isReverse = cfg.dir.includes('reverse')
    const isX = cfg.dir.includes('x')
    return (
      <>
        <defs>
          <linearGradient id={`bg-${bgStyle}-${uid}`}
            x1={0} y1={isReverse ? 1 : 0} x2={isX ? 1 : 0} y2={isX ? 0 : (isReverse ? 0 : 1)}>
            {cfg.stops.map(([color, offset], i) => (
              <stop key={i} offset={`${offset}%`} stopColor={color} />
            ))}
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="98" fill={`url(#bg-${bgStyle}-${uid})`} />
      </>
    )
  }

  return <circle cx="100" cy="100" r="98" fill="#374151" />
}
