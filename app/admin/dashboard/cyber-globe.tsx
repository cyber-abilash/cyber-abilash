"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  MeshDistortMaterial,
} from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Globe() {
  const globeRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={globeRef}>
      <mesh>
        <sphereGeometry args={[1.15, 64, 64]} />
        <MeshDistortMaterial
          color="#00E5A0"
          roughness={0.2}
          metalness={0.8}
          distort={0.3}
          speed={1.5}
          transparent
          opacity={0.85}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#00E5A0"
          wireframe
          transparent
          opacity={0.13}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2.5, 0.3, 0]}>
        <torusGeometry args={[1.45, 0.008, 16, 120]} />
        <meshBasicMaterial
          color="#00E5A0"
          transparent
          opacity={0.7}
        />
      </mesh>

      <mesh rotation={[0.8, 0.5, 0.8]}>
        <torusGeometry args={[1.55, 0.005, 16, 120]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

export default function CyberGlobe() {
  return (
    <div className="h-[280px] w-full md:h-[360px]">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.2} />
        <pointLight
          position={[3, 3, 3]}
          intensity={2}
          color="#00E5A0"
        />
        <pointLight
          position={[-3, -2, 2]}
          intensity={1.5}
          color="#38BDF8"
        />

        <Stars
          radius={60}
          depth={40}
          count={1200}
          factor={3}
          fade
          speed={0.5}
        />

        <Globe />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
        />
      </Canvas>
    </div>
  );
}