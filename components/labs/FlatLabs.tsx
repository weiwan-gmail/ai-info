"use client";

import { useMemo, useState } from "react";
import { LabFrame } from "./LabFrame";

export function MatrixLab() {
  const presets = [
    { name: "原样", m: [1, 0, 0, 1] },
    { name: "旋转", m: [0.7, -0.7, 0.7, 0.7] },
    { name: "拉宽", m: [1.6, 0, 0, 0.7] },
    { name: "错切", m: [1, 0.6, 0, 1] },
  ];
  const [index, setIndex] = useState(0);
  const [a, b, c, d] = presets[index].m;
  const dots = useMemo(() => {
    const points: { x: number; y: number }[] = [];
    for (let x = -2; x <= 2; x += 1) {
      for (let y = -2; y <= 2; y += 1) points.push({ x, y });
    }
    return points;
  }, []);
  const project = (x: number, y: number) => ({ x: 90 + (a * x + b * y) * 22, y: 90 - (c * x + d * y) * 22 });

  return (
    <LabFrame title="矩阵搬动整片空间" hint="同一个格子，四种线性变换" footer={<p>直线还是直线，原点还在原点。神经网络若只有这种变换叠在一起，弯折永远不会出现。</p>}>
      <div className="flex flex-wrap gap-2 px-4 pt-4">
        {presets.map((preset, presetIndex) => (
          <button key={preset.name} type="button" onClick={() => setIndex(presetIndex)} className={`rounded-full px-3 py-1 text-sm ${presetIndex === index ? "bg-ink text-paper" : "border border-line"}`}>
            {preset.name}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 180 180" className="mx-auto h-64 w-full max-w-sm">
        {dots.map((dot) => {
          const at = project(dot.x, dot.y);
          return <circle key={`${dot.x}-${dot.y}`} cx={at.x} cy={at.y} r="3.2" fill="#9a4e24" />;
        })}
      </svg>
    </LabFrame>
  );
}

export function SoftmaxLab() {
  const [logits, setLogits] = useState([1.2, 0.4, -0.6]);
  const labels = ["晴", "阴", "雨"];
  const exps = logits.map((value) => Math.exp(value));
  const sum = exps.reduce((total, value) => total + value, 0);
  return (
    <LabFrame title="Softmax" hint="任意分数，变成加起来等于 1 的比例" footer={<p>把其中一个分数拉得很高，它会吃掉几乎全部比例。这就是模型在词表上「挑下一个词」时的形状。</p>}>
      <div className="space-y-3 p-4">
        {logits.map((value, index) => (
          <label key={labels[index]} className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 text-sm">
            {labels[index]}
            <input type="range" min={-2} max={3} step={0.1} value={value} onChange={(event) => setLogits((current) => current.map((item, itemIndex) => (itemIndex === index ? Number(event.target.value) : item)))} />
            <span className="w-12 font-mono text-xs">{(exps[index] / sum).toFixed(2)}</span>
          </label>
        ))}
      </div>
    </LabFrame>
  );
}

export function NgramLab() {
  const text = "设置死区设置死区时间";
  const counts = new Map<string, number>();
  for (let i = 0; i < text.length - 1; i += 1) {
    const key = text.slice(i, i + 2);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return (
    <LabFrame title="只靠数数的语言模型" footer={<p>「设置」「死区」这些相邻两字出现了不止一次，所以它们比没见过的搭配更像下一截。指令种类一大，绝大多数搭配的计数是零，这就是后来要绕开的稀疏。</p>}>
      <p className="px-4 pt-4 font-serif text-lg">串口里反复出现的是「设置死区」，不是语法。</p>
      <p className="px-4 font-mono text-sm">{text}</p>
      <ul className="grid gap-2 p-4 sm:grid-cols-2">
        {rows.map(([gram, count]) => (
          <li key={gram} className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-sm">
            <span>{gram}</span>
            <span className="font-mono text-copper">{count}</span>
          </li>
        ))}
      </ul>
    </LabFrame>
  );
}

export function LstmLab() {
  const [forget, setForget] = useState(0.2);
  const [input, setInput] = useState(0.8);
  const [output, setOutput] = useState(0.7);
  const incoming = 0.9;
  const memory = forget * 0.55 + input * incoming;
  const hidden = output * memory;
  return (
    <LabFrame title="给记忆装上阀门" footer={<p>遗忘门关掉，旧记忆留着；输入门打开，新数字才进得去；输出门决定这一拍往外说多少。RNN 没有这些门，远处的信号会在连乘里消失。</p>}>
      <div className="space-y-3 p-4">
        <Gate label="遗忘门" value={forget} onChange={setForget} />
        <Gate label="输入门" value={input} onChange={setInput} />
        <Gate label="输出门" value={output} onChange={setOutput} />
        <p className="font-mono text-xs text-ink/70">
          记忆 {memory.toFixed(2)} · 这一拍输出 {hidden.toFixed(2)}
        </p>
      </div>
    </LabFrame>
  );
}

function Gate({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid grid-cols-[5rem_1fr_auto] items-center gap-3 text-sm">
      {label}
      <input type="range" min={0} max={1} step={0.05} value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <span className="w-10 font-mono text-xs">{value.toFixed(2)}</span>
    </label>
  );
}

const heads = {
  referent: [0.62, 0.06, 0.09, 0.04, 0.05, 0.14],
  state: [0.07, 0.04, 0.06, 0.05, 0.18, 0.6],
};

export function AttentionLab() {
  const tokens = ["幼狮", "没有", "过河", "它", "太", "累"];
  const [head, setHead] = useState<keyof typeof heads>("referent");
  const [selected, setSelected] = useState(3);
  const weights = heads[head];
  return (
    <LabFrame title="它在看谁" hint="点一个词，再换一个头" footer={<p>指代头把「它」拉向幼狮。状态头把权重分给「累」。一个头忙不过来，所以有多头。</p>}>
      <div className="flex gap-2 px-4 pt-4">
        {(
          [
            ["referent", "指代头"],
            ["state", "状态头"],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" onClick={() => setHead(id)} className={`rounded-full px-3 py-1 text-sm ${head === id ? "bg-ink text-paper" : "border border-line"}`}>
            {label}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 640 180" className="w-full">
        {tokens.map((token, index) => {
          const x = 50 + index * 100;
          const weight = selected === index ? 0.15 : weights[index];
          return (
            <g key={token} onClick={() => setSelected(index)} className="cursor-pointer">
              {selected !== index ? <line x1={50 + selected * 100 + 28} y1="48" x2={x + 28} y2="120" stroke="#9a4e24" strokeWidth={1 + weight * 8} opacity={0.25 + weight} /> : null}
              <rect x={x} y={selected === index ? 16 : 112} width="56" height="32" rx="8" fill={selected === index ? "#1a1714" : "#f3efe4"} stroke="#9a4e24" />
              <text x={x + 28} y={selected === index ? 37 : 133} textAnchor="middle" fontSize="14" fill={selected === index ? "#f3efe4" : "#1a1714"}>
                {token}
              </text>
            </g>
          );
        })}
      </svg>
    </LabFrame>
  );
}

export function TokenizerLab() {
  const word = "cranberry";
  const pieces = ["cran", "berry"];
  const letters = word.split("");
  const mark = "r";
  const rInLetters = letters.filter((letter) => letter === mark).length;
  const rInPieces = pieces.reduce((total, piece) => total + piece.split("").filter((letter) => letter === mark).length, 0);
  return (
    <LabFrame title="模型看见的不是字母" footer={<p>人按字母能数出 {rInLetters} 个 r。若模型的一步是整块 token，「berry」内部的 r 没有单独占一步，它就会把字母数错。这是示意词表，不是某一家的真实切分。</p>}>
      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-ink/50">字母</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {letters.map((letter, index) => (
              <span key={`${letter}-${index}`} className={`rounded px-2 py-1 font-mono text-sm ${letter === mark ? "bg-copper text-paper" : "bg-panel"}`}>
                {letter}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-ink/50">示意切分 · 块里仍有 {rInPieces} 个 r，但它们不各自占一步</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {pieces.map((piece) => (
              <span key={piece} className="rounded bg-ink px-2 py-1 font-mono text-sm text-paper">
                {piece}
              </span>
            ))}
          </div>
        </div>
      </div>
    </LabFrame>
  );
}

export function MoeLab() {
  const experts = ["叙事", "报修", "算术", "翻译", "对话", "检索", "格式", "安全"];
  const [token, setToken] = useState("幼狮过河");
  const routes: Record<string, number[]> = {
    "幼狮过河": [0, 4],
    "报修楼道灯": [1, 4],
    "1+2": [2, 4],
  };
  const active = routes[token];
  return (
    <LabFrame title="每次只用一小部分专家" footer={<p>参数可以很多，一次前向只唤醒其中几位。账单按被唤醒的那部分算，不是按总参数算。</p>}>
      <div className="flex flex-wrap gap-2 px-4 pt-4">
        {Object.keys(routes).map((item) => (
          <button key={item} type="button" onClick={() => setToken(item)} className={`rounded-full px-3 py-1 text-sm ${token === item ? "bg-ink text-paper" : "border border-line"}`}>
            {item}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2 p-4">
        {experts.map((expert, index) => (
          <div key={expert} className={`rounded-xl border px-2 py-3 text-center text-sm ${active.includes(index) ? "border-copper bg-copper text-paper" : "border-line text-ink/50"}`}>
            {expert}
          </div>
        ))}
      </div>
    </LabFrame>
  );
}

const loop = [
  { title: "计划", body: "先看任务：把电流环的比例系数从日志里对上，不要一上来改驱动。" },
  { title: "行动", body: "调用读文件，打开调节器源码和一份串口日志。" },
  { title: "观察", body: "日志里的误差在增大，源码里的限幅和日志单位不一致。" },
  { title: "再计划", body: "下一步只改单位换算，并把差异留给人看。不在这一拍里重写整个环路。" },
];

export function AgentLoopLab() {
  const [step, setStep] = useState(0);
  return (
    <LabFrame
      title="计划，行动，观察"
      footer={
        <div className="flex items-center gap-3">
          <button type="button" className="rounded-full bg-ink px-4 py-1.5 text-paper" onClick={() => setStep((value) => (value + 1) % loop.length)}>
            下一步
          </button>
          <span className="text-xs text-ink/60">工具的结果回到上下文，才有下一轮计划。</span>
        </div>
      }
    >
      <ol className="grid gap-3 p-4 sm:grid-cols-4">
        {loop.map((item, index) => (
          <li key={item.title} className={`rounded-xl border p-3 ${index === step ? "border-copper bg-paper" : "border-line opacity-60"}`}>
            <p className="font-mono text-xs text-copper">0{index + 1}</p>
            <p className="mt-1 font-medium">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-ink/80">{item.body}</p>
          </li>
        ))}
      </ol>
    </LabFrame>
  );
}

export function ContextMeterLab() {
  const [turns, setTurns] = useState(18);
  const system = 12;
  const project = 16;
  const history = Math.min(78, turns * 3.2);
  const total = system + project + history;
  const compact = total > 92;
  return (
    <LabFrame title="上下文会满" footer={<p>{compact ? "超过预算后，早先的原话被压成一段摘要。摘要没写上的决定，后面的轮次就看不见。" : "系统说明和项目说明先占掉一截。对话每多一轮，历史就再厚一层。"}</p>}>
      <div className="p-4">
        <label className="flex items-center gap-3 text-sm">
          对话轮数 {turns}
          <input type="range" min={1} max={40} value={turns} onChange={(event) => setTurns(Number(event.target.value))} className="flex-1" />
        </label>
        <div className="mt-4 flex h-8 overflow-hidden rounded-full bg-line">
          <div style={{ width: `${system}%` }} className="bg-brass" title="系统" />
          <div style={{ width: `${project}%` }} className="bg-copper" />
          <div style={{ width: `${compact ? 40 : history}%` }} className="bg-ink/80" />
        </div>
        <p className="mt-2 font-mono text-xs text-ink/60">铜：系统说明 · 深铜：项目说明 · 墨：对话{compact ? "（已压缩）" : ""}</p>
      </div>
    </LabFrame>
  );
}

const mcpSteps = [
  { at: "Host", text: "模型决定：列出串口，不要执行别的命令。" },
  { at: "Client", text: "客户端把这个意图包成一次 tools/call。" },
  { at: "Server", text: "服务器只做它声明过的那件事，返回端口名字列表。" },
  { at: "Host", text: "结构化结果回到上下文。模型还没被允许去写寄存器。" },
];

export function McpFlowLab() {
  const [step, setStep] = useState(0);
  return (
    <LabFrame
      title="一次工具调用"
      footer={
        <button type="button" className="rounded-full bg-ink px-4 py-1.5 text-paper" onClick={() => setStep((value) => (value + 1) % mcpSteps.length)}>
          传递下一跳
        </button>
      }
    >
      <div className="grid gap-3 p-4 md:grid-cols-3">
        {["Host", "Client", "Server"].map((name, index) => (
          <div key={name} className={`rounded-xl border p-3 ${mcpSteps[step].at === name ? "border-copper" : "border-line"}`}>
            <p className="font-mono text-xs text-copper">{name}</p>
            <p className="mt-2 text-sm leading-6">{index === 0 ? "模型和对话住在这里" : index === 1 ? "负责协议，不负责发明新权限" : "只暴露声明过的工具、资源和提示"}</p>
          </div>
        ))}
      </div>
      <p className="px-4 pb-4 text-sm">
        <span className="font-mono text-copper">0{step + 1}</span> {mcpSteps[step].text}
      </p>
    </LabFrame>
  );
}

const skillPreview = {
  name: "review-diff",
  description: "在改动将要留下时，按风险而不是按行数审查差异。",
  body: "先读差异的意图，再核对边界条件、单位和失败路径。不要在这一步重写设计。完成的标准是：每条意见都能指回具体改动。",
};

export function SkillCardLab() {
  const [open, setOpen] = useState(false);
  return (
    <LabFrame title="渐进披露" hint="描述先被看见，正文等任务匹配再进来" footer={<p>若把所有技能的正文都塞进系统提示，上下文在开工前就已经满了。匹配靠描述，执行靠正文。</p>}>
      <div className="p-4">
        <button type="button" onClick={() => setOpen((value) => !value)} className="w-full rounded-xl border border-line bg-paper p-4 text-left">
          <p className="font-mono text-xs text-copper">SKILL.md</p>
          <p className="mt-2 font-medium">{skillPreview.name}</p>
          <p className="mt-1 text-sm text-ink/75">{skillPreview.description}</p>
          {open ? <p className="mt-3 border-t border-line pt-3 text-sm leading-6">{skillPreview.body}</p> : <p className="mt-3 text-xs text-copper">点开才装入正文</p>}
        </button>
      </div>
    </LabFrame>
  );
}

const catalog = [
  { name: "ask-matt", use: "先问该用哪条技能，而不是直接开写。" },
  { name: "grill-with-docs", use: "把领域里的词问清楚，写进项目自己的说明。" },
  { name: "to-tickets", use: "把一段计划切成有先后的小票。" },
  { name: "tdd", use: "先有失败的检查，再写让它通过的改动。" },
  { name: "implement", use: "按票推进，收尾前做一次审查。" },
  { name: "code-review", use: "看差异是否兑现了当初的意图。" },
  { name: "wayfinder", use: "大到一次对话装不下的工作，先有一张共享的决策图。" },
];

export function SkillCatalogLab() {
  const [name, setName] = useState(catalog[0].name);
  const current = catalog.find((item) => item.name === name) ?? catalog[0];
  return (
    <LabFrame title="一套会先对齐再动手的技能" footer={<p>{current.use} 安装可以走 Claude Code 的插件，也可以把可编辑的文件复制进仓库。两套一起装，技能会重复出现。</p>}>
      <div className="flex flex-wrap gap-2 p-4">
        {catalog.map((item) => (
          <button key={item.name} type="button" onClick={() => setName(item.name)} className={`rounded-full px-3 py-1 font-mono text-xs ${name === item.name ? "bg-ink text-paper" : "border border-line"}`}>
            {item.name}
          </button>
        ))}
      </div>
    </LabFrame>
  );
}
