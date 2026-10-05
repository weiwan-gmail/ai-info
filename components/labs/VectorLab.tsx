"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { LabFrame } from "./LabFrame";

type Word = { id: string; label: string; color: string; at: [number, number, number] };

const initial: Word[] = [
  { id: "cat", label: "相电流", color: "#9a4e24", at: [1.15, 0.72, 0.25] },
  { id: "tiger", label: "母线纹波", color: "#c47a45", at: [1.55, 1.05, 0.15] },
  { id: "fish", label: "机壳温度", color: "#3d6b8c", at: [-1.35, -0.55, 0.7] },
];

function cosine(a: number[], b: number[]) {
  const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const na = Math.hypot(a[0], a[1], a[2]);
  const nb = Math.hypot(b[0], b[1], b[2]);
  if (na < 1e-5 || nb < 1e-5) return 0;
  return dot / (na * nb);
}

function Draggable({
  word,
  onMove,
}: {
  word: Word;
  onMove: (id: string, at: [number, number, number]) => void;
}) {
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const { camera, size, controls } = useThree();

  return (
    <mesh
      position={word.at}
      onPointerDown={(event) => {
        event.stopPropagation();
        dragging.current = true;
        last.current = { x: event.clientX, y: event.clientY };
        (event.nativeEvent.target as Element).setPointerCapture?.(event.pointerId);
        const orbit = controls as { enabled?: boolean } | null;
        if (orbit) orbit.enabled = false;
      }}
      onPointerUp={() => {
        dragging.current = false;
        const orbit = controls as { enabled?: boolean } | null;
        if (orbit) orbit.enabled = true;
      }}
      onPointerMove={(event) => {
        if (!dragging.current) return;
        const dx = ((event.clientX - last.current.x) / size.width) * 5.2;
        const dy = (-(event.clientY - last.current.y) / size.height) * 3.6;
        const right = new THREE.Vector3();
        const up = new THREE.Vector3();
        const forward = new THREE.Vector3();
        camera.matrixWorld.extractBasis(right, up, forward);
        const next = new THREE.Vector3(...word.at).addScaledVector(right, dx).addScaledVector(up, dy);
        onMove(word.id, [next.x, next.y, next.z]);
        last.current = { x: event.clientX, y: event.clientY };
      }}
    >
      <sphereGeometry args={[0.16, 28, 28]} />
      <meshStandardMaterial color={word.color} />
      <Html center distanceFactor={9} position={[0, 0.28, 0]} style={{ pointerEvents: "none" }}>
        <span className="whitespace-nowrap rounded bg-paper/90 px-1.5 py-0.5 text-xs text-ink">{word.label}</span>
      </Html>
    </mesh>
  );
}

export function VectorLab() {
  const [words, setWords] = useState(initial);
  const byId = (id: string) => words.find((word) => word.id === id)?.at ?? [0, 0, 0];
  const catTiger = cosine(byId("cat"), byId("tiger"));
  const catFish = cosine(byId("cat"), byId("fish"));
  const axes = useMemo(
    () => [
      [
        [-2, 0, 0],
        [2, 0, 0],
      ],
      [
        [0, -1.5, 0],
        [0, 1.5, 0],
      ],
      [
        [0, 0, -1.5],
        [0, 0, 1.5],
      ],
    ] as [number, number, number][][],
    [],
  );

  return (
    <LabFrame title="三维词空间" hint="拖动圆球，轨道可旋转" footer={<Similarity catTiger={catTiger} catFish={catFish} />}>
      <div className="h-80">
        <Canvas camera={{ position: [2.4, 1.6, 3.2], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 4, 2]} intensity={1.2} />
          {axes.map((points) => (
            <Line key={points[0].join()} points={points} color="#c9b89a" lineWidth={1} />
          ))}
          {words.map((word) => (
            <group key={word.id}>
              <Line points={[[0, 0, 0], word.at]} color={word.color} lineWidth={1.4} />
              <Draggable
                word={word}
                onMove={(id, at) => setWords((current) => current.map((item) => (item.id === id ? { ...item, at } : item)))}
              />
            </group>
          ))}
          <OrbitControls makeDefault enablePan={false} />
        </Canvas>
      </div>
    </LabFrame>
  );
}

function Similarity({ catTiger, catFish }: { catTiger: number; catFish: number }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Meter label="相电流 · 母线纹波" value={catTiger} />
      <Meter label="相电流 · 机壳温度" value={catFish} />
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  const width = `${Math.round(((value + 1) / 2) * 100)}%`;
  return (
    <div>
      <div className="flex justify-between font-mono text-xs">
        <span>{label}</span>
        <span>{value.toFixed(2)}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-line">
        <div className="h-1.5 rounded-full bg-copper" style={{ width }} />
      </div>
    </div>
  );
}
