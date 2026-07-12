import type { ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'

interface SceneProps {
  children: ReactNode
  cameraPosition?: [number, number, number]
  controls?: boolean
}

export function Scene({ children, cameraPosition = [0, 0, 5], controls = true }: SceneProps) {
  return (
    <Canvas camera={{ position: cameraPosition }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={10} blur={2} />
      <Environment preset="city" />
      {children}
      {controls && <OrbitControls />}
    </Canvas>
  )
}
