import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { adjustColor, BODY_CONFIGS } from './avatar/avatarUtils'

// ============= HELPER =============
function hexToVec3(hex) {
  if (!hex || hex.charAt(0) !== '#') hex = '#F5D6B8'
  const num = parseInt(hex.slice(1), 16)
  return new THREE.Color(num)
}

// ============= HEAD =============
function Head3D({ skinColor }) {
  const color = hexToVec3(skinColor)
  const skinLight = hexToVec3(adjustColor(skinColor, 15))
  const cheekColor = new THREE.Color('#f4a0a0')
  return (
    <group position={[0, 1.6, 0]}>
      {/* Main head - slightly oval for friendly look */}
      <mesh scale={[1, 1.05, 0.95]}>
        <sphereGeometry args={[0.55, 48, 48]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.55}
          metalness={0.02}
          clearcoat={0.05}
          clearcoatRoughness={0.8}
          sheen={0.3}
          sheenColor={skinLight}
        />
      </mesh>
      {/* Left ear */}
      <mesh position={[-0.52, -0.05, 0]} scale={[0.7, 1, 0.8]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshPhysicalMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Right ear */}
      <mesh position={[0.52, -0.05, 0]} scale={[0.7, 1, 0.8]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshPhysicalMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Inner ear shadow */}
      <mesh position={[-0.53, -0.05, 0.02]} scale={[0.4, 0.7, 0.5]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={hexToVec3(adjustColor(skinColor, -25))} roughness={0.8} />
      </mesh>
      <mesh position={[0.53, -0.05, 0.02]} scale={[0.4, 0.7, 0.5]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={hexToVec3(adjustColor(skinColor, -25))} roughness={0.8} />
      </mesh>
      {/* Subtle cheek blush */}
      <mesh position={[-0.28, -0.12, 0.42]} rotation={[0, 0.3, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={cheekColor} transparent opacity={0.1} roughness={1} depthWrite={false} />
      </mesh>
      <mesh position={[0.28, -0.12, 0.42]} rotation={[0, -0.3, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={cheekColor} transparent opacity={0.1} roughness={1} depthWrite={false} />
      </mesh>
      {/* Chin definition */}
      <mesh position={[0, -0.42, 0.22]} scale={[0.6, 0.4, 0.5]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshPhysicalMaterial color={color} roughness={0.55} transparent opacity={0.6} depthWrite={false} />
      </mesh>
    </group>
  )
}

// ============= EYES =============
function Eyes3D({ eyeType, eyeColor, animated }) {
  const iris = hexToVec3(eyeColor)
  const leftRef = useRef()
  const rightRef = useRef()

  useFrame(({ clock }) => {
    if (!animated) return
    const t = clock.getElapsedTime()
    // Blink every ~4 seconds
    const blinkPhase = t % 4
    const blinkScale = blinkPhase < 0.15 ? Math.cos(blinkPhase / 0.15 * Math.PI) * 0.8 + 0.2 : 1
    if (leftRef.current) leftRef.current.scale.y = blinkScale
    if (rightRef.current) rightRef.current.scale.y = blinkScale
  })

  const eyeShape = useMemo(() => {
    switch (eyeType) {
      case 'round': return { sx: 0.1, sy: 0.1, irisR: 0.06 }
      case 'almond': return { sx: 0.12, sy: 0.075, irisR: 0.055 }
      case 'sleepy': return { sx: 0.11, sy: 0.06, irisR: 0.05 }
      case 'cat': return { sx: 0.11, sy: 0.075, irisR: 0.04 }
      case 'wide': return { sx: 0.1, sy: 0.12, irisR: 0.065 }
      default: return { sx: 0.1, sy: 0.1, irisR: 0.06 }
    }
  }, [eyeType])

  const irisDark = hexToVec3(adjustColor(eyeColor, -40))

  const EyeBall = ({ posX, ref: eyeRef }) => (
    <group position={[posX, 1.62, 0.44]} ref={eyeRef}>
      {/* Sclera (white) with subtle glossy surface */}
      <mesh>
        <sphereGeometry args={[eyeShape.sx, 24, 24]} />
        <meshPhysicalMaterial color="#f8f8f8" roughness={0.15} clearcoat={0.4} clearcoatRoughness={0.2} />
      </mesh>
      {/* Iris - outer ring */}
      <mesh position={[0, 0, eyeShape.sx * 0.45]}>
        <sphereGeometry args={[eyeShape.irisR, 20, 20]} />
        <meshPhysicalMaterial color={iris} roughness={0.3} metalness={0.05} clearcoat={0.3} />
      </mesh>
      {/* Iris - inner ring (darker) */}
      <mesh position={[0, 0, eyeShape.sx * 0.55]}>
        <sphereGeometry args={[eyeShape.irisR * 0.7, 16, 16]} />
        <meshStandardMaterial color={irisDark} roughness={0.4} />
      </mesh>
      {/* Pupil */}
      <mesh position={[0, 0, eyeShape.sx * 0.65]}>
        <sphereGeometry args={[eyeShape.irisR * 0.45, 12, 12]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.1} />
      </mesh>
      {/* Primary highlight */}
      <mesh position={[-0.02, 0.025, eyeShape.sx * 0.88]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.8} roughness={0} />
      </mesh>
      {/* Secondary highlight (smaller) */}
      <mesh position={[0.015, -0.015, eyeShape.sx * 0.85]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.4} roughness={0} transparent opacity={0.6} />
      </mesh>
    </group>
  )

  return (
    <>
      <EyeBall posX={-0.18} ref={leftRef} />
      <EyeBall posX={0.18} ref={rightRef} />
    </>
  )
}

// ============= EYEBROWS =============
function Eyebrows3D({ type }) {
  if (type === 'none') return null

  const getProps = () => {
    switch (type) {
      case 'thick': return { scaleY: 0.04, scaleX: 0.15, color: '#444' }
      case 'arched': return { scaleY: 0.025, scaleX: 0.14, color: '#666', rotation: 0.15 }
      case 'angry': return { scaleY: 0.03, scaleX: 0.14, color: '#555', rotation: -0.15 }
      case 'thin': return { scaleY: 0.015, scaleX: 0.13, color: '#777' }
      default: return { scaleY: 0.025, scaleX: 0.14, color: '#666' }
    }
  }

  const { scaleY, scaleX, color, rotation = 0 } = getProps()
  const browColor = new THREE.Color(color)

  return (
    <>
      <mesh position={[-0.18, 1.75, 0.46]} rotation={[0, 0, rotation]}>
        <boxGeometry args={[scaleX, scaleY, 0.02]} />
        <meshStandardMaterial color={browColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.18, 1.75, 0.46]} rotation={[0, 0, -rotation]}>
        <boxGeometry args={[scaleX, scaleY, 0.02]} />
        <meshStandardMaterial color={browColor} roughness={0.8} />
      </mesh>
    </>
  )
}

// ============= NOSE =============
function Nose3D({ skinColor }) {
  const color = hexToVec3(skinColor)
  const shadow = hexToVec3(adjustColor(skinColor, -15))
  return (
    <group position={[0, 1.52, 0.5]}>
      {/* Nose bridge */}
      <mesh position={[0, 0.04, 0]} scale={[0.6, 1, 0.7]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshPhysicalMaterial color={color} roughness={0.55} transparent opacity={0.5} depthWrite={false} />
      </mesh>
      {/* Nose tip */}
      <mesh position={[0, -0.01, 0.02]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshPhysicalMaterial color={color} roughness={0.55} />
      </mesh>
      {/* Nostrils shadow */}
      <mesh position={[-0.02, -0.03, 0.01]} scale={[0.8, 0.5, 0.5]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshStandardMaterial color={shadow} roughness={0.8} />
      </mesh>
      <mesh position={[0.02, -0.03, 0.01]} scale={[0.8, 0.5, 0.5]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshStandardMaterial color={shadow} roughness={0.8} />
      </mesh>
    </group>
  )
}

// ============= MOUTH =============
function Mouth3D({ type }) {
  const lipColor = new THREE.Color('#d4807a')
  const lipDark = new THREE.Color('#b86b66')

  const getMouthShape = () => {
    switch (type) {
      case 'smile':
        return (
          <group position={[0, 1.42, 0.48]}>
            <mesh rotation={[0.3, 0, 0]}>
              <torusGeometry args={[0.08, 0.018, 12, 20, Math.PI]} />
              <meshPhysicalMaterial color={lipColor} roughness={0.35} clearcoat={0.3} clearcoatRoughness={0.5} />
            </mesh>
          </group>
        )
      case 'neutral':
        return (
          <group position={[0, 1.42, 0.5]}>
            <mesh>
              <capsuleGeometry args={[0.01, 0.1, 6, 12]} />
              <meshPhysicalMaterial color={lipColor} roughness={0.35} clearcoat={0.3} />
            </mesh>
          </group>
        )
      case 'open':
        return (
          <group position={[0, 1.41, 0.48]}>
            {/* Mouth cavity */}
            <mesh>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color={lipDark} roughness={0.6} />
            </mesh>
            {/* Upper lip */}
            <mesh position={[0, 0.035, 0.02]}>
              <capsuleGeometry args={[0.012, 0.08, 6, 12]} />
              <meshPhysicalMaterial color={lipColor} roughness={0.35} clearcoat={0.3} />
            </mesh>
            {/* Lower lip */}
            <mesh position={[0, -0.04, 0.02]}>
              <capsuleGeometry args={[0.014, 0.07, 6, 12]} />
              <meshPhysicalMaterial color={lipColor} roughness={0.35} clearcoat={0.3} />
            </mesh>
          </group>
        )
      case 'smirk':
        return (
          <group position={[0, 1.42, 0.48]}>
            <mesh rotation={[0.2, 0, 0.2]}>
              <torusGeometry args={[0.07, 0.015, 12, 20, Math.PI]} />
              <meshPhysicalMaterial color={lipColor} roughness={0.35} clearcoat={0.3} />
            </mesh>
          </group>
        )
      case 'grin':
        return (
          <group position={[0, 1.42, 0.48]}>
            <mesh rotation={[0.3, 0, 0]}>
              <torusGeometry args={[0.1, 0.02, 12, 20, Math.PI]} />
              <meshPhysicalMaterial color={lipColor} roughness={0.35} clearcoat={0.3} />
            </mesh>
            {/* Teeth */}
            <mesh position={[0, -0.025, 0.02]}>
              <boxGeometry args={[0.1, 0.035, 0.012]} />
              <meshPhysicalMaterial color="white" roughness={0.2} clearcoat={0.4} transparent opacity={0.75} />
            </mesh>
          </group>
        )
      default:
        return (
          <group position={[0, 1.42, 0.48]}>
            <mesh rotation={[0.3, 0, 0]}>
              <torusGeometry args={[0.08, 0.018, 12, 20, Math.PI]} />
              <meshPhysicalMaterial color={lipColor} roughness={0.35} clearcoat={0.3} />
            </mesh>
          </group>
        )
    }
  }

  return getMouthShape()
}

// ============= BODY & CLOTHING =============
function Body3D({ skinColor, clothing, clothingColor, bodyType }) {
  const skin = hexToVec3(skinColor)
  const cloth = hexToVec3(clothingColor)
  const clothDark = hexToVec3(adjustColor(clothingColor, -30))
  const cfg = BODY_CONFIGS[bodyType] || BODY_CONFIGS.normal
  const sw = cfg.shoulderW

  const getClothingDetails = () => {
    switch (clothing) {
      case 'hoodie':
        return (
          <>
            {/* Hood shape at neck */}
            <mesh position={[0, 1.12, -0.06]}>
              <cylinderGeometry args={[0.22, 0.28, 0.08, 16]} />
              <meshStandardMaterial color={clothDark} roughness={0.7} />
            </mesh>
            {/* Hoodie string */}
            <mesh position={[0.05, 1.08, 0.25]}>
              <cylinderGeometry args={[0.005, 0.005, 0.15, 4]} />
              <meshStandardMaterial color={clothDark} roughness={0.8} />
            </mesh>
            <mesh position={[-0.05, 1.08, 0.25]}>
              <cylinderGeometry args={[0.005, 0.005, 0.15, 4]} />
              <meshStandardMaterial color={clothDark} roughness={0.8} />
            </mesh>
            {/* Center line */}
            <mesh position={[0, 0.85, 0.26 * sw]}>
              <boxGeometry args={[0.015, 0.4, 0.01]} />
              <meshStandardMaterial color={clothDark} roughness={0.8} />
            </mesh>
          </>
        )
      case 'jacket':
        return (
          <>
            {/* Collar */}
            <mesh position={[-0.08, 1.1, 0.2]} rotation={[0, 0.3, 0.2]}>
              <boxGeometry args={[0.1, 0.08, 0.02]} />
              <meshStandardMaterial color={clothDark} roughness={0.6} />
            </mesh>
            <mesh position={[0.08, 1.1, 0.2]} rotation={[0, -0.3, -0.2]}>
              <boxGeometry args={[0.1, 0.08, 0.02]} />
              <meshStandardMaterial color={clothDark} roughness={0.6} />
            </mesh>
            {/* Zipper line */}
            <mesh position={[0, 0.88, 0.26 * sw]}>
              <boxGeometry args={[0.02, 0.35, 0.01]} />
              <meshStandardMaterial color={clothDark} roughness={0.5} metalness={0.2} />
            </mesh>
          </>
        )
      case 'suit':
        return (
          <>
            {/* Lapels */}
            <mesh position={[-0.07, 1.05, 0.22]} rotation={[0, 0.2, 0.15]}>
              <boxGeometry args={[0.08, 0.12, 0.02]} />
              <meshStandardMaterial color={clothDark} roughness={0.4} />
            </mesh>
            <mesh position={[0.07, 1.05, 0.22]} rotation={[0, -0.2, -0.15]}>
              <boxGeometry args={[0.08, 0.12, 0.02]} />
              <meshStandardMaterial color={clothDark} roughness={0.4} />
            </mesh>
            {/* Button */}
            <mesh position={[0, 0.95, 0.27 * sw]}>
              <cylinderGeometry args={[0.015, 0.015, 0.01, 8]} />
              <meshStandardMaterial color={clothDark} roughness={0.3} metalness={0.3} />
            </mesh>
          </>
        )
      case 'tank':
        return null
      default: // tshirt
        return (
          <mesh position={[0, 1.1, 0.05]} rotation={[0.1, 0, 0]}>
            <torusGeometry args={[0.18, 0.02, 8, 16, Math.PI * 2]} />
            <meshStandardMaterial color={clothDark} roughness={0.7} />
          </mesh>
        )
    }
  }

  // Clothing material roughness varies by type
  const clothRough = clothing === 'suit' ? 0.35 : clothing === 'jacket' ? 0.5 : 0.7
  const clothMetal = clothing === 'suit' ? 0.05 : 0

  return (
    <group>
      {/* Neck */}
      <mesh position={[0, 1.18, 0]}>
        <cylinderGeometry args={[0.1 * cfg.neckW, 0.12 * cfg.neckW, 0.22, 16]} />
        <meshPhysicalMaterial color={skin} roughness={0.55} sheen={0.2} sheenColor={skin} />
      </mesh>
      {/* Torso - slightly tapered shape */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.22 * sw, 0.28 * sw, 0.55, 20]} />
        <meshPhysicalMaterial color={cloth} roughness={clothRough} metalness={clothMetal} />
      </mesh>
      {/* Shoulders/Arms Left */}
      <mesh position={[-0.32 * sw, 0.95, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.08, 0.25, 8, 16]} />
        <meshPhysicalMaterial color={cloth} roughness={clothRough} metalness={clothMetal} />
      </mesh>
      {/* Shoulders/Arms Right */}
      <mesh position={[0.32 * sw, 0.95, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.08, 0.25, 8, 16]} />
        <meshPhysicalMaterial color={cloth} roughness={clothRough} metalness={clothMetal} />
      </mesh>
      {/* Hands (skin visible) */}
      <mesh position={[-0.42 * sw, 0.72, 0.02]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshPhysicalMaterial color={skin} roughness={0.55} />
      </mesh>
      <mesh position={[0.42 * sw, 0.72, 0.02]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshPhysicalMaterial color={skin} roughness={0.55} />
      </mesh>
      {getClothingDetails()}
    </group>
  )
}

// ============= HAIR =============
function Hair3D({ hairStyle, hairColor }) {
  const color = hexToVec3(hairColor)
  const highlight = hexToVec3(adjustColor(hairColor, 35))

  const renderStyle = () => {
    switch (hairStyle) {
      case 'short':
        return (
          <group position={[0, 1.7, 0]}>
            <mesh position={[0, 0.12, -0.02]}>
              <sphereGeometry args={[0.52, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
          </group>
        )
      case 'long':
        return (
          <group position={[0, 1.7, 0]}>
            {/* Top */}
            <mesh position={[0, 0.12, -0.02]}>
              <sphereGeometry args={[0.54, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            {/* Left side */}
            <mesh position={[-0.42, -0.35, -0.05]}>
              <capsuleGeometry args={[0.1, 0.5, 8, 12]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            {/* Right side */}
            <mesh position={[0.42, -0.35, -0.05]}>
              <capsuleGeometry args={[0.1, 0.5, 8, 12]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            {/* Back */}
            <mesh position={[0, -0.3, -0.3]}>
              <capsuleGeometry args={[0.25, 0.4, 8, 12]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
          </group>
        )
      case 'curly':
        return (
          <group position={[0, 1.82, 0]}>
            {[
              [0, 0.12, 0.1, 0.16], [-0.25, 0.08, 0.05, 0.15], [0.25, 0.08, 0.05, 0.14],
              [-0.38, -0.02, -0.05, 0.17], [0.38, -0.02, -0.05, 0.15],
              [-0.15, 0.15, 0.12, 0.14], [0.15, 0.15, 0.12, 0.16],
              [0, 0.05, -0.28, 0.15], [-0.28, 0.0, -0.2, 0.14], [0.28, 0.0, -0.2, 0.16],
            ].map(([x, y, z, r], i) => (
              <mesh key={i} position={[x, y, z]}>
                <sphereGeometry args={[r, 12, 12]} />
                <meshStandardMaterial color={i % 3 === 0 ? highlight : color} roughness={0.8} />
              </mesh>
            ))}
          </group>
        )
      case 'buzz':
        return (
          <group position={[0, 1.72, 0]}>
            <mesh position={[0, 0.1, -0.02]}>
              <sphereGeometry args={[0.5, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
              <meshStandardMaterial color={color} roughness={0.9} transparent opacity={0.6} />
            </mesh>
          </group>
        )
      case 'ponytail':
        return (
          <group position={[0, 1.7, 0]}>
            <mesh position={[0, 0.12, -0.02]}>
              <sphereGeometry args={[0.52, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            {/* Ponytail */}
            <mesh position={[0, 0.22, -0.35]} rotation={[0.6, 0, 0]}>
              <capsuleGeometry args={[0.08, 0.3, 8, 12]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            {/* Hair tie */}
            <mesh position={[0, 0.26, -0.4]}>
              <torusGeometry args={[0.06, 0.02, 8, 12]} />
              <meshStandardMaterial color={highlight} roughness={0.5} />
            </mesh>
          </group>
        )
      case 'mohawk':
        return (
          <group position={[0, 1.82, 0]}>
            {[0, 0.12, 0.24, 0.36].map((y, i) => (
              <mesh key={i} position={[0, y, -0.02 - i * 0.05]}>
                <boxGeometry args={[0.08, 0.12, 0.2 - i * 0.03]} />
                <meshStandardMaterial color={i % 2 === 0 ? color : highlight} roughness={0.7} />
              </mesh>
            ))}
          </group>
        )
      case 'messy':
        return (
          <group position={[0, 1.72, 0]}>
            <mesh position={[0, 0.12, -0.02]}>
              <sphereGeometry args={[0.53, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
            {/* Messy spikes */}
            {[
              [-0.2, 0.38, 0.1, 0.3], [0.15, 0.4, -0.05, -0.2],
              [0, 0.42, 0.05, 0.1], [-0.3, 0.25, -0.15, 0.4],
              [0.3, 0.28, -0.12, -0.3],
            ].map(([x, y, z, rot], i) => (
              <mesh key={i} position={[x, y, z]} rotation={[rot * 0.5, rot, 0]}>
                <coneGeometry args={[0.06, 0.15, 6]} />
                <meshStandardMaterial color={color} roughness={0.7} />
              </mesh>
            ))}
          </group>
        )
      case 'bob':
        return (
          <group position={[0, 1.7, 0]}>
            <mesh position={[0, 0.12, -0.02]}>
              <sphereGeometry args={[0.54, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            {/* Bob sides */}
            <mesh position={[-0.4, -0.15, 0]}>
              <capsuleGeometry args={[0.1, 0.25, 8, 12]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            <mesh position={[0.4, -0.15, 0]}>
              <capsuleGeometry args={[0.1, 0.25, 8, 12]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
          </group>
        )
      case 'spiky':
        return (
          <group position={[0, 1.78, 0]}>
            {[
              [0, 0.3, 0], [-0.2, 0.22, 0.1], [0.2, 0.22, 0.1],
              [-0.15, 0.28, -0.1], [0.15, 0.28, -0.1],
              [-0.3, 0.15, 0], [0.3, 0.15, 0],
              [0, 0.25, -0.2],
            ].map(([x, y, z], i) => (
              <mesh key={i} position={[x, y, z]} rotation={[z * 1.5, 0, x * 1.2]}>
                <coneGeometry args={[0.06, 0.2, 6]} />
                <meshStandardMaterial color={color} roughness={0.7} />
              </mesh>
            ))}
            {/* Base */}
            <mesh position={[0, 0.08, -0.02]}>
              <sphereGeometry args={[0.5, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
          </group>
        )
      case 'braids':
        return (
          <group position={[0, 1.7, 0]}>
            <mesh position={[0, 0.12, -0.02]}>
              <sphereGeometry args={[0.52, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            {/* Left braid */}
            {[0, -0.15, -0.3, -0.45].map((y, i) => (
              <mesh key={`l${i}`} position={[-0.4, y - 0.05, -0.08]}>
                <sphereGeometry args={[0.06 - i * 0.005, 8, 8]} />
                <meshStandardMaterial color={i % 2 === 0 ? color : highlight} roughness={0.7} />
              </mesh>
            ))}
            {/* Right braid */}
            {[0, -0.15, -0.3, -0.45].map((y, i) => (
              <mesh key={`r${i}`} position={[0.4, y - 0.05, -0.08]}>
                <sphereGeometry args={[0.06 - i * 0.005, 8, 8]} />
                <meshStandardMaterial color={i % 2 === 0 ? color : highlight} roughness={0.7} />
              </mesh>
            ))}
          </group>
        )
      case 'afro':
        return (
          <group position={[0, 1.78, 0]}>
            <mesh position={[0, 0.08, 0]}>
              <sphereGeometry args={[0.65, 24, 24]} />
              <meshStandardMaterial color={color} roughness={0.9} />
            </mesh>
            {/* Extra volume */}
            {[
              [0, 0.35, 0], [-0.3, 0.2, 0.15], [0.3, 0.2, 0.15],
              [-0.35, 0.05, -0.1], [0.35, 0.05, -0.1],
            ].map(([x, y, z], i) => (
              <mesh key={i} position={[x, y, z]}>
                <sphereGeometry args={[0.22, 12, 12]} />
                <meshStandardMaterial color={i % 2 === 0 ? highlight : color} roughness={0.9} transparent opacity={0.85} />
              </mesh>
            ))}
          </group>
        )
      case 'pixie':
        return (
          <group position={[0, 1.7, 0]}>
            <mesh position={[0, 0.12, -0.02]}>
              <sphereGeometry args={[0.52, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            {/* Asymmetric side sweep */}
            <mesh position={[-0.38, 0.02, 0.15]} rotation={[0, 0, 0.5]}>
              <capsuleGeometry args={[0.08, 0.15, 8, 8]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
          </group>
        )
      case 'sidepart':
        return (
          <group position={[0, 1.7, 0]}>
            <mesh position={[0, 0.12, -0.02]}>
              <sphereGeometry args={[0.53, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            {/* Side sweep */}
            <mesh position={[-0.35, 0.05, 0.2]} rotation={[0, 0.3, 0.4]}>
              <capsuleGeometry args={[0.1, 0.2, 8, 8]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
          </group>
        )
      case 'undercut':
        return (
          <group position={[0, 1.74, 0]}>
            <mesh position={[0, 0.12, 0.02]}>
              <sphereGeometry args={[0.46, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            {/* Shaved sides hint */}
            <mesh position={[-0.42, -0.08, 0]} scale={[1, 0.6, 0.8]}>
              <sphereGeometry args={[0.12, 12, 12]} />
              <meshStandardMaterial color={color} roughness={0.9} transparent opacity={0.3} />
            </mesh>
            <mesh position={[0.42, -0.08, 0]} scale={[1, 0.6, 0.8]}>
              <sphereGeometry args={[0.12, 12, 12]} />
              <meshStandardMaterial color={color} roughness={0.9} transparent opacity={0.3} />
            </mesh>
          </group>
        )
      default:
        return (
          <group position={[0, 1.7, 0]}>
            <mesh position={[0, 0.12, -0.02]}>
              <sphereGeometry args={[0.52, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
          </group>
        )
    }
  }

  return renderStyle()
}

// ============= HATS =============
function Hat3D({ type }) {
  if (type === 'none') return null

  const renderHatType = () => {
    switch (type) {
      case 'baseball':
        return (
          <group position={[0, 2.12, 0.05]}>
            <mesh>
              <sphereGeometry args={[0.42, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
              <meshStandardMaterial color={new THREE.Color('#2c3e50')} roughness={0.6} />
            </mesh>
            {/* Brim */}
            <mesh position={[0, -0.05, 0.32]} rotation={[-0.3, 0, 0]}>
              <cylinderGeometry args={[0.25, 0.3, 0.03, 16, 1, false, -Math.PI * 0.5, Math.PI]} />
              <meshStandardMaterial color={new THREE.Color('#1a252f')} roughness={0.5} />
            </mesh>
            {/* Button on top */}
            <mesh position={[0, 0.18, 0]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color={new THREE.Color('#1a252f')} roughness={0.5} />
            </mesh>
          </group>
        )
      case 'beanie':
        return (
          <group position={[0, 2.12, 0]}>
            <mesh position={[0, 0.05, 0]}>
              <sphereGeometry args={[0.44, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
              <meshStandardMaterial color={new THREE.Color('#7f8c8d')} roughness={0.8} />
            </mesh>
            {/* Fold/rim */}
            <mesh position={[0, -0.06, 0]}>
              <torusGeometry args={[0.4, 0.04, 8, 24]} />
              <meshStandardMaterial color={new THREE.Color('#6c7a7d')} roughness={0.7} />
            </mesh>
            {/* Pompom */}
            <mesh position={[0, 0.28, 0]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial color={new THREE.Color('#8e9fa1')} roughness={0.9} />
            </mesh>
          </group>
        )
      case 'tophat':
        return (
          <group position={[0, 2.18, 0]}>
            {/* Brim */}
            <mesh position={[0, -0.05, 0]}>
              <cylinderGeometry args={[0.42, 0.42, 0.04, 24]} />
              <meshStandardMaterial color={new THREE.Color('#111111')} roughness={0.3} metalness={0.1} />
            </mesh>
            {/* Cylinder */}
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.28, 0.3, 0.5, 24]} />
              <meshStandardMaterial color={new THREE.Color('#1a1a1a')} roughness={0.3} />
            </mesh>
            {/* Band */}
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.31, 0.31, 0.05, 24]} />
              <meshStandardMaterial color={new THREE.Color('#7a0000')} roughness={0.4} />
            </mesh>
          </group>
        )
      case 'wizard':
        return (
          <group position={[0, 2.12, 0]}>
            {/* Brim */}
            <mesh position={[0, -0.05, 0]}>
              <cylinderGeometry args={[0.48, 0.5, 0.04, 24]} />
              <meshStandardMaterial color={new THREE.Color('#3d1a6b')} roughness={0.6} />
            </mesh>
            {/* Cone */}
            <mesh position={[0, 0.35, 0]}>
              <coneGeometry args={[0.35, 0.8, 24]} />
              <meshStandardMaterial color={new THREE.Color('#5b2d8e')} roughness={0.5} />
            </mesh>
            {/* Star */}
            <mesh position={[0.15, 0.35, 0.28]}>
              <octahedronGeometry args={[0.04]} />
              <meshStandardMaterial color={new THREE.Color('#FFD700')} emissive={new THREE.Color('#FFD700')} emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
            </mesh>
          </group>
        )
      case 'crown':
        return (
          <group position={[0, 2.14, 0]}>
            {/* Base */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.36, 0.38, 0.15, 24]} />
              <meshStandardMaterial color={new THREE.Color('#FFD700')} roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Points */}
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i / 5) * Math.PI * 2
              return (
                <mesh key={i} position={[Math.sin(angle) * 0.32, 0.18, Math.cos(angle) * 0.32]}>
                  <coneGeometry args={[0.05, 0.15, 6]} />
                  <meshStandardMaterial color={new THREE.Color('#FFD700')} roughness={0.2} metalness={0.8} />
                </mesh>
              )
            })}
            {/* Gems */}
            <mesh position={[0, 0.02, 0.37]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color={new THREE.Color('#FF6B6B')} emissive={new THREE.Color('#FF6B6B')} emissiveIntensity={0.3} roughness={0.1} />
            </mesh>
            <mesh position={[0.35, 0.02, 0]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color={new THREE.Color('#4FC3F7')} emissive={new THREE.Color('#4FC3F7')} emissiveIntensity={0.3} roughness={0.1} />
            </mesh>
          </group>
        )
      case 'viking':
        return (
          <group position={[0, 2.12, 0]}>
            <mesh>
              <sphereGeometry args={[0.44, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
              <meshStandardMaterial color={new THREE.Color('#8B8B8B')} roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Left horn */}
            <mesh position={[-0.42, 0.05, 0]} rotation={[0, 0, 0.6]}>
              <coneGeometry args={[0.06, 0.4, 8]} />
              <meshStandardMaterial color={new THREE.Color('#F5DEB3')} roughness={0.5} />
            </mesh>
            {/* Right horn */}
            <mesh position={[0.42, 0.05, 0]} rotation={[0, 0, -0.6]}>
              <coneGeometry args={[0.06, 0.4, 8]} />
              <meshStandardMaterial color={new THREE.Color('#F5DEB3')} roughness={0.5} />
            </mesh>
            {/* Nose guard */}
            <mesh position={[0, -0.1, 0.38]}>
              <boxGeometry args={[0.04, 0.2, 0.02]} />
              <meshStandardMaterial color={new THREE.Color('#6B6B6B')} roughness={0.4} metalness={0.5} />
            </mesh>
          </group>
        )
      case 'pirate':
        return (
          <group position={[0, 2.14, 0]}>
            <mesh position={[0, 0.05, 0]}>
              <sphereGeometry args={[0.42, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
              <meshStandardMaterial color={new THREE.Color('#111111')} roughness={0.5} />
            </mesh>
            {/* Brim folds */}
            <mesh position={[-0.3, -0.02, 0.2]} rotation={[0.3, 0.3, 0.3]}>
              <boxGeometry args={[0.2, 0.03, 0.15]} />
              <meshStandardMaterial color={new THREE.Color('#222222')} roughness={0.5} />
            </mesh>
            <mesh position={[0.3, -0.02, 0.2]} rotation={[0.3, -0.3, -0.3]}>
              <boxGeometry args={[0.2, 0.03, 0.15]} />
              <meshStandardMaterial color={new THREE.Color('#222222')} roughness={0.5} />
            </mesh>
            {/* Skull emblem */}
            <mesh position={[0, 0.12, 0.4]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="white" roughness={0.5} />
            </mesh>
          </group>
        )
      case 'santa':
        return (
          <group position={[0, 2.12, 0]}>
            <mesh position={[0, 0.05, 0]}>
              <sphereGeometry args={[0.42, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
              <meshStandardMaterial color={new THREE.Color('#c0392b')} roughness={0.7} />
            </mesh>
            {/* Droopy tip */}
            <mesh position={[0.2, 0.15, 0.15]} rotation={[0.3, 0, 0.8]}>
              <coneGeometry args={[0.12, 0.35, 12]} />
              <meshStandardMaterial color={new THREE.Color('#c0392b')} roughness={0.7} />
            </mesh>
            {/* White trim */}
            <mesh position={[0, -0.06, 0]}>
              <torusGeometry args={[0.4, 0.05, 8, 24]} />
              <meshStandardMaterial color="white" roughness={0.9} />
            </mesh>
            {/* Pompom */}
            <mesh position={[0.35, 0.22, 0.2]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color="white" roughness={0.9} />
            </mesh>
          </group>
        )
      case 'cowboy':
        return (
          <group position={[0, 2.14, 0]}>
            {/* Wide brim */}
            <mesh position={[0, -0.05, 0]}>
              <cylinderGeometry args={[0.5, 0.55, 0.04, 24]} />
              <meshStandardMaterial color={new THREE.Color('#8B6914')} roughness={0.7} />
            </mesh>
            {/* Crown */}
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.28, 0.32, 0.3, 16]} />
              <meshStandardMaterial color={new THREE.Color('#A0782C')} roughness={0.6} />
            </mesh>
            {/* Band */}
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.33, 0.33, 0.04, 16]} />
              <meshStandardMaterial color={new THREE.Color('#6B4E0A')} roughness={0.5} />
            </mesh>
          </group>
        )
      case 'catears':
        return (
          <group position={[0, 2.05, 0]}>
            {/* Left ear */}
            <mesh position={[-0.28, 0.18, 0.1]}>
              <coneGeometry args={[0.1, 0.22, 4]} />
              <meshStandardMaterial color={new THREE.Color('#333333')} roughness={0.6} />
            </mesh>
            <mesh position={[-0.28, 0.17, 0.12]}>
              <coneGeometry args={[0.06, 0.15, 4]} />
              <meshStandardMaterial color={new THREE.Color('#FF9999')} roughness={0.6} />
            </mesh>
            {/* Right ear */}
            <mesh position={[0.28, 0.18, 0.1]}>
              <coneGeometry args={[0.1, 0.22, 4]} />
              <meshStandardMaterial color={new THREE.Color('#333333')} roughness={0.6} />
            </mesh>
            <mesh position={[0.28, 0.17, 0.12]}>
              <coneGeometry args={[0.06, 0.15, 4]} />
              <meshStandardMaterial color={new THREE.Color('#FF9999')} roughness={0.6} />
            </mesh>
          </group>
        )
      case 'helmet':
        return (
          <group position={[0, 2.1, 0]}>
            <mesh>
              <sphereGeometry args={[0.48, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
              <meshStandardMaterial color={new THREE.Color('#6B7280')} roughness={0.3} metalness={0.5} />
            </mesh>
            {/* Visor */}
            <mesh position={[0, -0.1, 0.35]} rotation={[-0.4, 0, 0]}>
              <boxGeometry args={[0.5, 0.12, 0.02]} />
              <meshStandardMaterial color={new THREE.Color('#4B5563')} roughness={0.2} metalness={0.4} transparent opacity={0.8} />
            </mesh>
          </group>
        )
      case 'fedora':
        return (
          <group position={[0, 2.14, 0]}>
            <mesh position={[0, -0.05, 0]}>
              <cylinderGeometry args={[0.46, 0.48, 0.04, 24]} />
              <meshStandardMaterial color={new THREE.Color('#3E2723')} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.26, 0.32, 0.25, 16]} />
              <meshStandardMaterial color={new THREE.Color('#5D4037')} roughness={0.5} />
            </mesh>
            {/* Band */}
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.33, 0.33, 0.04, 16]} />
              <meshStandardMaterial color={new THREE.Color('#1a1a1a')} roughness={0.4} />
            </mesh>
          </group>
        )
      case 'beret':
        return (
          <group position={[0, 2.12, 0]}>
            <mesh position={[0.05, 0.05, 0.05]} scale={[1.2, 0.5, 1.1]}>
              <sphereGeometry args={[0.38, 24, 24]} />
              <meshStandardMaterial color={new THREE.Color('#c0392b')} roughness={0.7} />
            </mesh>
            {/* Stem */}
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.04, 8]} />
              <meshStandardMaterial color={new THREE.Color('#a93226')} roughness={0.6} />
            </mesh>
          </group>
        )
      case 'partyhat':
        return (
          <group position={[0, 2.12, 0]}>
            <mesh position={[0, 0.25, 0]}>
              <coneGeometry args={[0.28, 0.55, 16]} />
              <meshStandardMaterial color={new THREE.Color('#9b59b6')} roughness={0.5} />
            </mesh>
            {/* Pompom */}
            <mesh position={[0, 0.55, 0]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial color={new THREE.Color('#FFD700')} emissive={new THREE.Color('#FFD700')} emissiveIntensity={0.3} roughness={0.3} />
            </mesh>
            {/* Dots */}
            {[[0.12, 0.2, 0.2, '#e74c3c'], [-0.08, 0.35, 0.15, '#4FC3F7'], [0.05, 0.15, -0.2, '#81C784']].map(([x, y, z, c], i) => (
              <mesh key={i} position={[x, y, z]}>
                <sphereGeometry args={[0.02, 6, 6]} />
                <meshStandardMaterial color={new THREE.Color(c)} emissive={new THREE.Color(c)} emissiveIntensity={0.2} />
              </mesh>
            ))}
          </group>
        )
      case 'bunnyears':
        return (
          <group position={[0, 2.1, 0]}>
            {/* Left ear */}
            <mesh position={[-0.2, 0.35, 0.05]}>
              <capsuleGeometry args={[0.06, 0.35, 8, 12]} />
              <meshStandardMaterial color={new THREE.Color('#FFB6C1')} roughness={0.6} />
            </mesh>
            <mesh position={[-0.2, 0.35, 0.07]}>
              <capsuleGeometry args={[0.03, 0.25, 8, 8]} />
              <meshStandardMaterial color={new THREE.Color('#FF69B4')} roughness={0.6} transparent opacity={0.5} />
            </mesh>
            {/* Right ear */}
            <mesh position={[0.2, 0.35, 0.05]}>
              <capsuleGeometry args={[0.06, 0.35, 8, 12]} />
              <meshStandardMaterial color={new THREE.Color('#FFB6C1')} roughness={0.6} />
            </mesh>
            <mesh position={[0.2, 0.35, 0.07]}>
              <capsuleGeometry args={[0.03, 0.25, 8, 8]} />
              <meshStandardMaterial color={new THREE.Color('#FF69B4')} roughness={0.6} transparent opacity={0.5} />
            </mesh>
          </group>
        )
      case 'chef':
        return (
          <group position={[0, 2.15, 0]}>
            {/* Base */}
            <mesh position={[0, -0.02, 0]}>
              <cylinderGeometry args={[0.38, 0.4, 0.08, 24]} />
              <meshStandardMaterial color="white" roughness={0.5} />
            </mesh>
            {/* Puffed top */}
            {[
              [0, 0.15, 0], [-0.15, 0.12, 0.1], [0.15, 0.12, 0.1],
              [0, 0.12, -0.15], [-0.12, 0.1, -0.1], [0.12, 0.1, -0.1],
            ].map(([x, y, z], i) => (
              <mesh key={i} position={[x, y, z]}>
                <sphereGeometry args={[0.16, 12, 12]} />
                <meshStandardMaterial color="white" roughness={0.5} />
              </mesh>
            ))}
          </group>
        )
      case 'astronaut':
        return (
          <group position={[0, 1.6, 0]}>
            {/* Helmet sphere */}
            <mesh>
              <sphereGeometry args={[0.62, 24, 24]} />
              <meshStandardMaterial color={new THREE.Color('#e0e0e0')} roughness={0.2} metalness={0.3} transparent opacity={0.85} />
            </mesh>
            {/* Visor */}
            <mesh position={[0, 0, 0.1]}>
              <sphereGeometry args={[0.58, 24, 24, -Math.PI * 0.4, Math.PI * 0.8, Math.PI * 0.2, Math.PI * 0.45]} />
              <meshStandardMaterial color={new THREE.Color('#4FC3F7')} roughness={0.1} metalness={0.2} transparent opacity={0.3} />
            </mesh>
          </group>
        )
      default:
        return null
    }
  }

  return renderHatType()
}

// ============= ACCESSORIES =============
function Accessory3D({ type }) {
  if (type === 'none') return null

  const renderType = () => {
    switch (type) {
      case 'glasses':
        return (
          <group position={[0, 1.62, 0.45]}>
            {/* Left lens */}
            <mesh position={[-0.18, 0, 0]}>
              <torusGeometry args={[0.1, 0.01, 8, 16]} />
              <meshStandardMaterial color={new THREE.Color('#777777')} roughness={0.3} metalness={0.5} />
            </mesh>
            {/* Right lens */}
            <mesh position={[0.18, 0, 0]}>
              <torusGeometry args={[0.1, 0.01, 8, 16]} />
              <meshStandardMaterial color={new THREE.Color('#777777')} roughness={0.3} metalness={0.5} />
            </mesh>
            {/* Bridge */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.08, 0.01, 0.01]} />
              <meshStandardMaterial color={new THREE.Color('#777777')} roughness={0.3} metalness={0.5} />
            </mesh>
            {/* Left arm */}
            <mesh position={[-0.32, 0, -0.12]} rotation={[0, 0.4, 0]}>
              <boxGeometry args={[0.15, 0.01, 0.01]} />
              <meshStandardMaterial color={new THREE.Color('#777777')} roughness={0.3} metalness={0.5} />
            </mesh>
            {/* Right arm */}
            <mesh position={[0.32, 0, -0.12]} rotation={[0, -0.4, 0]}>
              <boxGeometry args={[0.15, 0.01, 0.01]} />
              <meshStandardMaterial color={new THREE.Color('#777777')} roughness={0.3} metalness={0.5} />
            </mesh>
          </group>
        )
      case 'sunglasses':
        return (
          <group position={[0, 1.62, 0.45]}>
            {/* Left lens */}
            <mesh position={[-0.18, 0, 0]}>
              <boxGeometry args={[0.2, 0.12, 0.02]} />
              <meshStandardMaterial color={new THREE.Color('#1a1a1a')} roughness={0.2} metalness={0.1} />
            </mesh>
            {/* Right lens */}
            <mesh position={[0.18, 0, 0]}>
              <boxGeometry args={[0.2, 0.12, 0.02]} />
              <meshStandardMaterial color={new THREE.Color('#1a1a1a')} roughness={0.2} metalness={0.1} />
            </mesh>
            {/* Bridge */}
            <mesh>
              <boxGeometry args={[0.08, 0.02, 0.02]} />
              <meshStandardMaterial color={new THREE.Color('#444444')} roughness={0.3} metalness={0.4} />
            </mesh>
            {/* Arms */}
            <mesh position={[-0.34, 0, -0.12]} rotation={[0, 0.4, 0]}>
              <boxGeometry args={[0.18, 0.015, 0.015]} />
              <meshStandardMaterial color={new THREE.Color('#444444')} roughness={0.3} metalness={0.4} />
            </mesh>
            <mesh position={[0.34, 0, -0.12]} rotation={[0, -0.4, 0]}>
              <boxGeometry args={[0.18, 0.015, 0.015]} />
              <meshStandardMaterial color={new THREE.Color('#444444')} roughness={0.3} metalness={0.4} />
            </mesh>
          </group>
        )
      case 'earring':
        return (
          <group position={[-0.52, 1.52, 0]}>
            <mesh>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color={new THREE.Color('#FFD700')} roughness={0.2} metalness={0.8} />
            </mesh>
          </group>
        )
      case 'headphones':
        return (
          <group position={[0, 1.7, 0]}>
            {/* Band */}
            <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.45, 0.025, 8, 24, Math.PI]} />
              <meshStandardMaterial color={new THREE.Color('#444444')} roughness={0.3} metalness={0.5} />
            </mesh>
            {/* Left pad */}
            <mesh position={[-0.46, -0.05, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.06, 12]} />
              <meshStandardMaterial color={new THREE.Color('#555555')} roughness={0.5} />
            </mesh>
            {/* Right pad */}
            <mesh position={[0.46, -0.05, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.06, 12]} />
              <meshStandardMaterial color={new THREE.Color('#555555')} roughness={0.5} />
            </mesh>
          </group>
        )
      case 'mask':
        return (
          <group position={[0, 1.48, 0.42]}>
            <mesh scale={[1.2, 0.8, 0.3]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color={new THREE.Color('#333333')} roughness={0.6} />
            </mesh>
          </group>
        )
      case 'scarf':
        return (
          <group position={[0, 1.15, 0.08]}>
            <mesh>
              <torusGeometry args={[0.2, 0.06, 8, 16]} />
              <meshStandardMaterial color={new THREE.Color('#e07060')} roughness={0.7} />
            </mesh>
            {/* Hanging part */}
            <mesh position={[0.12, -0.12, 0.12]} rotation={[0.3, 0, 0.2]}>
              <capsuleGeometry args={[0.04, 0.15, 6, 8]} />
              <meshStandardMaterial color={new THREE.Color('#e07060')} roughness={0.7} />
            </mesh>
          </group>
        )
      case 'monocle':
        return (
          <group position={[0.18, 1.62, 0.48]}>
            <mesh>
              <torusGeometry args={[0.11, 0.008, 8, 16]} />
              <meshStandardMaterial color={new THREE.Color('#FFD700')} roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Chain */}
            <mesh position={[0.08, -0.15, 0]} rotation={[0, 0, 0.3]}>
              <cylinderGeometry args={[0.003, 0.003, 0.25, 4]} />
              <meshStandardMaterial color={new THREE.Color('#FFD700')} roughness={0.2} metalness={0.8} />
            </mesh>
          </group>
        )
      case 'bowtie':
        return (
          <group position={[0, 1.12, 0.25]}>
            {/* Left wing */}
            <mesh position={[-0.06, 0, 0]} rotation={[0, 0, 0.3]}>
              <boxGeometry args={[0.08, 0.05, 0.02]} />
              <meshStandardMaterial color={new THREE.Color('#d07068')} roughness={0.5} />
            </mesh>
            {/* Right wing */}
            <mesh position={[0.06, 0, 0]} rotation={[0, 0, -0.3]}>
              <boxGeometry args={[0.08, 0.05, 0.02]} />
              <meshStandardMaterial color={new THREE.Color('#d07068')} roughness={0.5} />
            </mesh>
            {/* Center knot */}
            <mesh>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color={new THREE.Color('#b05548')} roughness={0.5} />
            </mesh>
          </group>
        )
      case 'bandana':
        return (
          <group position={[0, 1.83, 0]}>
            <mesh>
              <torusGeometry args={[0.46, 0.03, 8, 24]} />
              <meshStandardMaterial color={new THREE.Color('#e07060')} roughness={0.7} />
            </mesh>
            {/* Knot/tails at back */}
            <mesh position={[-0.3, -0.05, -0.3]} rotation={[0.3, 0, 0.5]}>
              <capsuleGeometry args={[0.03, 0.1, 6, 8]} />
              <meshStandardMaterial color={new THREE.Color('#e07060')} roughness={0.7} />
            </mesh>
            <mesh position={[-0.25, -0.1, -0.35]} rotation={[0.3, 0.2, 0.8]}>
              <capsuleGeometry args={[0.025, 0.08, 6, 8]} />
              <meshStandardMaterial color={new THREE.Color('#e07060')} roughness={0.7} />
            </mesh>
          </group>
        )
      default:
        return null
    }
  }

  return renderType()
}

// ============= IDLE ANIMATION =============
function IdleAnimation({ children, animated }) {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    if (!animated || !groupRef.current) return
    const t = clock.getElapsedTime()
    // Gentle breathing-like bob
    groupRef.current.position.y = Math.sin(t * 1.0) * 0.015
    // Very subtle sway
    groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.03
    groupRef.current.rotation.z = Math.sin(t * 0.6) * 0.005
  })

  return <group ref={groupRef}>{children}</group>
}

// ============= AVATAR SCENE =============
function AvatarScene({
  skinColor, hairColor, hairStyle, eyeType, eyeColor,
  eyebrows, mouth, accessory, hat, clothing, clothingColor, bodyType,
  animated,
}) {
  return (
    <>
      {/* Lighting - 3-point setup for character rendering */}
      <ambientLight intensity={0.4} />
      {/* Key light - main light from upper right */}
      <directionalLight position={[3, 5, 4]} intensity={0.9} castShadow color="#fff8f0" />
      {/* Fill light - softer from left to reduce shadows */}
      <directionalLight position={[-3, 3, 2]} intensity={0.35} color="#d4e5ff" />
      {/* Back/rim light - creates edge definition */}
      <directionalLight position={[0, 3, -4]} intensity={0.25} color="#e8d8ff" />
      {/* Front fill - ensures face is well lit */}
      <pointLight position={[0, 1.5, 3.5]} intensity={0.35} color="#fff5ee" distance={8} />

      <Environment preset="studio" />

      <IdleAnimation animated={animated}>
        <group position={[0, -1.2, 0]}>
          <Body3D
            skinColor={skinColor || '#F5D6B8'}
            clothing={clothing}
            clothingColor={clothingColor || '#374151'}
            bodyType={bodyType}
          />
          <Head3D skinColor={skinColor || '#F5D6B8'} />
          <Eyes3D eyeType={eyeType || 'round'} eyeColor={eyeColor || '#6B3A2A'} animated={animated} />
          <Eyebrows3D type={eyebrows || 'none'} />
          <Nose3D skinColor={skinColor || '#F5D6B8'} />
          <Mouth3D type={mouth || 'smile'} />
          <Hair3D hairStyle={hairStyle || 'short'} hairColor={hairColor || '#2C1810'} />
          <Hat3D type={hat || 'none'} />
          <Accessory3D type={accessory || 'none'} />
        </group>
      </IdleAnimation>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI * 0.3}
        maxPolarAngle={Math.PI * 0.7}
        rotateSpeed={0.5}
      />
    </>
  )
}

// ============= MAIN EXPORT =============
export default function Avatar3DRenderer({
  skinColor, hairColor, hairStyle, eyeType,
  eyebrows = 'none', mouth = 'smile', accessory = 'none', bgStyle = 'gray',
  hat = 'none', clothing = 'tshirt', clothingColor = '#374151', eyeColor = '#6B3A2A',
  bodyType = 'normal',
  size = 200, animated = false,
}) {
  const BG_COLORS = {
    gray: '#374151', blue: '#1e3a5f', purple: '#3b1f6e', green: '#1a3a2a',
    red: '#4a1a1a', pink: '#4a1a3a', sunset: '#4a2a1a', galaxy: '#1a1a3a',
    fire: '#3a1a0a', ocean: '#0a2a3a', forest: '#1a2a1a', neon: '#1a1a2a',
    arctic: '#2a3a4a', cherry: '#3a1a2a', candy: '#3a2a3a', mindforge: '#1a2a4a',
  }

  const bgColor = BG_COLORS[bgStyle] || BG_COLORS.gray

  return (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0.3, 2.8], fov: 35 }}
        style={{ background: bgColor }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <AvatarScene
            skinColor={skinColor}
            hairColor={hairColor}
            hairStyle={hairStyle}
            eyeType={eyeType}
            eyeColor={eyeColor}
            eyebrows={eyebrows}
            mouth={mouth}
            accessory={accessory}
            hat={hat}
            clothing={clothing}
            clothingColor={clothingColor}
            bodyType={bodyType}
            animated={animated}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
