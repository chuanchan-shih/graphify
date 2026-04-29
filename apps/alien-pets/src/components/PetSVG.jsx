import { motion } from 'framer-motion'
import { PETS_BY_ID } from '../data/pets.js'

// 大頭娃娃通用骨架；每隻星靈的差異只在頭頂裝飾
function HeadDecor({ id, color }) {
  switch (id) {
    case 'fire':
      return (
        <g transform="translate(100,28)">
          <path d="M0,-18 C8,-6 14,4 4,16 C-2,8 -10,8 -14,16 C-18,4 -10,-6 0,-18Z" fill={color} />
          <path d="M0,-8 C4,0 8,6 2,12 C-2,8 -6,8 -8,12 C-10,4 -4,-2 0,-8Z" fill="#FFD9B0" />
        </g>
      )
    case 'water':
      return (
        <g transform="translate(100,30)">
          <path d="M0,-22 C12,-8 14,6 0,16 C-14,6 -12,-8 0,-22Z" fill={color} />
          <circle cx="-3" cy="0" r="3" fill="#fff" opacity=".6" />
        </g>
      )
    case 'grass':
      return (
        <g transform="translate(100,28)">
          <ellipse cx="-12" cy="0" rx="10" ry="14" fill={color} transform="rotate(-30,-12,0)" />
          <ellipse cx="12" cy="0" rx="10" ry="14" fill={color} transform="rotate(30,12,0)" />
          <ellipse cx="0" cy="-6" rx="9" ry="14" fill={color} />
        </g>
      )
    case 'elec':
      return (
        <g transform="translate(100,26)">
          <path d="M-6,-22 L8,-6 L0,-4 L10,12 L-6,-2 L2,-4 Z" fill={color} stroke="#7a5a00" strokeWidth="1.5" strokeLinejoin="round" />
        </g>
      )
    case 'light':
      return (
        <g transform="translate(100,30)">
          <circle r="14" fill={color} />
          <circle r="9" fill="#fff" opacity=".5" />
          {[0, 60, 120, 180, 240, 300].map((d, i) => (
            <line
              key={i}
              x1="0"
              y1="-22"
              x2="0"
              y2="-16"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${d})`}
            />
          ))}
        </g>
      )
    case 'dark':
      return (
        <g transform="translate(100,30)">
          <path d="M-14,-2 L-10,-22 L-2,-6 L2,-6 L10,-22 L14,-2 Z" fill={color} />
        </g>
      )
    default:
      return null
  }
}

// 飾品：手腕圓環旁掛 emoji；裝在頭頂中央 / 左手 / 右手三槽
function AccessoryLayer({ ids = [] }) {
  // 簡化：用 emoji，分到 3 個位置
  const slots = [
    { x: 100, y: 20, fontSize: 22 }, // 頭頂
    { x: 50, y: 142, fontSize: 18 }, // 左手腕
    { x: 150, y: 142, fontSize: 18 }, // 右手腕
  ]
  return (
    <>
      {ids.slice(0, 3).map((acc, i) => (
        <text
          key={`${acc.id}-${i}`}
          x={slots[i].x}
          y={slots[i].y}
          fontSize={slots[i].fontSize}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {acc.emoji}
        </text>
      ))}
    </>
  )
}

export default function PetSVG({
  petId,
  emotion = 'idle', // idle | happy | sad | hungry
  size = 220,
  equippedAccessories = [],
  bobbing = true,
}) {
  const pet = PETS_BY_ID[petId]
  if (!pet) return null
  const { color, accent } = pet

  // 嘴形依情緒切換
  const mouthPath = {
    idle: 'M88,108 Q100,118 112,108',
    happy: 'M84,104 Q100,124 116,104',
    sad: 'M84,114 Q100,100 116,114',
    hungry: 'M90,112 Q100,102 110,112',
  }[emotion]

  // 眼瞼依情緒
  const eyeY = emotion === 'sad' ? 92 : 88
  const tearOpacity = emotion === 'sad' ? 1 : 0

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      animate={bobbing ? { y: [0, -6, 0] } : {}}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      style={{ display: 'block' }}
    >
      <defs>
        <radialGradient id={`grad-${petId}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
        <filter id={`shadow-${petId}`}>
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* 影子 */}
      <ellipse cx="100" cy="186" rx="42" ry="6" fill="#000" opacity="0.12" />

      {/* 身體（小） */}
      <g filter={`url(#shadow-${petId})`}>
        <ellipse cx="100" cy="150" rx="34" ry="28" fill={`url(#grad-${petId})`} />

        {/* 手 */}
        <g>
          <circle cx="62" cy="148" r="12" fill={color} />
          <circle cx="62" cy="148" r="6" fill="none" stroke="#fff" strokeWidth="2" />
          <circle cx="138" cy="148" r="12" fill={color} />
          <circle cx="138" cy="148" r="6" fill="none" stroke="#fff" strokeWidth="2" />
        </g>

        {/* 頭（大） */}
        <g>
          <circle cx="100" cy="86" r="56" fill={`url(#grad-${petId})`} />

          {/* 眼旁屬性條紋 */}
          <g stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.85">
            <line x1="62" y1="76" x2="56" y2="68" />
            <line x1="62" y1="84" x2="54" y2="80" />
            <line x1="62" y1="92" x2="56" y2="96" />
            <line x1="138" y1="76" x2="144" y2="68" />
            <line x1="138" y1="84" x2="146" y2="80" />
            <line x1="138" y1="92" x2="144" y2="96" />
          </g>

          {/* 眼睛 */}
          <g>
            <ellipse cx="82" cy={eyeY} rx="7" ry={emotion === 'sad' ? 4 : 8} fill="#2C1810" />
            <ellipse cx="118" cy={eyeY} rx="7" ry={emotion === 'sad' ? 4 : 8} fill="#2C1810" />
            <circle cx="84" cy={eyeY - 2} r="2.2" fill="#fff" />
            <circle cx="120" cy={eyeY - 2} r="2.2" fill="#fff" />
          </g>

          {/* 眼淚 */}
          <g opacity={tearOpacity}>
            <path d="M80,98 Q78,108 82,110 Q86,108 84,98 Z" fill="#7BC9E5" />
          </g>

          {/* 腮紅 */}
          <ellipse cx="74" cy="102" rx="6" ry="3" fill="#FF9A9A" opacity="0.55" />
          <ellipse cx="126" cy="102" rx="6" ry="3" fill="#FF9A9A" opacity="0.55" />

          {/* 嘴 */}
          <path d={mouthPath} stroke="#2C1810" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* 頭頂屬性裝飾 */}
          <HeadDecor id={petId} color={color} />
        </g>
      </g>

      {/* 飾品 */}
      <AccessoryLayer ids={equippedAccessories} />
    </motion.svg>
  )
}
