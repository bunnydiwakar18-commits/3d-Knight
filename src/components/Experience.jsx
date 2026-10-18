import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'



// Knight 3D Model
const Knight = () => {
  const { scene } = useGLTF('/model/knight.glb')
  const knightRef = useRef()
  const keys = useRef({})

  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key.toLowerCase()] = true
    }

    const handleKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false
    }

    const handleBlur = () => {
      keys.current = {}
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  useFrame((state, delta) => {
    if (!knightRef.current) return

    const speed = 3 * delta

    if (keys.current['w'] || keys.current['arrowup']) {
      knightRef.current.position.z -= speed
    }

    if (keys.current['s'] || keys.current['arrowdown']) {
      knightRef.current.position.z += speed
    }

    if (keys.current['a'] || keys.current['arrowleft']) {
      knightRef.current.position.x -= speed
    }

    if (keys.current['d'] || keys.current['arrowright']) {
      knightRef.current.position.x += speed
    }
  })

  return (
    <group ref={knightRef} position={[0, 0, 0]}>
      <primitive object={scene} scale={1} />
    </group>
  )
}

// Ground Component

const Ground = () => {
  const groundRef = useRef();

  useFrame((state) => {
    if (!groundRef.current) return;

    // Keep the ground centered around the player
    const player = state.scene.getObjectByName("knight-player");

    if (player) {
      groundRef.current.position.x = player.position.x;
      groundRef.current.position.z = player.position.z;
    }
  });

  return (
    <group ref={groundRef} position={[0, -0.05, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color="#454b50"
          roughness={0.9}
        />
      </mesh>

      <gridHelper
        args={[200, 100, "#78838f", "#59616b"]}
        position={[0, 0.01, 0]}
      />
    </group>
  );
};

// Main Experience
export const Experience = () => {
  return (
    <>
      <OrbitControls makeDefault />

      <ambientLight intensity={1.5} />

      <directionalLight
        position={[5, 10, 5]}
        intensity={2}
        castShadow
      />

      <Ground />

      <Knight />
    </>
  )
}

useGLTF.preload('/model/knight.glb')