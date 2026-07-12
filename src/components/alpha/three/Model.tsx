import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

interface ModelProps {
  url?: string
  fallback?: 'box' | 'sphere' | 'torusKnot'
}

export function Model({ fallback = 'torusKnot' }: ModelProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      {fallback === 'torusKnot' && <torusKnotGeometry args={[1, 0.4, 128, 32]} />}
      {fallback === 'sphere' && <sphereGeometry args={[1, 32, 32]} />}
      {fallback === 'box' && <boxGeometry args={[1, 1, 1]} />}
      <meshStandardMaterial color={hovered ? '#E8391D' : '#6366f1'} />
    </mesh>
  )
}
