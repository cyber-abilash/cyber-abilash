"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HologramShieldProps {
  reducedMotion?: boolean;
}

export default function HologramShield({
  reducedMotion = false,
}: HologramShieldProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const wireMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  // Construct a classified cybersecurity shield silhouette
  const shieldGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Top center
    shape.moveTo(0, 1.45);
    // Top right crest
    shape.quadraticCurveTo(0.6, 1.55, 1.15, 1.25);
    // Upper right flank
    shape.lineTo(1.15, 0.2);
    // Lower right taper down to point
    shape.quadraticCurveTo(1.05, -0.9, 0, -1.65);
    // Lower left taper up from point
    shape.quadraticCurveTo(-1.05, -0.9, -1.15, 0.2);
    // Upper left flank
    shape.lineTo(-1.15, 1.25);
    // Top left crest back to top center
    shape.quadraticCurveTo(-0.6, 1.55, 0, 1.45);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const heroThreshold =
      typeof window !== "undefined" ? window.innerHeight * 0.9 : 800;

    // Fade out shield as user scrolls past hero section
    const fadeOut = Math.max(0, 1 - scrollY / heroThreshold);
    groupRef.current.visible = fadeOut > 0.01;

    if (!groupRef.current.visible) return;

    if (wireMaterialRef.current) {
      wireMaterialRef.current.opacity = 0.45 * fadeOut;
    }

    if (!reducedMotion) {
      // Interactive pointer reaction
      const pointer = state.pointer;
      const targetRotY = pointer.x * 0.4 + Math.sin(state.clock.elapsedTime * 0.6) * 0.1;
      const targetRotX = -pointer.y * 0.3 + Math.cos(state.clock.elapsedTime * 0.4) * 0.06;

      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotY,
        3.5,
        delta
      );
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetRotX,
        3.5,
        delta
      );

      // Revolving energy rings
      if (ring1Ref.current) {
        ring1Ref.current.rotation.z += delta * 0.4;
      }
      if (ring2Ref.current) {
        ring2Ref.current.rotation.y -= delta * 0.35;
      }
    }
  });

  return (
    <group ref={groupRef} position={[2.2, 0.15, 0]} scale={0.92}>
      {/* Solid Obsidian Core */}
      <mesh geometry={shieldGeometry}>
        <meshStandardMaterial
          color="#0d0408"
          emissive="#380012"
          emissiveIntensity={0.65}
          roughness={0.35}
          metalness={0.9}
        />
      </mesh>

      {/* Holographic Wireframe Outline */}
      <mesh geometry={shieldGeometry} scale={[1.015, 1.015, 1.015]}>
        <meshBasicMaterial
          ref={wireMaterialRef}
          color="#FF2D55"
          wireframe
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Central Defensive Monogram / Core Emblem */}
      <mesh position={[0, 0, 0.15]}>
        <ringGeometry args={[0.35, 0.42, 32]} />
        <meshBasicMaterial
          color="#FF5575"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh position={[0, 0, 0.15]}>
        <ringGeometry args={[0.6, 0.62, 4]} />
        <meshBasicMaterial
          color="#FF2D55"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Revolving Hologram Energy Rings */}
      <mesh
        ref={ring1Ref}
        rotation={[Math.PI / 2.3, 0.2, 0]}
        position={[0, 0, 0]}
      >
        <torusGeometry args={[1.9, 0.007, 16, 120]} />
        <meshBasicMaterial
          color="#FF2D55"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh
        ref={ring2Ref}
        rotation={[0.4, 0.3, Math.PI / 3]}
        position={[0, 0, 0]}
      >
        <torusGeometry args={[2.1, 0.005, 16, 120]} />
        <meshBasicMaterial
          color="#FF5575"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

