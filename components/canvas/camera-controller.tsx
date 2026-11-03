"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Waypoint {
  progress: number;
  pos: [number, number, number];
  target: [number, number, number];
}

// 5 Strategic narrative waypoints along the classified scroll journey
const WAYPOINTS: Waypoint[] = [
  { progress: 0.0, pos: [0, 0, 7.0], target: [0, 0, 0] }, // Hero: Centered perspective
  { progress: 0.25, pos: [-1.4, -1.8, 6.2], target: [0.6, -1.2, 0] }, // About: Off-axis intelligence angle
  { progress: 0.5, pos: [1.6, -3.8, 6.4], target: [-0.6, -3.2, 0] }, // Arsenal: Counter-axis telemetry angle
  { progress: 0.75, pos: [0, -5.8, 6.8], target: [0, -5.2, 0] }, // Projects: Holographic showcase overview
  { progress: 1.0, pos: [0, -7.8, 5.8], target: [0, -7.4, 0] }, // Contact/Terminal: Intimate terminal focal
];

interface CameraControllerProps {
  reducedMotion?: boolean;
}

export default function CameraController({
  reducedMotion = false,
}: CameraControllerProps) {
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetPos = useRef(new THREE.Vector3(0, 0, 7));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [reducedMotion]);

  useFrame((state, delta) => {
    // Determine scroll progress directly from DOM to avoid React re-renders
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const docHeight =
      typeof window !== "undefined"
        ? document.documentElement.scrollHeight - window.innerHeight
        : 1;
    const progress =
      docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;

    // Find bounding waypoints
    let startIndex = 0;
    for (let i = 0; i < WAYPOINTS.length - 1; i++) {
      if (
        progress >= WAYPOINTS[i].progress &&
        progress <= WAYPOINTS[i + 1].progress
      ) {
        startIndex = i;
        break;
      }
    }
    const nextIndex = Math.min(startIndex + 1, WAYPOINTS.length - 1);

    const wStart = WAYPOINTS[startIndex];
    const wEnd = WAYPOINTS[nextIndex];
    const segmentSpan = wEnd.progress - wStart.progress || 1;
    const tRaw = (progress - wStart.progress) / segmentSpan;
    // Smooth cosine interpolation between waypoints
    const t = 0.5 - 0.5 * Math.cos(tRaw * Math.PI);

    targetPos.current.set(
      THREE.MathUtils.lerp(wStart.pos[0], wEnd.pos[0], t),
      THREE.MathUtils.lerp(wStart.pos[1], wEnd.pos[1], t),
      THREE.MathUtils.lerp(wStart.pos[2], wEnd.pos[2], t)
    );

    targetLook.current.set(
      THREE.MathUtils.lerp(wStart.target[0], wEnd.target[0], t),
      THREE.MathUtils.lerp(wStart.target[1], wEnd.target[1], t),
      THREE.MathUtils.lerp(wStart.target[2], wEnd.target[2], t)
    );

    // Apply subtle mouse parallax if reduced motion is disabled
    let parallaxX = 0;
    let parallaxY = 0;

    if (!reducedMotion) {
      mouse.current.x = THREE.MathUtils.damp(
        mouse.current.x,
        mouse.current.targetX,
        3.5,
        delta
      );
      mouse.current.y = THREE.MathUtils.damp(
        mouse.current.y,
        mouse.current.targetY,
        3.5,
        delta
      );

      parallaxX = mouse.current.x * 0.35;
      parallaxY = mouse.current.y * 0.25;
    }

    // Access live scene camera from frame state argument to satisfy React 19 immutability rules
    const activeCamera = state.camera;

    activeCamera.position.x = THREE.MathUtils.damp(
      activeCamera.position.x,
      targetPos.current.x + parallaxX,
      3.2,
      delta
    );
    activeCamera.position.y = THREE.MathUtils.damp(
      activeCamera.position.y,
      targetPos.current.y + parallaxY,
      3.2,
      delta
    );
    activeCamera.position.z = THREE.MathUtils.damp(
      activeCamera.position.z,
      targetPos.current.z,
      3.2,
      delta
    );

    currentLookAt.current.x = THREE.MathUtils.damp(
      currentLookAt.current.x,
      targetLook.current.x + parallaxX * 0.4,
      3.2,
      delta
    );
    currentLookAt.current.y = THREE.MathUtils.damp(
      currentLookAt.current.y,
      targetLook.current.y + parallaxY * 0.4,
      3.2,
      delta
    );
    currentLookAt.current.z = THREE.MathUtils.damp(
      currentLookAt.current.z,
      targetLook.current.z,
      3.2,
      delta
    );

    activeCamera.lookAt(currentLookAt.current);
  });

  return null;
}
