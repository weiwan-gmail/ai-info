"use client";

import { useState } from "react";
import { pairs } from "@/content/tools";
import { LabFrame } from "./LabFrame";

const editorScenes: Record<string, { title: string; steps: { title: string; body: string }[] }> = {
  cursor: {
    title: "Cursor 多出来的一层",
    steps: [
      { title: "仓库索引", body: "问题先落到工程里相关的文件，而不是只靠你粘贴的片段。" },
      { title: "行内补全", body: "光标处的短建议，和后面整段改动不是同一种动作。" },
      { title: "代理改动", body: "代理可以跨文件改，但人要看见差异。索引、补全、改动叠在同一个工程里。" },
    ],
  },
  chatgpt: {
    title: "聊天，和进仓库的那一层",
    steps: [
      { title: "对话", body: "解释、对照方案、起草一段文字，留在聊天里就够。" },
      { title: "编码代理", body: "要改真正的文件、跑检查，就得进入能看见仓库的那一层。" },
      { title: "分界", body: "聊天里的结论不会自动变成提交。没进仓库的代理，就还只是在谈话。" },
    ],
  },
  claude: {
    title: "终端里的长循环",
    steps: [
      { title: "项目说明", body: "仓库里的说明先进入上下文，代理知道这个工程拒绝什么。" },
      { title: "工具循环", body: "读、改、跑命令，结果回到同一条对话，再决定下一步。" },
      { title: "斜杠命令和技能", body: "常用做法不必每次重讲。技能是说明书，命令是你主动唤起它的方式。" },
    ],
  },
  antigravity: {
    title: "给人审的工件",
    steps: [
      { title: "指挥台", body: "桌面应用看多个代理在做什么，不一定等于写代码的编辑器。" },
      { title: "IDE 与 CLI", body: "写代码的界面和终端里的代理可以并存，它们不是同一个窗口。" },
      { title: "工件", body: "计划、差异、录屏是给人看的交付，不是又一条聊天气泡。" },
    ],
  },
};

export function EditorLoop({ highlight = "cursor" }: { highlight?: string }) {
  const scene = editorScenes[highlight] ?? editorScenes.cursor;
  const [step, setStep] = useState(0);
  return (
    <LabFrame title={scene.title} footer={<p>{scene.steps[step].body}</p>}>
      <div className="flex flex-wrap gap-2 p-4">
        {scene.steps.map((item, index) => (
          <button key={item.title} type="button" onClick={() => setStep(index)} className={`rounded-full px-3 py-1 text-sm ${index === step ? "bg-copper text-paper" : "border border-line"}`}>
            {item.title}
          </button>
        ))}
      </div>
    </LabFrame>
  );
}

const providers = [
  { id: "deepseek", name: "DeepSeek" },
  { id: "glm", name: "GLM" },
  { id: "kimi", name: "Kimi" },
];

const clients = [
  { id: "claude-code", name: "Claude Code", field: "兼容端点的基址、密钥、模型名", protocol: "它认的消息格式" },
  { id: "chatgpt-codex", name: "ChatGPT / Codex", field: "自定义提供方那一栏", protocol: "客户端暴露的那种兼容格式" },
  { id: "workbuddy", name: "WorkBuddy", field: "models.json 里的 url、apiKey、id", protocol: "OpenAI 风格的 chat/completions" },
  { id: "zcode", name: "ZCode", field: "模型设置里的提供方与模型名", protocol: "以该客户端文档写明的格式为准" },
];

export function ProtocolLab() {
  const [provider, setProvider] = useState(providers[0].id);
  const [client, setClient] = useState(clients[0].id);
  const name = providers.find((item) => item.id === provider)?.name;
  const target = clients.find((item) => item.id === client) ?? clients[0];
  return (
    <LabFrame title="同一家模型，四扇门" hint="字段是占位符，不是可以粘贴的密钥" footer={<p>选中的模型要落到 {target.name} 的「{target.field}」。协议对上了，工具调用才可能真正发出去；对不上时，先看格式，再怀疑密钥。</p>}>
      <div className="flex flex-wrap gap-2 px-4 pt-4">
        {providers.map((item) => (
          <button key={item.id} type="button" onClick={() => setProvider(item.id)} className={`rounded-full px-3 py-1 text-sm ${provider === item.id ? "bg-ink text-paper" : "border border-line"}`}>
            {item.name}
          </button>
        ))}
      </div>
      <div className="grid gap-3 p-4 md:grid-cols-4">
        {clients.map((item) => (
          <button key={item.id} type="button" onClick={() => setClient(item.id)} className={`rounded-xl border p-3 text-left ${client === item.id ? "border-copper bg-paper" : "border-line"}`}>
            <p className="text-sm font-medium">{item.name}</p>
            <p className="mt-2 font-mono text-[11px] leading-5 text-ink/70">
              model: {name?.toLowerCase()}-placeholder
              <br />
              key: YOUR_KEY
              <br />
              {item.protocol}
            </p>
          </button>
        ))}
      </div>
    </LabFrame>
  );
}

export function AdvisorLab() {
  const [sent, setSent] = useState(false);
  return (
    <LabFrame
      title="顾问写草稿，人贴密钥"
      footer={
        <button type="button" className="rounded-full bg-ink px-4 py-1.5 text-paper" onClick={() => setSent((value) => !value)}>
          {sent ? "收回草稿" : "让顾问根据文档写草稿"}
        </button>
      }
    >
      <div className="grid gap-3 p-4 md:grid-cols-3">
        <Column title="顾问 AI" body={sent ? "草稿里只有基址、模型名和字段说明。" : "等待你贴来的官方字段说明。"} hot={sent} />
        <Column title="人" body="密钥留在这里。顾问不申请、不转存、也不猜登录态。" hot />
        <Column title="被配置的客户端" body={sent ? "收到草稿后，用一次最小请求核对模型名和工具调用。" : "还没有可核对的配置。"} hot={sent} />
      </div>
    </LabFrame>
  );
}

