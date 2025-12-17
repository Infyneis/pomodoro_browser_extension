<p align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/timer.svg" alt="Pomodoro Timer" width="100" height="100" />
</p>

<h1 align="center">🐙 Pomodoro Browser Extension</h1>
<h3 align="center">Focus better with your octopus buddy <code>#5/365 - Year Coding Challenge</code></h3>

<p align="center">
  <em>A lavender-themed Pomodoro timer with an adorable octopus mascot</em>
</p>

<p align="center">
  <a href="https://github.com/Infyneis">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/samy-djemili/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat-square&logo=googlechrome&logoColor=white" alt="Chrome" />
  <img src="https://img.shields.io/badge/Firefox-Extension-FF7139?style=flat-square&logo=firefox&logoColor=white" alt="Firefox" />
</p>

---

## ✨ Overview

A beautiful, feature-rich Pomodoro timer browser extension with **confetti celebrations**, **sound notifications**, and **detailed statistics**. Built with React and designed with a calming lavender theme featuring an adorable octopus mascot.

<p align="center">
  <img src="https://img.shields.io/badge/🚀_Year_Coding_Challenge-Project_%235-9B7EDE?style=for-the-badge" alt="Year Coding Challenge" />
  <img src="https://img.shields.io/badge/📅_Completed-December_16,_2024-6EE7B7?style=for-the-badge" alt="Completed" />
  <img src="https://img.shields.io/badge/🐙_Mascot-Octopus-C4B5FD?style=for-the-badge" alt="Octopus" />
</p>

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| ⏱️ **Circular Timer** | Beautiful animated progress ring with lavender theme |
| 🐙 **Octopus Mascot** | Cute floating octopus companion |
| 🎨 **Lavender Theme** | Calming purple color palette |
| ⚙️ **Customizable** | Adjust all durations, sounds, and auto-start options |
| 🎊 **Confetti Celebration** | Burst of purple confetti when timer completes |
| 🔔 **Notifications** | System notifications + pleasant chime sounds |
| 📊 **Statistics** | Track daily/weekly progress with beautiful charts |
| 🔥 **Streak Tracking** | Keep your motivation high with day streaks |
| 🏷️ **Badge Counter** | See remaining minutes on the extension icon |
| 🌐 **Cross-Browser** | Works on Chrome and Firefox |

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
      <br>React 18
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
      <br>TypeScript
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=vite" width="48" height="48" alt="Vite" />
      <br>Vite
    </td>
    <td align="center" width="96">
      <img src="https://www.chartjs.org/img/chartjs-logo.svg" width="48" height="48" alt="Chart.js" />
      <br>Chart.js
    </td>
    <td align="center" width="96">
      <img src="https://lucide.dev/logo.light.svg" width="48" height="48" alt="Lucide" />
      <br>Lucide Icons
    </td>
  </tr>
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=chrome" width="48" height="48" alt="Chrome" />
      <br>Chrome MV3
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=firefox" width="48" height="48" alt="Firefox" />
      <br>Firefox MV3
    </td>
    <td align="center" width="96">
      <img src="https://www.kirilv.com/canvas-confetti/favicon.ico" width="48" height="48" alt="Confetti" />
      <br>Confetti
    </td>
    <td align="center" width="96">
      <img src="https://crxjs.dev/img/crxjs-logo.svg" width="48" height="48" alt="CRXJS" />
      <br>CRXJS
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=css" width="48" height="48" alt="CSS" />
      <br>CSS3
    </td>
  </tr>
</table>

---

## 📂 Project Structure

```
pomodoro_browser_extension/
├── 📦 package.json                    # Dependencies & scripts
├── ⚙️ vite.config.ts                  # Vite + CRXJS config
├── 📜 manifest.json                   # Chrome Manifest V3
├── 📜 manifest.firefox.json           # Firefox Manifest V3
├── scripts/
│   └── 🦊 build-firefox.js            # Firefox build script
├── public/
│   └── icons/                         # 🐙 Octopus SVG icons
├── src/
│   ├── background/
│   │   └── service-worker.ts          # ⏱️ Timer logic & alarms
│   ├── lib/
│   │   ├── types.ts                   # 📝 TypeScript types
│   │   ├── storage.ts                 # 💾 Chrome storage wrapper
│   │   └── sound.ts                   # 🔊 Sound notifications
│   └── popup/
│       ├── index.html                 # 📄 Popup entry
│       ├── main.tsx                   # ⚛️ React entry
│       ├── App.tsx                    # 🏠 Main component
│       ├── App.css                    # 🎨 Styles (lavender theme)
│       ├── hooks/
│       │   ├── useTimer.ts            # ⏱️ Timer state hook
│       │   ├── useSettings.ts         # ⚙️ Settings hook
│       │   └── useStats.ts            # 📊 Statistics hook
│       └── components/
│           ├── Timer/                 # ⏱️ Timer display & controls
│           ├── Settings/              # ⚙️ Settings panel
│           ├── Stats/                 # 📊 Statistics & charts
│           └── Celebration/           # 🎊 Confetti animation
├── dist/                              # 🔵 Chrome build output
└── dist-firefox/                      # 🟠 Firefox build output
```

