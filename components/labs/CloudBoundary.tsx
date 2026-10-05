"use client";

import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { LabFrame } from "./LabFrame";

type CloudScene = {
  slug: string;
  title: string;
  icon: string;
  accent: string;
  status: string;
  strap: string;
  hot: "shared" | "many";
  body: string;
  room: string;
  identity: string;
  approval: string;
  queue: string[];
  note: string;
  localLabel: string;
  roomLabel: string;
  extraLabel: string;
};

const copy: Record<string, CloudScene> = {
  grok: {
    slug: "grok-bot",
    title: "Grok Bot",
    icon: "✦",
    accent: "bg-[#f2d36b] text-[#211b0d]",
    status: "共享空间",
    strap: "多个 Bot → 一台云电脑",
    hot: "shared",
    body: "多个 Bot 按角色分工，但同一用户的 Bot 站在同一台云电脑上。再开一个 Bot，并不多出一堵隔离墙。",
    room: "同一台云电脑",
    identity: "Bot 角色",
    approval: "聊天里确认",
    queue: ["Bot A / 手册", "Bot B / 周报", "同一份文件区"],
    note: "协作方便，隔离边界在用户，不在 Bot。",
    localLabel: "你的设备",
    roomLabel: "同一台云电脑",
    extraLabel: "另一个 Bot",
  },
  muse: {
    slug: "muse",
    title: "Muse",
    icon: "M",
    accent: "bg-[#b8d4e8] text-[#17344a]",
    status: "专用 VM",
    strap: "一个人 → 一台安全 VM",
    hot: "shared",
    body: "一个人一台安全虚拟机。出站动作要经过单独的审批边界。公开材料里的可用地区有限，出发前看官网。",
    room: "Muse Secure VM",
    identity: "个人管家",
    approval: "Sentinel 审批",
    queue: ["收件箱", "浏览器", "出站审批"],
    note: "重点是专用电脑和出站审批，不是 Bot 数量。",
    localLabel: "你的设备",
    roomLabel: "专用安全 VM",
    extraLabel: "审批哨兵",
  },
  manus: {
    slug: "manus",
    title: "Manus",
    icon: "M·",
    accent: "bg-[#d6c4ef] text-[#3d285f]",
    status: "长期运行",
    strap: "任务 → 可持久云电脑",
    hot: "shared",
    body: "长时间任务住在云电脑里。它和 Cue 不是同一个产品：这里的电脑是为任务准备的，不是每个代理一张身份证。",
    room: "持久 Cloud Computer",
    identity: "任务代理",
    approval: "接管 / 停机",
    queue: ["任务队列", "Ubuntu / scripts", "24/7 运行"],
    note: "重点是任务跑得久，文件和进程可以留下来。",
    localLabel: "你的设备",
    roomLabel: "持久云电脑",
    extraLabel: "任务进程",
  },
  cue: {
    slug: "cue",
    title: "Cue",
    icon: "↗",
    accent: "bg-[#b9dfc7] text-[#164a2e]",
    status: "代理身份",
    strap: "代理 A / B → 各自身份",
    hot: "many",
    body: "每个个人代理可以有自己的邮箱、电话、钱包和电脑。邀请范围和配额若官网没写，就保持未知。",
    room: "代理自己的电脑",
    identity: "邮箱 · 电话 · 钱包",
    approval: "逐次授权",
    queue: ["会议代理", "邮箱地址", "支付限额"],
    note: "重点不是聊天窗口，而是每个代理能代表谁行动。",
    localLabel: "你的设备",
    roomLabel: "代理 A 的电脑",
    extraLabel: "代理 B",
  },
  yuanbao: {
    slug: "yuanbao",
    title: "腾讯元宝",
    icon: "元",
    accent: "bg-[#f3b8ae] text-[#5b211b]",
    status: "办公交付",
    strap: "一句话 → 文档 / 表格 / PPT",
    hot: "shared",
    body: "它交付的是幻灯片、文档、表格和网页。若动作发生在云浏览器里，机制到 Browser Use 那一章，不和 WorkBuddy 的编程循环混在一起。",
    room: "产品内任务空间",
    identity: "办公助手",
    approval: "产品流程",
    queue: ["幻灯片", "表格", "网页交付"],
    note: "重点是交付物长什么样，不是给每个代理造一台电脑。",
    localLabel: "你的设备",
    roomLabel: "任务空间",
    extraLabel: "交付物",
  },
};

function IconMark({ scene, small = false }: { scene: CloudScene; small?: boolean }) {
  return <span className={`inline-flex shrink-0 items-center justify-center rounded-xl font-mono font-semibold shadow-sm ${small ? "h-7 w-7 text-xs" : "h-10 w-10 text-base"} ${scene.accent}`}>{scene.icon}</span>;
}

