"use client";

import { useState } from "react";
import { LabFrame } from "./LabFrame";

const loop = [
  { title: "设定", body: "把目标电流和单位写在仓库里。代理后面所有改动都对着这个数，不对着一句口头描述。" },
  { title: "误差", body: "实测减去设定。单位不一致时，先改换算，不要先改环路。" },
  { title: "调节", body: "比例和积分一次只动一个。另一个保持上次实测还能复现的值。" },
  { title: "限幅", body: "输出先经过限幅，再变成占空比。限幅的单位要和调节器输出的单位相同。" },
  { title: "采样", body: "采样电阻、放大倍数和 ADC 满量程写在同一处。照片里的波形不能代替这三个数。" },
];

export function LoopSvg() {
  const [step, setStep] = useState(0);
  return (
    <LabFrame title="电流环上哪一拍可以交给代理" hint="点一拍看做法" footer={<p>{loop[step].body}</p>}>
      <svg viewBox="0 0 760 150" className="w-full">
        {loop.map((item, index) => {
          const x = 24 + index * 148;
          const on = index === step;
          return (
            <g key={item.title} onClick={() => setStep(index)} className="cursor-pointer">
              {index < loop.length - 1 ? <path d={`M ${x + 112} 58 H ${x + 140}`} stroke="#9a4e24" strokeWidth="1.4" markerEnd="url(#arrow)" /> : <path d="M 700 86 C 720 120, 40 120, 70 86" fill="none" stroke="#c4b39a" strokeDasharray="4 3" />}
              <rect x={x} y="36" width="112" height="44" rx="10" fill={on ? "#9a4e24" : "#f7f3ea"} stroke="#9a4e24" />
              <text x={x + 56} y="63" textAnchor="middle" fontSize="14" fill={on ? "#f3efe4" : "#1a1714"}>
                {item.title}
              </text>
            </g>
          );
        })}
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="#9a4e24" />
          </marker>
        </defs>
      </svg>
    </LabFrame>
  );
}

const lanes = [
  { title: "人先定", body: "器件、功率回路、栅极驱动和敏感模拟。这些网络不交给自动布线。" },
  { title: "脚本与 MCP", body: "批量改网名、跑电气检查、导出料单。适合重复、可核对的动作。" },
  { title: "云上布线", body: "Flux 从描述起一版。Quilter 在已有原理图上给出带物理检查的候选。候选要人审。" },
];

export function BoardSvg() {
  const [lane, setLane] = useState(0);
  return (
    <LabFrame title="一块板分成三条作业带" hint="点一条看谁动手" footer={<p>{lanes[lane].body}</p>}>
      <svg viewBox="0 0 720 168" className="w-full">
        {lanes.map((item, index) => (
          <g key={item.title} onClick={() => setLane(index)} className="cursor-pointer">
            <rect x="36" y={16 + index * 50} width="200" height="36" rx="8" fill={lane === index ? "#9a4e24" : "#f7f3ea"} stroke="#9a4e24" />
            <text x="136" y={39 + index * 50} textAnchor="middle" fontSize="14" fill={lane === index ? "#f3efe4" : "#1a1714"}>
              {item.title}
            </text>
            <path d={`M 246 ${34 + index * 50} H 330`} stroke="#c4b39a" />
          </g>
        ))}
        <rect x="340" y="28" width="150" height="112" rx="12" fill="none" stroke="#9a4e24" strokeDasharray="5 4" />
        <text x="415" y="78" textAnchor="middle" fontSize="14" fill="#1a1714">
          原理图
        </text>
        <text x="415" y="100" textAnchor="middle" fontSize="12" fill="#9a4e24">
          功率级停在这里
        </text>
        <path d="M 500 84 H 560" stroke="#9a4e24" />
        <rect x="568" y="62" width="120" height="44" rx="8" fill="#1a1714" />
        <text x="628" y="89" textAnchor="middle" fontSize="14" fill="#f3efe4">
          人审
        </text>
      </svg>
    </LabFrame>
  );
}

export function ShellSvg() {
  const [part, setPart] = useState<"board" | "shell" | "hole">("board");
  const copy = {
    board: "先导出板框和器件高度。连接器方向在这一步就已经定了，外壳去迁就它。",
    shell: "外壳草案可以生成。它只提供壁厚和外形，不决定安装孔和散热路径。",
    hole: "安装孔、螺钉能不能拧到、线从哪出，逐项由人定。代理只改你点名的那几条尺寸。",
  };
  return (
    <LabFrame title="板子放进外壳时看三处" hint="点板、壳或孔" footer={<p>{copy[part]}</p>}>
      <svg viewBox="0 0 640 200" className="w-full">
        <g onClick={() => setPart("shell")} className="cursor-pointer">
          <rect x="80" y="24" width="360" height="150" rx="16" fill={part === "shell" ? "#f3e2d2" : "none"} stroke="#9a4e24" strokeWidth="3" />
        </g>
        <g onClick={() => setPart("board")} className="cursor-pointer">
          <rect x="140" y="70" width="220" height="70" rx="4" fill={part === "board" ? "#9a4e24" : "#e7d7c0"} stroke="#1a1714" />
          <text x="250" y="110" textAnchor="middle" fontSize="14" fill={part === "board" ? "#f3efe4" : "#1a1714"}>
            板
          </text>
        </g>
        <g onClick={() => setPart("hole")} className="cursor-pointer">
          <circle cx="168" cy="92" r="8" fill={part === "hole" ? "#1a1714" : "#f7f3ea"} stroke="#1a1714" />
          <circle cx="332" cy="92" r="8" fill={part === "hole" ? "#1a1714" : "#f7f3ea"} stroke="#1a1714" />
          <rect x="300" y="78" width="28" height="16" fill="#c47a45" />
        </g>
      </svg>
    </LabFrame>
  );
}

const bench = [
  { title: "探头", body: "写下探头在哪一个管脚、用的哪一档。没有位置的波形，不能拿去对源码。" },
  { title: "触发", body: "时基和触发电平写进记录。代理看不见示波器旋钮。" },
  { title: "串口", body: "贴一段带时间的串口，并写明单位。不要只贴一张照片。" },
  { title: "对照", body: "代理只指出哪一个换算对不上。改完回到仪器，看波形是否真的变了。" },
];

export function BenchSvg() {
  const [step, setStep] = useState(0);
  return (
    <LabFrame title="从仪器回到仓库" hint="按顺序点" footer={<p>{bench[step].body}</p>}>
      <svg viewBox="0 0 680 120" className="w-full">
        {bench.map((item, index) => {
          const x = 30 + index * 165;
          const on = index === step;
          return (
            <g key={item.title} onClick={() => setStep(index)} className="cursor-pointer">
              <circle cx={x + 40} cy="46" r="22" fill={on ? "#9a4e24" : "#f7f3ea"} stroke="#9a4e24" strokeWidth="2" />
              <text x={x + 40} y="51" textAnchor="middle" fontSize="14" fill={on ? "#f3efe4" : "#1a1714"}>
                {index + 1}
              </text>
              <text x={x + 40} y="92" textAnchor="middle" fontSize="14" fill="#1a1714">
                {item.title}
              </text>
              {index < bench.length - 1 ? <path d={`M ${x + 66} 46 H ${x + 120}`} stroke="#c4b39a" /> : null}
            </g>
          );
        })}
      </svg>
    </LabFrame>
  );
}