---

## 🚀 Getting Started

### Prerequisites

- 🟢 Node.js 18+
- 📦 pnpm (or npm/yarn)

### Installation

```bash
# 📦 Install dependencies
pnpm install

# 🔨 Build for Chrome
pnpm build

# 🦊 Build for Firefox
node scripts/build-firefox.js
```

### Load in Chrome

1. 🌐 Open `chrome://extensions/`
2. 🔧 Enable **Developer mode** (top right)
3. 📁 Click **Load unpacked**
4. 📂 Select the `dist/` folder

### Load in Firefox

1. 🦊 Open `about:debugging#/runtime/this-firefox`
2. 📁 Click **Load Temporary Add-on**
3. 📂 Select `dist-firefox/manifest.json`

---

## ⏱️ How It Works

### The Pomodoro Technique

```
🐙 Focus (25 min) → 🌿 Short Break (5 min) → 🐙 Focus → 🌿 Short Break
                                    ↓
        After 4 pomodoros: 🌊 Long Break (15 min)
```

### Timer Modes

| Mode | Duration | Color | Description |
|------|----------|-------|-------------|
| 🐙 **Focus** | 25 min | Lavender | Deep work time |
| 🌿 **Short Break** | 5 min | Mint | Quick rest |
| 🌊 **Long Break** | 15 min | Sky Blue | Extended rest after 4 pomodoros |

---

## 🎨 Design

The extension features a **calming lavender design** with:

- 🐙 Adorable floating octopus mascot
- 💜 Lavender/purple color palette (#9B7EDE)
- 🌿 Mint green for short breaks (#6EE7B7)
- 🌊 Sky blue for long breaks (#7DD3FC)
- ✨ Smooth floating animations
- 🎊 Purple confetti celebration on completion
- 📱 Responsive popup (360px width)

---

## ⚙️ Settings

| Setting | Default | Description |
|---------|---------|-------------|
| 🐙 Focus Duration | 25 min | Work session length |
| 🌿 Short Break | 5 min | Quick break length |
| 🌊 Long Break | 15 min | Extended break length |
| 🔄 Long Break After | 4 | Pomodoros before long break |
| 🔊 Sound Enabled | ✅ | Play chime on completion |
| 🔔 Notifications | ✅ | Show system notifications |
| ▶️ Auto-start Breaks | ❌ | Automatically start breaks |
| ▶️ Auto-start Focus | ❌ | Automatically start focus |

---

## 📊 Statistics

Track your productivity with detailed statistics:

- 📅 **Today's Count** - Pomodoros completed today
- 🔥 **Current Streak** - Consecutive days with 1+ pomodoro
- 📈 **Total Pomodoros** - All-time completed count
- 📊 **Weekly Chart** - Visual breakdown of the last 7 days
- 🏆 **Best Streak** - Your longest streak ever

---

## 📦 Build Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with HMR |
| `pnpm build` | Build for Chrome (output: `dist/`) |
| `node scripts/build-firefox.js` | Build for Firefox (output: `dist-firefox/`) |

---

## 🌐 Browser Support

| Browser | Manifest | Status |
|---------|----------|--------|
| 🔵 Chrome 88+ | V3 | ✅ Fully supported |
| 🟠 Firefox 109+ | V3 | ✅ Fully supported |
| 🔵 Edge 88+ | V3 | ✅ Should work (Chromium) |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- 🎊 [canvas-confetti](https://github.com/catdad/canvas-confetti) - Confetti animation
- 📊 [Chart.js](https://www.chartjs.org/) - Statistics charts
- 💡 [Lucide](https://lucide.dev/) - Beautiful icons
- 🔧 [CRXJS](https://crxjs.dev/) - Vite plugin for browser extensions
- 🍅 The Pomodoro Technique® by Francesco Cirillo

---

<p align="center">
  Made with 💜 by <strong>Samy DJEMILI</strong>
</p>

<p align="center">
  <a href="#top">⬆️ Back to top</a>
</p>
