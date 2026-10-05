"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Flow() {
  const count = 90;
  const ref = useRef<THREE.Points>(null);
  const seeds = useMemo(() => Array.from({ length: count }, () => Math.random()), []);
  const positions = useMemo(() => new Float32Array(count * 3), []);

  useFrame(({ clock }) => {
    const points = ref.current;
    if (!points) return;
    const t = clock.elapsedTime;
    const array = points.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i += 1) {
      const z = ((seeds[i] + t * (0.12 + seeds[(i + 3) % count] * 0.18)) % 1) * 9 - 4.5;
      array[i * 3] = Math.sin(seeds[i] * 8 + z * 0.7) * 0.85;
      array[i * 3 + 1] = Math.cos(seeds[i] * 5 + z * 0.45) * 0.55;
      array[i * 3 + 2] = z;
    }
    points.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e3b15a" size={0.045} sizeAttenuation />
    </points>
  );
}

function Layers() {
  return (
    <group>
      {[-2.6, -1.3, 0, 1.3, 2.6].map((z) => (
        <mesh key={z} position={[0, 0, z]}>
          <boxGeometry args={[2.5, 1.7, 0.06]} />
          <meshStandardMaterial color="#c47a45" transparent opacity={0.28} metalness={0.2} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0.15, 6.2], fov: 42 }} dpr={[1, 1.6]} gl={{ antialias: true }}>
      <color attach="background" args={["#14110e"]} />
      <ambientLight intensity={0.55} />
      <pointLight position={[3, 2, 4]} intensity={18} color="#e7c08a" />
      <Layers />
      <Flow />
    </Canvas>
  );
}
