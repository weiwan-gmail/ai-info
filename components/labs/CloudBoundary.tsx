"use client";

import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { LabFrame } from "./LabFrame";

const copy: Record<string, { title: string; body: string; hot: string }> = {
  grok: {
    title: "Grok Bot",
    hot: "shared",
    body: "多个 Bot 按角色分工，但同一用户的 Bot 站在同一台云电脑上。再开一个 Bot，并不多出一堵隔离墙。",
  },
  muse: {
    title: "Muse",
    hot: "shared",
    body: "一个人一台安全虚拟机。出站动作要经过单独的审批边界。公开材料里的可用地区有限，出发前看官网。",
  },
  manus: {
    title: "Manus",
    hot: "shared",
    body: "长时间任务住在云电脑里。它和 Cue 不是同一个产品：这里的电脑是为任务准备的，不是每个代理一张身份证。",
  },
  cue: {
    title: "Cue",
    hot: "many",
    body: "每个个人代理可以有自己的邮箱、电话、钱包和电脑。邀请范围和配额若官网没写，就保持未知。",
  },
  yuanbao: {
    title: "腾讯元宝",
    hot: "shared",
    body: "它交付的是幻灯片、文档、表格和网页。若动作发生在云浏览器里，机制到 Browser Use 那一章，不和 WorkBuddy 的编程循环混在一起。",
  },
};

function Box({
  position,
  color,
  label,
  hot,
}: {
  position: [number, number, number];
  color: string;
  label: string;
  hot: boolean;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1.15, 0.72, 0.82]} />
      <meshStandardMaterial color={color} emissive={hot ? "#9a4e24" : "#000"} emissiveIntensity={hot ? 0.35 : 0} />
      <Html center position={[0, 0.62, 0]} style={{ pointerEvents: "none" }}>
        <span className={`whitespace-nowrap text-xs ${hot ? "text-copper" : "text-ink/70"}`}>{label}</span>
      </Html>
    </mesh>
  );
}

export function CloudBoundary({ highlight = "grok" }: { highlight?: string }) {
  const scene = copy[highlight] ?? copy.grok;
  return (
    <LabFrame title={scene.title} hint="拖动可旋转" footer={<p>{scene.body}</p>}>
      <div className="h-72">
        <Canvas camera={{ position: [4.2, 2.4, 4.4], fov: 40 }}>
          <color attach="background" args={["#f7f3ea"]} />
          <ambientLight intensity={0.75} />
          <directionalLight position={[3, 4, 2]} intensity={1.2} />
          <Box position={[-1.8, 0, 0]} color="#d9cbb6" label="你的笔记本" hot={false} />
          <Box position={[0.2, 0, 0]} color={scene.hot === "shared" ? "#c47a45" : "#efe6d6"} label="账号共享的云电脑" hot={scene.hot === "shared"} />
          <Box position={[2.05, 0.35, 0.2]} color={scene.hot === "many" ? "#c47a45" : "#efe6d6"} label="代理自己的电脑" hot={scene.hot === "many"} />
          <Box position={[2.05, -0.15, -0.85]} color={scene.hot === "many" ? "#e0b184" : "#f3ece1"} label="另一个代理" hot={scene.hot === "many"} />
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>
    </LabFrame>
  );
}
