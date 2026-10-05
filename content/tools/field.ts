import { callout, h2, links, mermaid, p, steps, widget } from "@/lib/blocks";
import type { ToolChapter } from "@/lib/types";

const updated = "2026-10-05";

export const fieldChapters: ToolChapter[] = [
  {
    slug: "firmware",
    group: "field",
    role: "field",
    kicker: "工程现场",
    title: "固件与算法",
    question: "改一个电流环时，哪几步是常见做法，哪一步必须回到仿真和实测？",
    summary: "按设定、误差、调节、限幅、采样走。代理只改你点名的那一处。",
    blurb: "一条可以跟着做的环路流程，外加仿真和实测两道门。",
    updated,
    blocks: [
      p("这一章不按产品介绍来写。电流环、采样换算和占空比限幅有一套重复出现的做法：先把单位和目标写进仓库，一次只改一个系数，仿真看阶跃，写进设备之前再实测。代理可以读手册、对日志、提出差异。它不能代替那两次闭合。"),
      widget("loop-svg"),
      h2("整段工作怎么接起来"),
      mermaid(
        `flowchart LR
  spec["规格进仓库"] --> sample["核对采样单位"]
  sample --> one["一次只改一处"]
  one --> sim["仿真看阶跃"]
  sim --> diff["人看差异"]
  diff --> bench["实测前停住"]`,
        "实线是建议的顺序。仿真没看过，就不要进入实测。",
      ),
      h2("常见做法"),
      steps([
        { title: "把目标写死", body: "目标电流、采样单位、限幅，三行放在仓库说明里。口头描述不作为下一轮的依据。" },
        { title: "先查换算", body: "毫安和安培、采样电阻和放大倍数，先对上。环路系数先别动。" },
        { title: "一次一个旋钮", body: "比例和积分不要在同一份差异里一起改。否则实测变了，也不知道是哪一个起的作用。" },
        { title: "仿真只回答一个问题", body: "阶跃之后是稳、是慢，还是振荡。不要让代理同时重写滤波、采样和限幅。" },
        { title: "实测是另一道门", body: "仿真通过，只说明模型里的那台电机过了。写入设备前，用和记录相同的探头位置再看一次。" },
      ]),
      h2("代理可以碰的和必须停的"),
      mermaid(
        `flowchart TB
  read["读手册和日志"] --> draft["改一处换算或一个系数"]
  draft --> review["差异给人看"]
  review --> simGate{"仿真看过吗"}
  simGate -->|没有| stopSim["停在仿真"]
  simGate -->|看过| hw{"要写进设备吗"}
  hw -->|要| stopHw["停在实测"]
  hw -->|不要| keep["留在仓库"]`,
      ),
      callout("和前面产品章的差别", "这里没有「它分成哪几层」这种产品结构。Cursor、Claude Code 或 ZCode 只是执行读和改的那个代理，环路本身不跟着换模型而改变。"),
      links([
        { href: "/tools/debug", label: "波形怎样交回仓库" },
        { href: "/tools/pcb", label: "这些系数最后在哪块板上" },
      ]),
    ],
  },
  {
    slug: "pcb",
    group: "field",
    role: "field",
    kicker: "工程现场",
    title: "电路板",
    question: "从网名、检查到布线，常见的做法是把哪一段留给人？",
    summary: "三条作业带：人定关键网络，脚本跑检查，云布线只出候选。",
    blurb: "用流程图分开 KiCad 脚本、Flux 和 Quilter，功率级单独停给人审。",
    updated,
    blocks: [
      p("不要把「AI 画板」当成一个按钮。常见做法是把板子拆开：关键网络人布，重复修改交给脚本，其余布线可以让工具出几份候选。候选回来之后，功率级、栅极驱动和敏感模拟仍然要人看。"),
      widget("board-svg"),
      h2("选哪条作业带"),
      mermaid(
        `flowchart TD
  start["已有原理图吗"] -->|没有| flux["Flux 里从描述起一版"]
  start -->|有| repeat{"是重复修改吗"}
  repeat -->|网名检查料单| script["KiCad 脚本或 MCP"]
  repeat -->|要布线| hand["功率和模拟先手布"]
  hand --> quilter["Quilter 出其余候选"]
  flux --> review["人审"]
  script --> review
  quilter --> review`,
        "KiCad 没有官方的大模型按钮。Flux 和 Quilter 有自己的云上模型，不跟着编程代理里换的 DeepSeek 一起换。",
      ),
      h2("常见步骤"),
      steps([
        { title: "原理图先于布线", body: "器件和网络由人定。代理不去发明一颗功率管。" },
        { title: "能写成脚本的就写成脚本", body: "批量改网名、跑电气检查、导出料单。这些动作的结果可以对照，不靠一句「已经画好了」。" },
        { title: "关键网络先占住", body: "功率回路、栅极驱动、采样。自动布线从剩下的网络开始。" },
        { title: "候选要带回检查", body: "看工具声称检查过什么：间距、线宽、是否碰到你预布的那几根。" },
        { title: "不能出机器的设计留在本地", body: "上传到云布线，等于把电路交给那家服务。本地就只用 KiCad 和脚本。" },
      ]),
      callout("人审不因为检查是绿的就取消", "盲孔、射频和很密的 BGA 若在工具自己的「还做不到」列表里，就不要用它来证明这块板可以生产。"),
      links([
        { href: "https://www.kicad.org/", label: "KiCad" },
        { href: "https://www.flux.ai/", label: "Flux" },
        { href: "https://www.quilter.ai/", label: "Quilter" },
        { href: "/tools/computer-use", label: "没有接口时才去点 EDA 窗口" },
      ]),
    ],
  },
  {
    slug: "cad",
    group: "field",
    role: "field",
    kicker: "工程现场",
    title: "结构与 CAD",
    question: "板子放进外壳时，生成的外形能决定什么，不能决定什么？",
    summary: "先有板框和高度，再看干涉。安装孔和连接器方向由人定。",
    blurb: "装配流程用图走一遍，生成式外形只是草案。",
    updated,
    blocks: [
      p("外壳画错，通常不是网表错了，是连接器朝向、器件高度和上盖没有放在同一次装配里看。生成式外形可以起一个壳，它不负责螺钉能不能拧到。"),
      widget("shell-svg"),
      h2("从板框到可以加工的壳"),
      mermaid(
        `flowchart LR
  board["导出板框和高度"] --> asm["放进装配"]
  asm --> hit{"有干涉吗"}
  hit -->|有| size["只改点名的尺寸"]
  size --> asm
  hit -->|没有| human["人定孔散热和出线"]
  human --> make["才谈加工"]`,
      ),
      h2("常见做法"),
      steps([
        { title: "板是输入", body: "从电路板导出外形和高度。连接器方向在板子上已经定了，壳去迁就板。" },
        { title: "装配里看干涉", body: "上盖、连接器、较高的器件。不在装配里的碰撞，聊天里看不见。" },
        { title: "草案只提供壁厚和外形", body: "可以让工具起一个壳。不要让它重做连接器方向。" },
        { title: "尺寸一次说清几条", body: "代理只改你写明的那几条。安装孔、散热筋、线束出口逐项人定。" },
        { title: "云端装配等于设计离开本机", body: "Fusion 一类工具的订阅和模型是它们自己的。不能上传的结构，留在本地文件里。" },
      ]),
      links([{ href: "https://www.autodesk.com/products/fusion-360/overview", label: "Fusion" }, { href: "/tools/pcb", label: "板框从电路板来" }]),
    ],
  },
  {
    slug: "debug",
    group: "field",
    role: "field",
    kicker: "工程现场",
    title: "现场调试",
    question: "怎样把一次测量写成可以对照源码的步骤，而不是多一张照片？",
    summary: "探头、触发、串口、对照。仪器仍是仪器，记录要带单位。",
    blurb: "一条从探头到改动再回到仪器的回路。",
    updated,
    blocks: [
      p("示波器上的现象留在屏幕里，源码留在仓库里，两边对不上时，代理只能编一个原因。常见做法是把测量写成四步记录，再让代理只回答「哪一个换算对不上」。"),
      widget("bench-svg"),
      h2("测完还要回到仪器"),
      mermaid(
        `flowchart LR
  probe["写下探头位置"] --> trig["写下触发和时基"]
  trig --> log["贴带单位的串口"]
  log --> code["对照源码"]
  code --> again["回到同一探头再测"]`,
        "没有第四步，前三步只是一份备忘，不是一次调试。",
      ),
      h2("常见做法"),
      steps([
        { title: "位置先于波形", body: "探头在哪一个管脚、哪一档。缺了位置，后面的解释都悬空。" },
        { title: "旋钮写成文字", body: "时基、触发电平、耦合。代理看不见仪器面板。" },
        { title: "串口带单位和时间", body: "一段日志加上它声称的单位。不要只丢一张截图。" },
        { title: "只问一个对不上的换算", body: "让代理指出采样系数或限幅单位。不要让它同时重写环路。" },
        { title: "改完再测", body: "用和记录相同的探头位置看波形是否变了。仿真器可以在写入设备前重放，不能代替这次测量。" },
      ]),
      callout("逻辑分析仪仍是仪器", "串口片段看不见的时序，不要用更强的模型推断它已经看见了。需要点仪器软件、又没有导出时，才考虑 Computer Use，并且停在确认前。"),
      links([
        { href: "/tools/firmware", label: "改动落回环路" },
        { href: "/tools/computer-use", label: "只有仪器软件时" },
      ]),
    ],
  },
];
