# 🦀 Clawd File Feed Mod

拖文件到 Clawd 桌宠身上，自动打开 Claude Code 读取文件。

---

## 🎬 效果演示

| 动作 | 动画 |
|------|------|
| 文件拖到螃蟹上方 | 🫣 `clawd-aegyo-shy`（害羞期待） |
| 松手放下 | 🎉 `clawd-notification`（开心吃到） |
| 同时 | 💻 终端弹出，Claude Code 自动启动 |

---

## 🔧 安装

### 前提
- 已安装 [Clawd on Desk](https://github.com/rullerzhou-afk/clawd-on-desk) v0.10.0
- Windows 系统
- Node.js 18+

### 一键启用

```bash
# 1. 克隆本仓库
git clone https://github.com/hexiegzm/clawd-pet-mod.git

# 2. 双击运行
启用.bat
```

脚本会自动备份原版文件，安全无忧。

### 一键还原

```bash
还原.bat
```

恢复 Clawd on Desk 到原始状态。

---

## 📂 项目结构

```
clawd-pet-mod/
├── 启用.bat                    # 一键启用
├── 还原.bat                    # 一键还原
├── patches/src/               # 补丁文件
│   ├── hit-renderer.js         # 文件拖放动画逻辑
│   ├── pet-interaction-ipc.js  # 终端启动 Claude Code
│   └── renderer.js             # 动画计时器修复
└── scripts/
    ├── enable.js               # 启用脚本（解包→打补丁→重启）
    └── disable.js              # 还原脚本（删改→恢复→重启）
```

---

## 🛡️ 安全保证

- 原版 `app.asar` 备份为 `app.asar.original`，字节级保留
- 只修改 3 个文件，总共不到 80 行新代码
- 一键还原，不留任何痕迹
- 不影响 Clawd on Desk 自动更新

---

## ⚙️ 工作原理

```
拖文件到螃蟹身上
    │
    ▼
hit-renderer.js 捕获 dragover/drop 事件
    │
    ├─ dragover → 播放 clawd-aegyo-shy.svg（害羞）
    ├─ drop     → 播放 clawd-notification.svg（开心）
    │
    └─ dropPaths IPC → main 进程
            │
            ├─ launchClaudeSession(dir) → 终端 + Claude Code
            └─ pet-drop-accepted → 2.5 秒后恢复常态动画
```

利用了 Clawd on Desk v0.10.0 内置的文件拖放基础设施（#459），在此之上增强了动画表现和 Claude Code 自动启动。

---

## 📄 License

MIT
