/* eslint-disable react/no-unknown-property */
import { useRef, Suspense, useState, memo } from 'react'
import { Canvas, useFrame, useThree, createPortal } from '@react-three/fiber'
import { MeshTransmissionMaterial, useFBO, Html } from '@react-three/drei'
import * as THREE from 'three'
import { easing } from 'maath'

const IconGlass = memo(function IconGlass({ children, icon, color, ...props }) {
  const ref = useRef()
  const buffer = useFBO()
  const { viewport, gl, camera } = useThree()
  const [scene] = useState(() => new THREE.Scene())
  const geoWidthRef = useRef(1)

  useFrame((state, delta) => {
    const { pointer } = state
    const v = viewport.getCurrentViewport(camera, [0, 0, 15])

    const destX = (pointer.x * v.width) / 2
    const destY = (pointer.y * v.height) / 2
    
    if (ref.current) {
      easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta)
      
      // Auto-scale like FluidGlass
      if (geoWidthRef.current > 0) {
        const maxWorld = v.width * 0.9
        const desired = maxWorld / geoWidthRef.current
        ref.current.scale.setScalar(Math.min(0.15, desired))
      }
    }

    // Render scene (background) to buffer
    gl.setRenderTarget(buffer)
    gl.render(scene, camera)
    gl.setRenderTarget(null)
  })

  const {
    scale,
    ior = 1.15,
    thickness = 2,
    transmission = 1,
    roughness = 0,
    chromaticAberration = 0.05,
    anisotropy = 0.01,
    ...extraMat
  } = props

  return (
    <>
      {/* Portal background content into scene */}
      {createPortal(children, scene)}
      
      {/* Background plane showing buffer texture */}
      <mesh scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>
      
      {/* Glass mesh */}
      <mesh 
        ref={ref}
        scale={scale ?? 0.15}
        rotation-x={Math.PI / 2}
        onUpdate={(self) => {
          if (self.geometry) {
            self.geometry.computeBoundingBox()
            geoWidthRef.current = self.geometry.boundingBox.max.x - self.geometry.boundingBox.min.x || 1
          }
        }}
        {...props}
      >
        <boxGeometry args={[1, 1, 0.1]} />
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior}
          thickness={thickness}
          transmission={transmission}
          roughness={roughness}
          chromaticAberration={chromaticAberration}
          anisotropy={anisotropy}
          color={color || '#ffffff'}
          {...extraMat}
        />
      </mesh>
      
      {/* Render icon on top (not refracted) */}
      <Html 
        position={[0, 0, 16]}
        center
        style={{ 
          pointerEvents: 'none',
          transform: 'scale(0.01)'
        }}
      >
        {icon}
      </Html>
    </>
  )
})

export default function FluidGlassIcon({ icon, color, label, onClick, size = 64 }) {
  return (
    <div 
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        position: 'relative',
        cursor: 'pointer',
        background: 'transparent',
        overflow: 'visible'
      }}
      onClick={onClick}
    >
      <Canvas 
        camera={{ position: [0, 0, 20], fov: 15 }} 
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <IconGlass 
            icon={icon}
            color={color}
            ior={1.15}
            thickness={2}
            transmission={1}
            roughness={0}
            chromaticAberration={0.05}
            anisotropy={0.01}
          >
            {/* Empty scene - glass will refract what's behind */}
          </IconGlass>
        </Suspense>
      </Canvas>
      {label && (
        <span style={{
          position: 'absolute',
          bottom: '-18px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '11px',
          color: 'white',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
          zIndex: 10
        }}>
          {label}
        </span>
      )}
    </div>
  )
}
