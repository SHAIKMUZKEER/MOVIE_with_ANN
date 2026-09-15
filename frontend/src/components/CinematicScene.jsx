import { Canvas, useFrame } from '@react-three/fiber'
import {
  Float,
  Stars,
  Sparkles,
} from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'


/* =========================================================
   ENERGY ORB
========================================================= */

function EnergyOrb() {
  const orbRef = useRef(null)
  const coreRef = useRef(null)
  const glowRef = useRef(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (orbRef.current) {
      orbRef.current.rotation.x = time * 0.10
      orbRef.current.rotation.y = time * 0.18
      orbRef.current.rotation.z = time * 0.04
    }

    if (coreRef.current) {
      const pulse =
        1 + Math.sin(time * 1.8) * 0.08

      coreRef.current.scale.set(
        pulse,
        pulse,
        pulse,
      )
    }

    if (glowRef.current) {
      const pulse =
        1 + Math.sin(time * 1.2) * 0.05

      glowRef.current.scale.set(
        pulse,
        pulse,
        pulse,
      )
    }
  })

  return (
    <Float
      speed={0.7}
      rotationIntensity={0.15}
      floatIntensity={0.45}
    >

      <group position={[2.0, 0.25, 0]}>

        {/* =================================================
            LARGE OUTER GLOW
        ================================================= */}

        <mesh ref={glowRef}>

          <sphereGeometry
            args={[1.9, 48, 48]}
          />

          <meshBasicMaterial
            color="#4338ca"
            transparent
            opacity={0.09}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />

        </mesh>


        {/* =================================================
            SECOND GLOW
        ================================================= */}

        <mesh>

          <sphereGeometry
            args={[1.45, 48, 48]}
          />

          <meshBasicMaterial
            color="#6366f1"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />

        </mesh>


        {/* =================================================
            MAIN 3D ORB
        ================================================= */}

        <mesh ref={orbRef}>

          <icosahedronGeometry
            args={[1.05, 5]}
          />

          <meshStandardMaterial
            color="#15104f"
            emissive="#6366f1"
            emissiveIntensity={3}
            metalness={0.85}
            roughness={0.16}
          />

        </mesh>


        {/* =================================================
            INNER ENERGY CORE
        ================================================= */}

        <mesh
          ref={coreRef}
          scale={0.45}
        >

          <sphereGeometry
            args={[1, 48, 48]}
          />

          <meshBasicMaterial
            color="#ddd6fe"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />

        </mesh>

      </group>

    </Float>
  )
}


/* =========================================================
   ORBITAL RING
========================================================= */

function OrbitalRing({
  radius,
  rotation,
  speed,
  opacity,
}) {

  const ringRef = useRef(null)

  useFrame((state) => {

    const time =
      state.clock.getElapsedTime()

    if (ringRef.current) {

      ringRef.current.rotation.z =
        rotation + time * speed

      ringRef.current.rotation.x =
        Math.sin(time * 0.15) * 0.12

    }

  })

  return (

    <mesh
      ref={ringRef}
      position={[2.0, 0.25, 0]}
      rotation={[
        Math.PI / 2,
        rotation,
        0,
      ]}
    >

      <torusGeometry
        args={[
          radius,
          0.014,
          16,
          180,
        ]}
      />

      <meshBasicMaterial
        color="#818cf8"
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />

    </mesh>

  )
}


/* =========================================================
   SMALL ORBITING ENERGY POINTS
========================================================= */

function EnergyParticles() {

  const groupRef = useRef(null)

  useFrame((state) => {

    const time =
      state.clock.getElapsedTime()

    if (groupRef.current) {

      groupRef.current.rotation.y =
        time * 0.08

      groupRef.current.rotation.z =
        Math.sin(time * 0.2) * 0.1

    }

  })

  return (

    <group
      ref={groupRef}
      position={[2.0, 0.25, 0]}
    >

      {Array.from({
        length: 18,
      }).map((_, index) => {

        const angle =
          (index / 18) *
          Math.PI *
          2

        const radius =
          1.55 +
          (index % 3) * 0.18

        const x =
          Math.cos(angle) * radius

        const y =
          Math.sin(angle) * radius

        return (

          <mesh
            key={index}
            position={[
              x,
              y,
              (index % 4) * 0.12,
            ]}
          >

            <sphereGeometry
              args={[0.025, 8, 8]}
            />

            <meshBasicMaterial
              color="#a5b4fc"
              transparent
              opacity={0.7}
              blending={
                THREE.AdditiveBlending
              }
            />

          </mesh>

        )
      })}

    </group>

  )
}


/* =========================================================
   CINEMATIC OBJECTS
========================================================= */

function CinematicObjects() {

  return (

    <>

      <EnergyOrb />

      <OrbitalRing
        radius={1.45}
        rotation={0.25}
        speed={0.16}
        opacity={0.8}
      />

      <OrbitalRing
        radius={1.75}
        rotation={-0.65}
        speed={-0.10}
        opacity={0.55}
      />

      <OrbitalRing
        radius={2.05}
        rotation={1.0}
        speed={0.07}
        opacity={0.32}
      />

      <EnergyParticles />

    </>

  )
}


/* =========================================================
   CAMERA PARALLAX
========================================================= */

function CameraRig() {

  useFrame((state) => {

    const mouseX =
      state.pointer.x

    const mouseY =
      state.pointer.y

    const targetX =
      mouseX * 0.35

    const targetY =
      mouseY * 0.20

    state.camera.position.x =
      THREE.MathUtils.lerp(
        state.camera.position.x,
        targetX,
        0.025,
      )

    state.camera.position.y =
      THREE.MathUtils.lerp(
        state.camera.position.y,
        targetY,
        0.025,
      )

    state.camera.lookAt(
      0,
      0,
      0,
    )

  })

  return null
}


/* =========================================================
   MAIN THREE.JS SCENE
========================================================= */

function CinematicScene() {

  return (

    <Canvas

      dpr={[1, 1.5]}

      camera={{
        position: [0, 0, 6],
        fov: 52,
      }}

      gl={{
        antialias: true,
        alpha: true,
        powerPreference:
          'high-performance',
      }}

      style={{
        width: '100%',
        height: '100%',
      }}

    >

      {/* =================================================
          LIGHTING
      ================================================= */}

      <ambientLight
        intensity={0.4}
      />

      <pointLight
        position={[3, 2, 3]}
        intensity={15}
        color="#6366f1"
      />

      <pointLight
        position={[-3, -2, 2]}
        intensity={7}
        color="#2563eb"
      />


      {/* =================================================
          STAR FIELD
      ================================================= */}

      <Stars
        radius={80}
        depth={50}
        count={2500}
        factor={2.2}
        saturation={0}
        fade
        speed={0.25}
      />


      {/* =================================================
          FLOATING PARTICLES
      ================================================= */}

      <Sparkles
        count={220}
        scale={[14, 9, 10]}
        size={1.5}
        speed={0.22}
        opacity={0.5}
        noise={1}
      />


      {/* =================================================
          MAIN CINEMATIC OBJECTS
      ================================================= */}

      <CinematicObjects />


      {/* =================================================
          CAMERA
      ================================================= */}

      <CameraRig />

    </Canvas>

  )
}

export default CinematicScene