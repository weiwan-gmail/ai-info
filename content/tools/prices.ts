import { h2, links, p, table } from "@/lib/blocks";
import type { Block } from "@/lib/types";

const note = "下面的数字摘自 2026-10-05 打开的官方页面，税前。页面改价之后，以链接里的表格为准。";

export const priceCards: Record<string, Block[]> = {
  cursor: [
    h2("官网"),
    links([
      { href: "https://cursor.com/", label: "cursor.com" },
      { href: "https://cursor.com/pricing", label: "套餐页" },
      { href: "https://cursor.com/docs/models-and-pricing", label: "模型与 token 价格" },
    ]),
    p(note),
    table(
      ["套餐", "价格", "包含"],
      [
        ["Start（仅印度）", "₹649/月，含税", "只有 Cursor Models 池，不能开 Fast，不能调 effort"],
        ["Pro", "$20/月", "两个用量池、Tab、Bugbot、Cloud Agents"],
        ["Pro Plus", "$60/月", "同上，额度更高"],
        ["Ultra", "$200/月", "同上，额度更高"],
        ["Teams Standard", "$40/人/月", "另有第三方模型的 Cursor Token Rate $0.25/百万 tokens"],
        ["Teams Premium", "$120/人/月", "Standard 的 5 倍 Agent 用量"],
      ],
    ),
    table(
      ["Cursor Models（每百万 tokens）", "输入", "缓存读", "输出"],
      [
        ["Grok 4.7", "$2", "$0.50", "$6"],
        ["Grok 4.7 Fast", "$4", "$1", "$12"],
        ["Grok 4.7 500k", "$4", "$1", "$12"],
        ["Grok 4.7 500k Fast", "$6", "$1.50", "$18"],
        ["Grok 4.6", "$2", "$0.50", "$6"],
        ["Grok 4.6 Fast", "$4", "$1", "$12"],
        ["Grok 4.5", "$2", "$0.50", "$6"],
        ["Grok 4.5 Fast", "$4", "$1", "$18"],
        ["Composer 2.5", "$0.50", "$0.20", "$2.50"],
        ["Composer 2.5 Fast", "$3", "$0.50", "$15"],
      ],
    ),
    p("Other Models 池按各家 API 价从 Cursor 文档的长表扣，其中包括 Claude、Gemini、GPT、GLM、Kimi、Muse Spark。长上下文和 Fast 还有加价，完整格子在模型价格页，不在这里截断后假装已经列全。"),
  ],
  "chatgpt-codex": [
    h2("官网"),
    links([
      { href: "https://chatgpt.com/", label: "chatgpt.com" },
      { href: "https://chatgpt.com/pricing", label: "ChatGPT 套餐" },
      { href: "https://openai.com/codex/", label: "Codex" },
      { href: "https://openai.com/api/pricing/", label: "OpenAI API token 价" },
    ]),
    p("ChatGPT 的订阅卡片和 API 的 token 表是两本账。编码代理若走订阅，看套餐页；若走 API 密钥，看 API 价格页。两页都是脚本渲染，这里不转抄一张可能过期的营销截图。打开上面的链接看当前档位。"),
  ],
  "claude-code": [
    h2("官网"),
    links([
      { href: "https://claude.ai/", label: "claude.ai" },
      { href: "https://claude.com/pricing", label: "套餐与 API 价" },
      { href: "https://claude.com/product/claude-code", label: "Claude Code" },
      { href: "https://code.claude.com/docs", label: "终端文档" },
    ]),
    p(note),
    table(
      ["套餐", "价格", "Claude Code"],
      [
        ["Free", "$0", "不包含"],
        ["Pro", "$20/月，或年付 $200（折合 $17/月）", "包含，和聊天共用用量"],
        ["Max 5x", "$100/月", "包含，约为 Pro 每 5 小时用量的 5 倍"],
        ["Max 20x", "$200/月", "包含，约为 Pro 的 20 倍"],
      ],
    ),
    p("用量按滚动的 5 小时窗口，另有周限额，没有固定条数。Team 的 Standard 席位多于 Pro，Premium 约为 Standard 的 5 倍。Enterprise 在价格页 FAQ 里写成每席 $20/月再加 API 用量，按年付。终端里用 Console 密钥时，按下面的 API 价，不走订阅池。"),
    table(
      ["API 模型（每百万 tokens）", "输入", "输出", "缓存读", "缓存写"],
      [
        ["Fable 5.1", "$10", "$50", "$0.25", "$12.50"],
        ["Opus 5.5", "$4", "$20", "$0.20", "$5"],
        ["Sonnet 5.5", "$2", "$10", "$0.20", "$2.50"],
        ["Haiku 4.5", "$1", "$5", "$0.10", "$1.25"],
      ],
    ),
    p("美国境内推理对输入和输出另加 1.1 倍。Claude Code 产品页把 Opus 4.8 的 Fast 研究预览写成每百万 tokens 输入 $30、输出 $150。更早的 Opus、Sonnet 仍列在价格页的 Legacy 区。"),
  ],
  antigravity: [
    h2("官网"),
    links([
      { href: "https://antigravity.google/", label: "antigravity.google" },
      { href: "https://ai.google.dev/gemini-api/docs/pricing", label: "Gemini API 价格" },
    ]),
    p("桌面、IDE、CLI 和托管智能体是否分成免费档与 Pro、Ultra，以 Antigravity 产品页当时的卡片为准。托管智能体若按 Gemini API 计费，token 价在 Gemini 的价格页，不要把那张表当成桌面订阅已经包含的额度。"),
  ],
  deepseek: [
    h2("官网"),
    links([
      { href: "https://chat.deepseek.com/", label: "对话" },
      { href: "https://platform.deepseek.com/", label: "开放平台" },
      { href: "https://api-docs.deepseek.com/zh-cn/quick_start/pricing", label: "中文价格（元）" },
      { href: "https://api-docs.deepseek.com/quick_start/pricing", label: "英文价格（美元）" },
    ]),
    p("中文价格页的单位是元/百万 tokens。高峰是周一至周五 9:00–12:00 和 14:00–18:00（北京时间，不含法定节假日），其余是空闲，空闲约为高峰的一半。上下文 1M，最大输出 384K。两列都支持工具调用和 Anthropic 基址 https://api.deepseek.com/anthropic 。"),
    table(
      ["元/百万 tokens", "flash 空闲", "flash 高峰", "v4-pro 空闲", "v4-pro 高峰"],
      [
        ["输入，缓存命中", "0.05", "0.10", "0.15", "0.30"],
        ["输入，缓存未命中", "1.5", "3.0", "4.5", "9.0"],
        ["输出", "4.5", "9.0", "13.5", "27"],
      ],
    ),
    p("模型 id：deepseek-flash（DeepSeek-V4.1-Flash）和 deepseek-v4-pro（DeepSeek-V4-Pro-0813）。并发页上为 2500 和 500。英文页用美元另表，不要和这张人民币表混成一行。聊天网站的会员不抵 API 余额。"),
  ],
  glm: [
    h2("官网"),
    links([
      { href: "https://www.bigmodel.cn/", label: "智谱 BigModel" },
      { href: "https://www.bigmodel.cn/pricing", label: "API 价格" },
      { href: "https://z.ai/", label: "Z.ai（海外）" },
      { href: "https://zcode.z.ai/", label: "ZCode" },
    ]),
    p(note),
    table(
      ["模型", "上下文", "输入", "输出", "缓存命中", "模态"],
      [
        ["GLM-5.3", "1M", "8 元/百万", "28 元/百万", "2 元/百万", "文本"],
        ["GLM-5.3-Flash", "1M", "0.8 元/百万", "2.8 元/百万", "0.23 元/百万", "图片、视频、文件、文本"],
        ["GLM-5.2", "1M", "8 元/百万", "以价格页卡片为准", "以价格页为准", "文本"],
      ],
    ),
    p("缓存存储在价格页上标为限时免费。编码端点 https://open.bigmodel.cn/api/coding/paas/v4 ，通用端点 https://open.bigmodel.cn/api/paas/v4 。Coding Plan 的月费档位在 Z.ai / BigModel 的订阅页，和这张按量 API 价不是同一本账。"),
  ],
  kimi: [
    h2("官网"),
    links([
      { href: "https://www.kimi.com/", label: "kimi.com" },
      { href: "https://platform.kimi.ai/", label: "开放平台" },
      { href: "https://platform.kimi.ai/docs/pricing", label: "token 价格" },
      { href: "https://platform.kimi.com/docs/models", label: "模型列表" },
    ]),
    p("价格页单位是美元/百万 tokens，不含税。K3 的缓存写入分 5 分钟和 1 小时两档；K2 表上是缓存命中、输入、输出。"),
    table(
      ["模型", "输入", "输出", "缓存命中", "缓存写入", "长度"],
      [
        ["kimi-k3", "$3", "$15", "$0.30", "5 分钟 $3；1 小时 $6", "1,048,576"],
        ["kimi-k2.7-code", "$0.95", "$4", "$0.19", "按价格页", "页上同时有 1M 与 262,144"],
        ["kimi-k2.7-code-highspeed", "$1.90", "$8", "$0.38", "按价格页", "同上"],
        ["kimi-k2.6", "$0.95", "$4", "$0.16", "按价格页", "同上"],
      ],
    ),
    p("模型列表页还写着 kimi-k2.5，并注明更早的 kimi-k2 已下线。聊天产品、开放平台和 IDE 菜单里的名字不要互相代替。"),
  ],
  wiring: [
    h2("官网"),
    links([
      { href: "https://api-docs.deepseek.com/zh-cn/quick_start/pricing", label: "DeepSeek 接入入口" },
      { href: "https://platform.kimi.ai/docs/pricing", label: "Kimi 价格" },
      { href: "https://www.bigmodel.cn/pricing", label: "智谱价格" },
      { href: "https://code.claude.com/docs", label: "Claude Code" },
      { href: "https://zcode.z.ai/cn/docs/configuration", label: "ZCode 配置" },
    ]),
    p("接入之后，token 价仍是上面三家价格页上的单价，不是客户端套餐里的「已包含」。客户端只决定字段写在哪。"),
  ],
  pairing: [
    h2("官网"),
    links([
      { href: "https://cursor.com/docs/models-and-pricing", label: "Cursor 两池" },
      { href: "https://claude.com/pricing", label: "Claude 订阅与 API" },
      { href: "https://api-docs.deepseek.com/zh-cn/quick_start/pricing", label: "DeepSeek" },
      { href: "https://www.bigmodel.cn/pricing", label: "智谱" },
      { href: "https://platform.kimi.ai/docs/pricing", label: "Kimi" },
    ]),
    p("换燃料就换一张价格页。Claude Code 接上 DeepSeek 之后，推理费记在 DeepSeek 的人民币表，不再记在 Claude 的五小时订阅窗口里。Cursor 里点 GLM，记在 Other Models 池，按智谱 API 价，而不是 Composer 的 $0.50/$2.50。"),
  ],
  workbuddy: [
    h2("官网"),
    links([
      { href: "https://workbuddy.tencent.com/", label: "国内" },
      { href: "https://www.workbuddy.ai/", label: "国际" },
      { href: "https://cloud.tencent.com/document/product/1831/134513", label: "models.json" },
    ]),
    p("内置模型目录随国内版或国际版变化。自定义模型的 token 价等于你填进 models.json 的那一家。客户端自己的 Credits、Coding Plan、Token Plan 以腾讯云该产品的计费页为准，不在这里写成和 API 单价相同的一张表。"),
  ],
  trae: [
    h2("官网"),
    links([
      { href: "https://www.trae.cn/", label: "trae.cn" },
      { href: "https://www.trae.ai/", label: "trae.ai" },
    ]),
    p("国内版和国际版的套餐页分开。模型若是内置的豆包、DeepSeek 或 GLM，额度在 Trae 的套餐里；若设置里没有自定义供应商，就没有一张你可以改的 token 单价。具体月费打开你下载的那一版的价格页。"),
  ],
  qoder: [
    h2("官网"),
    links([
      { href: "https://qoder.com/", label: "qoder.com" },
      { href: "https://docs.qoder.com/zh/cli/model", label: "模型与 Credits 倍率" },
      { href: "https://help.aliyun.com/zh/lingma/product-overview/billing-description", label: "Qoder CN 计费说明" },
    ]),
    p("国际站的订阅美元价以 qoder.com 的价格卡片为准。CN 用人民币和 Credits。下面是 CLI 文档里的 Credits 消耗倍率，不是厂商 API 的元/百万 tokens。用自己的密钥接入百炼、DeepSeek、智谱、Kimi、MiniMax、小米 MIMO 时，改按那些厂商的价格页计费。"),
    table(
      ["模型", "Credits 倍率"],
      [
        ["Qwen3.7-Plus", "0.1×"],
        ["MiniMax-M3", "0.2×"],
        ["DeepSeek-V4-Flash、Kimi-K2.7-Code", "0.3×"],
        ["Qwen3.8-Max、Qwen3.7-Max", "0.5×"],
        ["GLM-5.3、GLM-5.2", "0.6×"],
        ["Kimi-K3、DeepSeek-V4-Pro", "0.8×"],
      ],
    ),
  ],
  zcode: [
    h2("官网"),
    links([
      { href: "https://zcode.z.ai/", label: "zcode.z.ai" },
      { href: "https://zcode.z.ai/cn/docs/configuration", label: "连接模型" },
      { href: "https://www.bigmodel.cn/pricing", label: "不用套餐时的 API 价" },
      { href: "https://z.ai/", label: "Z.ai 订阅" },
    ]),
    p("客户端可以免费下载。推理要么走 GLM / Z.ai Coding Plan 的积分和周额度，要么走 API Key，按智谱价格页的元/百万 tokens。文档写 Pro、Max 相对 Lite 有倍数，具体月费以订阅页卡片为准，不把二手文章里的美元档抄进这里。"),
  ],
  doubao: [
    h2("官网"),
    links([
      { href: "https://www.doubao.com/", label: "doubao.com" },
    ]),
    p("会员、创作额度包和云存储的价格都在客户端的购买页上，三本账分开标价。这里不写一个会过期的元数。它不是按百万 tokens 公开的编程 API。"),
  ],
  opencode: [
    h2("官网"),
    links([
      { href: "https://opencode.ai/zh", label: "opencode.ai" },
      { href: "https://opencode.ai/docs", label: "文档" },
    ]),
    p("客户端本身没有套餐价。token 价等于你接上的那一家：Claude、OpenAI、DeepSeek、智谱、Kimi，或本机模型的零 API 费。用 ChatGPT Plus/Pro 或 GitHub Copilot 登录时，额度在那些账号里。"),
  ],
  freebuff: [
    h2("官网"),
    links([{ href: "https://freebuff.com/", label: "freebuff.com" }]),
    p("首页把自己标成 $0/年，由广告支付模型。挂上已有的 Claude Code 或 Codex 之后，里层仍按那些订阅或 API 价计费。首页上其他产品的年费柱状图是它的对比图，不是那些产品的官方价目。"),
  ],
  "local-models": [
    h2("官网"),
    links([
      { href: "https://ollama.com/", label: "ollama.com" },
      { href: "https://ollama.com/pricing", label: "Ollama 云套餐（若页面提供）" },
    ]),
    p("跑在你自己机器上的权重没有 token 发票。Ollama 若另有云套餐，价格只认它的定价页。电费、显存和许可证是本机的三本账。"),
  ],
  "grok-bot": [
    h2("官网"),
    links([
      { href: "https://grok.com/", label: "grok.com" },
      { href: "https://x.ai/", label: "x.ai" },
      { href: "https://cursor.com/docs/models-and-pricing", label: "Cursor 里的 Grok token 价" },
    ]),
    p("Grok 产品自己的订阅以 grok.com 为准。若通过 Cursor 调用 Grok 4.5、4.6、4.7，单价用 Cursor 文档里 Cursor Models 那张表，例如 Grok 4.7 为输入 $2、缓存读 $0.50、输出 $6（每百万 tokens），Fast 和 500k 上下文另有行。"),
  ],
  muse: [
    h2("官网"),
    links([
      { href: "https://www.meta.ai/", label: "meta.ai" },
      { href: "https://cursor.com/docs/models-and-pricing", label: "Muse Spark 在 Cursor 中的 token 价" },
    ]),
    p("管家应用 Muse 和编辑器里的 Muse Spark 不是同一个账单。Cursor 文档把 Muse Spark 1.3 标成输入 $1.25、缓存读 $0.15、输出 $4.25（每百万 tokens）。应用本身的地区和订阅以 Meta 的产品页为准。"),
  ],
  manus: [
    h2("官网"),
    links([{ href: "https://manus.im/", label: "manus.im" }]),
    p("任务代理和云电脑的套餐在 Manus 站内。没有公开的、可抄进教程的 token 单价表时，不要用别家的 API 价代替。"),
  ],
  cue: [
    h2("官网"),
    links([{ href: "https://manus.im/", label: "从 Manus 进入 Cue" }]),
    p("Cue 随 Manus 公布。邀请期的价格和配额若页面没写数字，就保持未知。不要把它接进 DeepSeek 的人民币表。"),
  ],
  yuanbao: [
    h2("官网"),
    links([{ href: "https://yuanbao.tencent.com/", label: "yuanbao.tencent.com" }]),
    p("办公交付是否收费，以元宝里的说明为准。它不使用 DeepSeek 或智谱那两张公开 API 价目，除非产品页明确写了按那些接口计费。"),
  ],
  "computer-use": [
    h2("官网"),
    links([
      { href: "https://claude.com/product/claude-code", label: "Claude 的计算机使用随其套餐" },
      { href: "https://claude.com/pricing", label: "因此查 Claude 价格页" },
    ]),
    p("这只手没有单独的 token 表。截图和动作记在驱动它的那个代理的模型上，例如 Claude 的订阅池或 API 价。"),
  ],
  "browser-use": [
    h2("官网"),
    links([
      { href: "https://github.com/browser-use/browser-use", label: "browser-use 项目" },
      { href: "https://code.claude.com/docs", label: "浏览器能力也可能在 Claude Code 文档里" },
    ]),
    p("库本身可以免费。打开网页所消耗的 token 记在你选的模型价格页上。云端代理自带的浏览器则记在那家代理的套餐里。"),
  ],
  firmware: [
    h2("官网"),
    links([
      { href: "https://cursor.com/docs/models-and-pricing", label: "若用 Cursor" },
      { href: "https://claude.com/pricing", label: "若用 Claude Code" },
      { href: "https://api-docs.deepseek.com/zh-cn/quick_start/pricing", label: "若燃料是 DeepSeek" },
    ]),
    p("固件仓库不另卖套餐。一次改死区的费用等于你选的代理套餐或那家模型的 token 价。"),
  ],
  pcb: [
    h2("官网"),
    links([
      { href: "https://www.kicad.org/", label: "KiCad，软件免费" },
      { href: "https://www.flux.ai/", label: "Flux" },
      { href: "https://www.quilter.ai/", label: "Quilter" },
    ]),
    p("KiCad 没有 token 价。Flux 和 Quilter 的订阅或按次费用在它们自己的价格页，和编程代理的模型池分开扣。"),
  ],
  cad: [
    h2("官网"),
    links([{ href: "https://www.autodesk.com/products/fusion-360/overview", label: "Fusion" }]),
    p("结构软件的订阅价在 Autodesk 的购买页。生成草案若调用云上的模型，那笔费用也在同一家的方案里，不会出现在 DeepSeek 的账单上。"),
  ],
  debug: [
    h2("官网"),
    links([
      { href: "https://cursor.com/docs/models-and-pricing", label: "把记录交给编程代理时的 token 价" },
      { href: "https://platform.kimi.ai/docs/pricing", label: "长日志若改用 Kimi" },
    ]),
    p("示波器和逻辑分析仪没有 token 价。贵的是你把多长的记录送进哪一张模型价格表。"),
  ],
};
