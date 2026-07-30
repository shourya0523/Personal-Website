import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float } from '@react-three/drei'

/**
 * Placeholder for the user’s One Wish Willow GLB.
 * When ready: useGLTF('/models/willow/one-wish-willow.glb') inside Suspense.
 */
function WillowPlaceholder() {
  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.55}>
      <group position={[0, -0.2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.12, 1.6, 8]} />
          <meshStandardMaterial color="#2d4a28" roughness={0.85} />
        </mesh>
        <mesh position={[0.35, 0.35, 0]} rotation={[0, 0, -0.6]}>
          <cylinderGeometry args={[0.04, 0.05, 0.7, 6]} />
          <meshStandardMaterial color="#3d5c34" roughness={0.9} />
        </mesh>
        <mesh position={[-0.3, 0.45, 0.05]} rotation={[0, 0, 0.55]}>
          <cylinderGeometry args={[0.035, 0.045, 0.55, 6]} />
          <meshStandardMaterial color="#1f331c" roughness={0.9} />
        </mesh>
        <mesh position={[0.05, 0.85, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#1a3318" roughness={1} />
        </mesh>
      </group>
    </Float>
  )
}

export default function WillowScene() {
  return (
    <div className="willow-scene" data-testid="willow-scene">
      <Canvas
        camera={{ position: [0, 0.25, 3.1], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 3, 2]} intensity={1.05} color="#ffd0d0" />
        <Suspense fallback={null}>
          <WillowPlaceholder />
        </Suspense>
      </Canvas>
    </div>
  )
}
