"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ThreatMatrixProps {
  reducedMotion?: boolean;
}

// Deterministic pseudo-random number generator ensuring React 19 purity
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed + 9.876) * 43758.5453123;
  return x - Math.floor(x);
}

export default function ThreatMatrix3D({
  reducedMotion = false,
}: ThreatMatrixProps) {
  const groupRef = useRef<THREE.Group>(null);
  const linesMaterialRef = useRef<THREE.LineBasicMaterial>(null);

  // Generate 36 spatial cyber nodes clustered along the middle journey
  const { nodePositions, lineGeometry } = useMemo(() => {
    const nodeCount = 36;
    const positions: THREE.Vector3[] = [];

    // Clustered deterministically in a cylindrical cyber topology
    for (let i = 0; i < nodeCount; i++) {
      const r1 = pseudoRandom(i * 4 + 1);
      const r2 = pseudoRandom(i * 4 + 2);
      const r3 = pseudoRandom(i * 4 + 3);
      const r4 = pseudoRandom(i * 4 + 4);

      const radius = 2.2 + r1 * 2.8;
      const angle = (i / nodeCount) * Math.PI * 2 + (r2 - 0.5) * 0.4;
      const x = Math.cos(angle) * radius;
      const y = (r3 - 0.5) * 6 - 2.5; // Centered around Y = -2.5
      const z = Math.sin(angle) * radius * 0.8 + (r4 - 0.5) * 1.5;

      positions.push(new THREE.Vector3(x, y, z));
    }

    // Connect nodes within proximity threshold
    const linePoints: THREE.Vector3[] = [];
    const maxDistance = 2.8;

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dist = positions[i].distanceTo(positions[j]);
        if (dist < maxDistance) {
          linePoints.push(positions[i]);
          linePoints.push(positions[j]);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);

    return {
      nodePositions: positions,
      lineGeometry: lineGeo,
    };
  }, []);

  const nodeGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(nodePositions);
  }, [nodePositions]);

  useFrame((state, delta) => {
    if (!groupRef.current || reducedMotion) return;

    // Slow organic rotation
    groupRef.current.rotation.y += delta * 0.04;
    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.2) * 0.06;

    // Pulsing line opacity representing dynamic network traffic
    if (linesMaterialRef.current) {
      linesMaterialRef.current.opacity =
        0.28 + Math.sin(state.clock.elapsedTime * 2.5) * 0.12;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, -0.5]}>
      {/* Network connection lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          ref={linesMaterialRef}
          color="#FF2D55"
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Network node vertices */}
      <points geometry={nodeGeometry}>
        <pointsMaterial
          color="#FF5575"
          size={0.16}
          sizeAttenuation
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Primary security perimeter rings */}
      <mesh rotation={[Math.PI / 2.2, 0.1, 0]} position={[0, -2.5, 0]}>
        <torusGeometry args={[3.8, 0.008, 16, 120]} />
        <meshBasicMaterial
          color="#FF2D55"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh rotation={[0.4, 0.2, Math.PI / 3]} position={[0, -2.5, 0]}>
        <torusGeometry args={[4.4, 0.005, 16, 120]} />
        <meshBasicMaterial
          color="#A8002B"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
