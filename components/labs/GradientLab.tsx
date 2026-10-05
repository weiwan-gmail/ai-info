"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useState } from "react";
import * as THREE from "three";
import { LabFrame } from "./LabFrame";

function height(x: number, z: number) {
  return 0.22 * (x * x + 0.62 * z * z);
}

function Surface() {
  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(4.2, 4.2, 36, 36);
    geom.rotateX(-Math.PI / 2);
    const position = geom.attributes.position;
    for (let i = 0; i < position.count; i += 1) {
      const x = position.getX(i);
      const z = position.getZ(i);
      position.setY(i, height(x, z));
    }
    geom.computeVertexNormals();
    return geom;
  }, []);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#d7c4a2" wireframe />
    </mesh>
  );
}

export function GradientLab() {
  const [spot, setSpot] = useState({ x: 1.35, z: 1.05 });
  const [rate, setRate] = useState(0.35);
  const loss = height(spot.x, spot.z);

  function step() {
    setSpot((current) => ({
      x: current.x - rate * 0.44 * current.x,
      z: current.z - rate * 0.27 * current.z,
    }));
  }

  return (
    <LabFrame
      title="损失曲面上的一步"
      hint="步长越大，下得越猛，也越容易跨过谷底"
      footer={
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" onClick={step} className="rounded-full bg-ink px-4 py-1.5 text-paper">
            迈一步
          </button>
          <label className="flex items-center gap-2 text-xs">
            步长 {rate.toFixed(2)}
            <input type="range" min={0.05} max={1.4} step={0.05} value={rate} onChange={(event) => setRate(Number(event.target.value))} />
          </label>
          <button type="button" className="text-xs text-copper" onClick={() => setSpot({ x: 1.35, z: 1.05 })}>
            回到山坡
          </button>
          <span className="ml-auto font-mono text-xs">损失 {loss.toFixed(3)}</span>
        </div>
      }
    >
      <div className="h-80">
        <Canvas camera={{ position: [3.2, 2.4, 3.2], fov: 42 }}>
          <color attach="background" args={["#f7f3ea"]} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[2, 4, 1]} intensity={1.1} />
          <Surface />
          <mesh position={[spot.x, height(spot.x, spot.z) + 0.12, spot.z]}>
            <sphereGeometry args={[0.1, 24, 24]} />
            <meshStandardMaterial color="#9a4e24" />
          </mesh>
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>
    </LabFrame>
  );
}
