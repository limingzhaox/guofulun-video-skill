# 42 · 剧本 JSON 格式说明（`studio\episodes\epXX\script.json`）

> 唯一源文件：改它 → `gen_assets.py` → 时间轴、配音、字幕都跟着变。完整真实例子：`样板\剧本样板_ep23_script.json`。

## 一、第二篇标准写法（EP23 精简）
```json
{
  "meta": { "ep": 23, "chapter": "第三篇 · 第1章 财富的自然进步", "title": "城里人和乡下人，到底谁养活谁", "folder": "EP23_第三篇第1章_谁养活谁" },
  "music": "baroque",
  "cold": true,
  "tts": {
    "engine": "volc",
    "voice": "zh_male_m191_uranus_bigtts",
    "speech_rate": 24,
    "context": "你是一个知识类短视频博主，像跟朋友聊天一样，亲切自然、有感染力地讲故事，句子之间有停顿",
    "edge_voice": "zh-CN-YunxiNeural",
    "edge_rate": "+15%",
    "cast": {
      "小满": { "voice": "zh_male_shaonianzixin_uranus_bigtts", "speech_rate": 0, "context": "你是动画片里好奇的小男孩小满，说话直，第一反应很快，句子很短" },
      "小雪": { "voice": "zh_female_tianmeitaozi_uranus_bigtts", "speech_rate": 0, "context": "你是动画片里聪明的小女孩小雪，声音甜甜的，爱追问为什么，语气轻快，句子很短" },
      "农夫": { "voice": "zh_male_dayi_uranus_bigtts", "speech_rate": 0, "context": "你是动画片里两百多年前种地的农夫，五十岁上下，嗓门大、实在、有点不服气，句子很短" },
      "阿禾": { "voice": "zh_male_taocheng_uranus_bigtts", "speech_rate": 0, "context": "你是动画片里镇上开裁缝铺的阿禾，三十岁上下，手艺人，爱较真，说话利落，句子很短" }
    }
  },
  "scenes": [
    { "id": "hook", "rate": 14,
      "context": "你是一个知识类短视频博主。开头像跟朋友聊天时，说出一个大家常拌嘴的问题，带一点笑意和好奇，自然、从容、不着急",
      "lines": [ "城里人和乡下人，谁养活谁？", "农夫：全城吃的粮，都是我种的。", "阿禾：你身上这件衣服，可是我做的。" ] },
    { "id": "menu",
      "context": "你是一个知识类短视频博主。说“不是从乡下抢来的”时肯定、平稳；三个问题一口气问完，轻快、不着急",
      "lines": [ "《国富论》里说，……。⏸", "……？……？……？" ] },
    { "id": "trade", "lines": [ "……", "小满：……", "……⏸" ] },
    { "id": "grow",  "lines": [ "……" ] },
    { "id": "land",  "lines": [ "……" ] },
    { "id": "ending","lines": [ "回到开头那个镇子。", "……", "下次……，先问一句，……？⏸" ] },
    { "id": "cta",   "lines": [ "（下一集的问题）下一集接着讲。⏸" ] }
  ],
  "facts": [ "……：Book III Chapter I——\"English quote\"。", "“……”是创作示例……", "“……”是现代解释，非原著用词。", "略：#17 …（篇幅）；#26 …（合规）。" ]
}
```

## 二、字段

### 顶层
| 字段 | 说明 |
|---|---|
| `meta.ep / chapter / title / folder` | 集号；页眉章节名（≤16 字左右）；标题；成片文件夹名（`EPnn_第X篇第Y章_主题`） |
| `meta.look` | 第一篇蜡笔版才写 `"crayon"`；第二篇不写（画风在 `Video.tsx` 里 `look="paper"`） |
| `music` | `"baroque"`（国富论号固定） |
| `cold` | `true`：冷开场 |
| `tts.voice / speech_rate / context` | 旁白云舟 2.0、24、语气说明（照抄） |
| `tts.cast` | 角色 → `{voice, speech_rate, context}`，名字 1–4 字 |
| `tts.resource_id` | 只有复刻音色要写：`"seed-icl-2.0"` |
| `facts` | 三类分开标：原著主张（带英文短引）/ 现代解释 / 创作示例；最后一条写“略”和理由 |
| `level` | `"gentle"`：轻后期（复刻音色用） |
| `max_pause` | 句内停顿超过几秒就剪短（复刻音色用 0.4） |
| `slow_rate` / `slow_pre` / `slow_gap` | 〔slow〕句的语速、句前停、句后停（复刻音色 E 版：6 / 0.35 / 0.7） |
| `bgm_db` | 整集配乐压低几 dB（如 -4） |
| `gap_line` / `gap_scene` | 句间 / 场景间停顿（默认 0.10 / 0.32，一般不改） |

### 场景
| 字段 | 说明 |
|---|---|
| `id` | 场景名，全集唯一，画面代码用它找组件 |
| `lines` | 句子数组 |
| `context` | 只改这一场的旁白语气（开头场景必写） |
| `rate` | 只改这一场的旁白语速（开头 14；复刻音色讲故事 20、安静 14） |
| `tone: "dusk"` | 冷调段 |
| `dark: true` / `hush: true` | 暗场 / 反转前静音 |
| `pause` | 场景后多留白几秒 |

### 句子里的标记
| 标记 | 作用 |
|---|---|
| `⏸`（句末，可多个） | 每个多停 0.45 秒；不触发重配音；cta 只放 1 个 |
| `名字：`（行首） | 用 `tts.cast` 里这个角色的音色；字幕前挂名字签和小头像 |
| `〔slow〕`（行首） | 放慢、前后多停（复刻音色的真心话、关键句） |
| `【关键词】` | 字幕标红（第二篇很少用） |

## 三、改完之后
1. `python gen_assets.py epXX`（只有改过的句子重配）
2. 句子数变了 → 检查画面代码里的 `L.s(i)`、`W(i, "词")`（`工具\anchors_check.py`）
3. 新增场景 → `Video.tsx` 的 SCENES 和 `PartBar` 的 ticks / spans 都要改
