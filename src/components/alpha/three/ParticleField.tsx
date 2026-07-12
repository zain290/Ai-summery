import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, BufferGeometry, Float32BufferAttribute } from 'three'

interface ParticleFieldProps {
  count?: number
  spread?: number
  color?: string
  size?: number
  speed?: number
}

export function ParticleField({
  count = 500,
  spread = 10,
  color = '#E8391D',
  size = 0.05,
  speed = 0.2,
}: ParticleFieldProps) {
  const pointsRef = useRef<Points>(null)
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * spread
    }
    return pos
  }, [count, spread])

  const geometry = useMemo(() => {
    const geo = new BufferGeometry()
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
    return geo
  }, [positions])

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * speed * 0.1
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}
