<p align="center">
  <img src="./earnslate-web/public/earnslate.png" alt="Earnslate Logo" width="120"/>
</p>

<h1 align="center"><a href="https://earnslate.vercel.app">Earnslate</a></h1>

<p align="center">
  Track income, expenses, budgets, and subscriptions with a premium monochrome interface.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.0.10-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-TSL-red" alt="License">
</p>

> [!NOTE]
> **Personal Project** 🎯 I built this because I needed a solid finance manager and subscription tracker. Feel free to explore and learn from it!

## Live Website

**➡️ [https://earnslate.vercel.app](https://earnslate.vercel.app)**

> **Live Website Limitations**: This application uses LocalStorage. Data will not persist across different devices or browsers.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Real-time balance, spending breakdown pie chart, budget alerts |
| 💳 **Transactions** | Full CRUD with search, filters, date presets, pagination, batch delete |
| 📉 **Budgets** | Progress tracking, donut chart overview, auto-reset on period expiry |
| 🔄 **Subscriptions** | 100+ service templates, treemap visualization, flexible billing cycles |
| ⚙️ **Settings** | Custom categories, theme toggle, data export/import |

---

## 🚀 Quick Start

```bash
# Clone and navigate
git clone https://github.com/qtremors/earnslate.git
cd earnslate

# Install dependencies
cd earnslate-web
npm install

# Run the project
npm run dev
```

Visit **http://localhost:3000**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **State** | Zustand + localStorage persistence |
| **Styling** | CSS Modules (no Tailwind) |
| **Icons** | Iconify + Lucide React |

---

## 📁 Project Structure

```
earnslate/
├── earnslate-web/            # Web application source code (Next.js)
│   ├── src/                  # Source files
│   ├── public/               # Static assets
│   ├── package.json          # Dependency manifest
│   └── next.config.ts        # Next.js configuration
├── earnslate-android/        # Android app (Planned/Placeholder - currently no active development)
├── README.md                 # User-facing documentation
├── DEVELOPMENT.md            # Developer documentation
├── CHANGELOG.md              # Version history
├── LICENSE.md                # License terms
├── PLAN.md                   # Android app development plan
└── TASKS.md                  # Roadmap and tasks
```

## 📊 System Resource usage and impact

cpu: Low (Client-side rendering optimized)
ram: ~150MB (Dev server)
disk: ~200MB (Dependencies included)

---

## 🧪 Testing

```bash
# Currently manual testing is described in TASKS.md
cd earnslate-web
npm run dev
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [DEVELOPMENT.md](DEVELOPMENT.md) | Architecture, setup, API reference |
| [CHANGELOG.md](CHANGELOG.md) | Version history and release notes |
| [LICENSE.md](LICENSE.md) | License terms and attribution |
| [TASKS.md](TASKS.md) | Project roadmap and active tasks |
| [PLAN.md](PLAN.md) | Android app development plan |

---

## 📄 License

**Tremors Source License (TSL)** - Source-available license allowing viewing, forking, and derivative works with **mandatory attribution**. Commercial use requires written permission.

See [LICENSE.md](LICENSE.md) for full terms.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/qtremors">Tremors</a>
</p>