function Column({ title, body, hot }: { title: string; body: string; hot?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${hot ? "border-copper" : "border-line"}`}>
      <p className="font-mono text-xs text-copper">{title}</p>
      <p className="mt-2 text-sm leading-6">{body}</p>
    </div>
  );
}

const providerColumns = [
  { id: "deepseek", label: "DeepSeek" },
  { id: "glm", label: "GLM" },
  { id: "kimi", label: "Kimi" },
  { id: "ollama", label: "本机" },
];

export function PairBoard() {
  const agents = [...new Set(pairs.map((pair) => pair.agent))];
  return (
    <LabFrame title="可点的搭配表" hint="有格子才能搭配，点进去是那一个例子" footer={<p>空格子表示这篇里没有把它写成可用搭配。以后要补，只在注册表加一条 pairs。</p>}>
      <div className="overflow-x-auto p-4">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left font-normal text-ink/50">Agent</th>
              {providerColumns.map((column) => (
                <th key={column.id} className="p-2 text-left font-normal text-ink/50">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent} className="border-t border-line">
                <th className="p-2 text-left font-medium">{labelOf(agent)}</th>
                {providerColumns.map((column) => {
                  const pair = pairs.find((item) => item.agent === agent && item.provider === column.id);
                  return (
                    <td key={column.id} className="p-2">
                      {pair ? (
                        <a href={`#${pair.anchor}`} className="text-copper underline-offset-2 hover:underline">
                          {pair.label}
                        </a>
                      ) : (
                        <span className="text-ink/25">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LabFrame>
  );
}

function labelOf(slug: string) {
  const names: Record<string, string> = {
    "claude-code": "Claude Code",
    opencode: "OpenCode",
    cursor: "Cursor",
    workbuddy: "WorkBuddy",
    zcode: "ZCode",
    "chatgpt-codex": "ChatGPT / Codex",
  };
  return names[slug] ?? slug;
}

const hands = [
  { id: "tool", title: "约定好的工具", body: "模型调用一个有名字、有参数、有结构化结果的动作。MCP 和编辑器里的读文件都属于这里。" },
  { id: "browser", title: "只操作浏览器", body: "导航、点击、填表、读页面。Cookie 和下载仍然会离开当前标签。网页上的事留在这里。" },
  { id: "desktop", title: "操作整台桌面", body: "看截图、移动指针、敲键盘。要打开 EDA、下载器或示波器软件，才升到这一格。" },
];

export function HandsStepper({ initial = "tool" }: { initial?: string }) {
  const [id, setId] = useState(initial);
  const current = hands.find((item) => item.id === id) ?? hands[0];
  return (
    <LabFrame title="手有三种" footer={<p>{current.body}</p>}>
      <div className="grid gap-3 p-4 md:grid-cols-3">
        {hands.map((item) => (
          <button key={item.id} type="button" onClick={() => setId(item.id)} className={`rounded-xl border p-3 text-left ${id === item.id ? "border-copper bg-paper" : "border-line"}`}>
            <p className="font-medium">{item.title}</p>
          </button>
        ))}
      </div>
    </LabFrame>
  );
}

const pipeline = [
  { title: "规格", body: "把要守住的数字写进仓库：采样范围、开关频率、接口。代理后面的改动对着这份规格，而不是对着一句口头描述。" },
  { title: "原理图", body: "网表和器件先于布线。脚本或 MCP 适合批量改名字、跑检查、出料单。" },
  { title: "布线", body: "浏览器里的 Flux 适合从描述走到中等复杂度。已有原理图上的物理约束布线，再看 Quilter。功率级和敏感模拟要人审。" },
  { title: "外壳", body: "板子和结构放在一起看干涉。生成的外形是草案，安装孔、散热和连接器方向由人定。" },
  { title: "波形", body: "串口、寄存器和波形的文字描述可以交回给模型。逻辑分析仪、仿真器和下载器仍然是仪器。" },
];

export function FieldPipeline({ start = "0" }: { start?: string }) {
  const initial = Number(start) || 0;
  const [step, setStep] = useState(initial);
  return (
    <LabFrame title="从规格到波形" footer={<p>{pipeline[step].body}</p>}>
      <div className="flex flex-wrap gap-2 p-4">
        {pipeline.map((item, index) => (
          <button key={item.title} type="button" onClick={() => setStep(index)} className={`rounded-full px-3 py-1 text-sm ${index === step ? "bg-ink text-paper" : "border border-line"}`}>
            {item.title}
          </button>
        ))}
      </div>
    </LabFrame>
  );
}

export function LayerStack({ items = "", active = "0" }: { items?: string; active?: string }) {
  const layers = items.split("|").filter(Boolean);
  const [index, setIndex] = useState(Number(active) || 0);
  const safe = layers[index] ? index : 0;
  return (
    <LabFrame title="它实际分成几层" hint="点一层，只看这一层负责什么" footer={<p>当前这一层：{layers[safe]}。层与层不要当成同一个按钮。</p>}>
      <div className="flex flex-col gap-2 p-4">
        {layers.map((layer, layerIndex) => (
          <button key={layer} type="button" onClick={() => setIndex(layerIndex)} className={`rounded-xl border px-4 py-3 text-left ${layerIndex === safe ? "border-copper bg-paper" : "border-line"}`}>
            <span className="font-mono text-xs text-copper">0{layerIndex + 1}</span>
            <span className="ml-3">{layer}</span>
          </button>
        ))}
      </div>
    </LabFrame>
  );
}
