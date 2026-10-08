# Habitix

> **"Build habits. Build yourself."**

Habitix is a personal daily timetable, habit tracker, and productivity dashboard built specifically for college students. It combines a structured physical stationery planner aesthetic with modern PWA capabilities: hard offset shadows, zero blur, solid color accents, full keyboard accessibility, and 100% offline local-first persistence.

---

## ✨ Key Features

1. **Structured Student Timetable**:
   - **Monday & Tuesday**: College (9:00 AM–4:00 PM), Gym + Shower, Coding Practice (8:10–10:00 PM), Assignments, Sleep routine.
   - **Wednesday, Thursday & Friday**: College (9:00 AM–4:50 PM), Gym + Shower, Coding Practice (8:10–10:00 PM), Assignments, Sleep routine.
   - **Saturday**: Morning & Evening Coding Practice, Projects / coding, Gym + Shower, Lunch & relax blocks.
   - **Sunday**: Morning & Evening Coding Practice / revision, Weekly planning, College projects/assignments, Prepare for Monday.

2. **Real Calendar Date System**:
   - Independent daily progress per calendar date (`YYYY-MM-DD`). Progress on October 8 does not overwrite October 9.
   - Calendar date picker, previous/next day navigation, and one-tap `TODAY` jump.
   - Weekly day strip: `MON | TUE | WED | THU | FRI | SAT | SUN` with active teal state.

3. **Habit Checklist & Micro-interactions**:
   - Accessible checkboxes with ≥ 44px mobile touch targets.
   - Fast completion animations, subtle strikethrough, and instant progress recalculation.
   - Confetti celebration upon crossing the daily streak target (≥ 80%).

4. **Streak System**:
   - Current Streak and Best Streak tracking.
   - A day qualifies for the streak when **≥ 80%** of that day's scheduled tasks are completed.
   - Calculated across consecutive days and stored locally.

5. **Custom Tasks & Categorization**:
   - `+ ADD TASK` modal supporting custom task name, time, and category.
   - Edit, delete, and complete custom tasks.
   - 6 Core Categories with subtle badges:
     - 🎓 College
     - 💻 Coding
     - 🏋️ Fitness
     - 🍽️ Food
     - 🧠 Personal
     - 😴 Sleep

6. **Weekly & Progress Analytics**:
   - **Week Screen**: 7-day overview with completion percentages, mini progress bars, and one-click navigation to any day.
   - **Progress Screen**: Real data metrics only—Current Streak, Best Streak, Weekly Completion, Total Completed Tasks, and category consistency rates (Coding Practice, Gym, Sleep).
   - Crisp 7-day activity bar chart styled to the design system.

7. **Settings & Data Management**:
   - Light (Teal + Coral + Navy) default theme and Dark Slate optional theme.
   - Browser notification reminders.
   - Export routine history as JSON backup and Import JSON backup.
   - Safe `RESET DAY` (resets only the selected date) and `RESET ALL` (requires typing confirmation).

8. **Progressive Web App (PWA) & Offline-First**:
   - Installable on mobile phones (iOS & Android), tablets, and desktops.
   - Service worker with offline caching (`sw.js`).
   - Web App Manifest (`manifest.json`) with vector SVG and high-res PNG icons (192x192, 512x512, maskable).
   - **No laptop connection required**: Works fully autonomously on your phone after first visit.

---

## 🎨 Color Palette & Design Tokens

| Token | Hex | Usage |
|---|---|---|
| **Primary Dark** | `#243B53` | Headings, primary text, dark borders, hard shadows |
| **Teal** | `#62B6B7` | Primary buttons, active navigation, progress bars |
| **Coral** | `#E9786A` | Destructive actions, warnings, missed/attention states |
| **Yellow** | `#F6D97A` | Highlights, achievements, streak counters |
| **Page Background** | `#F5F6F4` | Main page background |
| **Card / Sidebar** | `#FFFFFF` | Cards, task containers, forms |
| **Secondary Text** | `#52606D` | Descriptions, metadata, timestamps |
| **Neutral Border** | `#CBD5E0` | Dividers, subtle borders |

- **Borders**: 2–4px solid `#243B53`
- **Corner Radius**: 2–4px (`border-radius: 4px`)
- **Shadows**: Hard offset shadows with **zero blur** (`box-shadow: 4px 4px 0 #243B53;`)
- **Typography**: `Inter` for UI text; `JetBrains Mono` for numbers, metrics, times, and percentages.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Run Linter
```bash
npm run lint
```

### 4. Run Automated Test Suite
```bash
npm test
```

### 5. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

---

## 📱 How to Install on Mobile (Phone / Tablet)

Once deployed online, Habitix can be installed directly to your phone's home screen as a standalone app:

### On iPhone (Safari):
1. Open the deployed Habitix URL in **Safari**.
2. Tap the **Share** button (box with upward arrow) at the bottom toolbar.
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **Add**. Habitix will appear as a native app icon on your home screen.

### On Android (Chrome / Edge / Brave):
1. Open the deployed Habitix URL in your browser.
2. Either tap the **"Install App"** button inside the Habitix header/settings, or tap the **three dots menu (⋮)** in the browser.
3. Tap **"Install App"** or **"Add to Home screen"**.
4. Confirm installation.

> **Note**: Because Habitix uses a Service Worker and local storage, **your laptop does NOT need to remain turned on**. The app opens instantly from your phone and runs 100% offline.

---

## 🌐 Deployment Instructions

Habitix is configured with relative base paths (`base: './'`) and client-side rewrites, making it deployable on any static hosting provider.

### 1. Deploying to Vercel
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the project.
3. Vercel automatically detects Vite:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. (The included `vercel.json` ensures SPA rewrites and caching headers work out-of-the-box).

Alternatively, using Vercel CLI:
```bash
npm i -g vercel
vercel
```

### 2. Deploying to Netlify
1. Connect your repository on [netlify.com](https://netlify.com).
2. Set build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Click **Deploy Site**. (The included `netlify.toml` handles redirects and PWA manifest headers).

Alternatively, drag and drop the `dist/` folder directly into Netlify Drop.

### 3. Deploying to GitHub Pages
1. In `package.json`, add:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```
2. Build the app:
   ```bash
   npm run build
   ```
3. Because `vite.config.js` uses `base: './'`, assets load without path issues under `https://<username>.github.io/<repo>/`.

---

## 🛡️ Architecture & Data Safety

- **Storage**: All habit completions, custom tasks, streak records, and theme preferences reside in `localStorage`.
- **Date Isolation**: Day data is keyed by ISO date string (`habitix_records_v1`), ensuring each calendar day has independent completion tracking.
- **Data Protection**:
  - `Reset Day` only unchecks items for the active date.
  - `Reset All` requires typing `"RESET"` to prevent accidental loss.
  - JSON Export & Import enables manual backup creation and device synchronization.