function MiniScreenshot({ scene }: { scene: CloudScene }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-[#fffdf8] shadow-[0_12px_30px_rgba(52,37,21,0.08)]">
      <div className="flex items-center gap-2 border-b border-line bg-panel/70 px-3 py-2">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-[#d58c7f]" />
          <span className="h-2 w-2 rounded-full bg-[#d6ad5f]" />
          <span className="h-2 w-2 rounded-full bg-[#91b68d]" />
        </div>
        <IconMark scene={scene} small />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-medium">{scene.title}</p>
          <p className="truncate font-mono text-[9px] text-ink/45">{scene.strap}</p>
        </div>
        <span className="rounded-full bg-sand px-2 py-1 font-mono text-[9px] text-copper">{scene.status}</span>
      </div>
      <div className="grid grid-cols-[5.5rem_1fr] gap-3 p-3 text-[10px]">
        <div className="space-y-1 border-r border-line pr-2">
          <p className="font-mono text-[8px] tracking-widest text-ink/40">WORKSPACE</p>
          {scene.queue.map((item, index) => (
            <div key={item} className={`rounded-md px-2 py-1.5 ${index === 0 ? "bg-panel text-ink" : "text-ink/55"}`}>
              {item}
            </div>
          ))}
        </div>
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2 border-b border-line pb-2">
            <span className="truncate font-medium">{scene.room}</span>
            <span className="shrink-0 text-[9px] text-[#56826a]">● 在线</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-panel/70 p-2">
              <p className="font-mono text-[8px] text-ink/40">身份</p>
              <p className="mt-1 truncate text-ink/75">{scene.identity}</p>
            </div>
            <div className="rounded-lg bg-panel/70 p-2">
              <p className="font-mono text-[8px] text-ink/40">边界</p>
              <p className="mt-1 truncate text-ink/75">{scene.approval}</p>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-copper" style={{ width: scene.hot === "many" ? "78%" : "56%" }} />
          </div>
          <p className="mt-2 truncate text-ink/50">{scene.note}</p>
        </div>
      </div>
    </div>
  );
}

function ComparisonCard({ scene, active }: { scene: CloudScene; active: boolean }) {
  return (
    <Link href={`/tools/${scene.slug}`} className={`block rounded-xl border p-2 transition hover:-translate-y-0.5 hover:border-copper ${active ? "border-copper bg-sand" : "border-line bg-panel/40"}`}>
      <div className="flex items-center gap-2">
        <IconMark scene={scene} small />
        <div className="min-w-0">
          <p className="truncate text-xs font-medium">{scene.title}</p>
          <p className="truncate text-[10px] text-ink/55">{scene.status}</p>
        </div>
      </div>
      <p className="mt-2 min-h-8 text-[10px] leading-4 text-ink/70">{scene.strap}</p>
    </Link>
  );
}

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
  const scenes = Object.values(copy);
  return (
    <LabFrame title={`${scene.title} · 云端边界`} hint="拖动下方空间可旋转" footer={<p>{scene.body}</p>}>
      <div className="space-y-4 p-4">
        <div className="grid gap-4 md:grid-cols-[1.08fr_0.92fr] md:items-start">
          <MiniScreenshot scene={scene} />
          <div className="rounded-xl border border-line bg-panel/45 p-4">
            <div className="flex items-start gap-3">
              <IconMark scene={scene} />
              <div className="min-w-0">
                <p className="font-serif text-lg">{scene.strap}</p>
                <p className="mt-1 text-sm leading-6 text-ink/65">{scene.note}</p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-sand p-2">
                <dt className="font-mono text-[9px] tracking-widest text-ink/40">电脑</dt>
                <dd className="mt-1 text-ink/80">{scene.room}</dd>
              </div>
              <div className="rounded-lg bg-sand p-2">
                <dt className="font-mono text-[9px] tracking-widest text-ink/40">对外身份</dt>
                <dd className="mt-1 text-ink/80">{scene.identity}</dd>
              </div>
              <div className="rounded-lg bg-sand p-2">
                <dt className="font-mono text-[9px] tracking-widest text-ink/40">关键边界</dt>
                <dd className="mt-1 text-ink/80">{scene.approval}</dd>
              </div>
              <div className="rounded-lg bg-sand p-2">
                <dt className="font-mono text-[9px] tracking-widest text-ink/40">工作对象</dt>
                <dd className="mt-1 text-ink/80">{scene.queue[0]}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <p className="font-mono text-[10px] tracking-[0.18em] text-copper">五种云端代理，先看这一行</p>
            <p className="text-[10px] text-ink/45">点击卡片切换章节</p>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            {scenes.map((item) => <ComparisonCard key={item.slug} scene={item} active={item.slug === scene.slug} />)}
          </div>
        </div>

        <div className="border-t border-line pt-3">
          <p className="mb-1 font-mono text-[10px] tracking-[0.18em] text-copper">空间结构 · 可旋转示意</p>
        </div>
        <div className="h-72">
        <Canvas camera={{ position: [4.2, 2.4, 4.4], fov: 40 }}>
          <color attach="background" args={["#f7f3ea"]} />
          <ambientLight intensity={0.75} />
          <directionalLight position={[3, 4, 2]} intensity={1.2} />
          <Box position={[-1.8, 0, 0]} color="#d9cbb6" label={scene.localLabel} hot={false} />
          <Box position={[0.2, 0, 0]} color={scene.hot === "shared" ? "#c47a45" : "#efe6d6"} label={scene.roomLabel} hot={scene.hot === "shared"} />
          <Box position={[2.05, 0.35, 0.2]} color={scene.hot === "many" ? "#c47a45" : "#efe6d6"} label={scene.hot === "many" ? scene.roomLabel : scene.extraLabel} hot={scene.hot === "many"} />
          <Box position={[2.05, -0.15, -0.85]} color={scene.hot === "many" ? "#e0b184" : "#f3ece1"} label={scene.hot === "many" ? scene.extraLabel : "审批 / 任务"} hot={scene.hot === "many"} />
          <OrbitControls enablePan={false} />
        </Canvas>
        </div>
      </div>
    </LabFrame>
  );
}
