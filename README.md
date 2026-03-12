# EduQuest 🎮⚡
> **Level Up Your Learning** — A gamified learning platform for undergraduate students.

[![React](https://img.shields.io/badge/Frontend-React+Vite-61DAFB?logo=react)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?logo=supabase)](https://supabase.com)

---

## 🚀 What is EduQuest?

EduQuest transforms boring studying into an epic learning adventure. Students earn **XP**, unlock **badges**, maintain **daily streaks**, and compete on a **global leaderboard** — all while working through structured programming challenges.

---

## ✨ Features

| Feature | Description |
|---|---|
| ⚡ XP System | Earn XP for every challenge (difficulty multiplier: Easy 1×, Medium 1.5×, Hard 2×) |
| 🏆 10 Levels | Level up as you accumulate XP (L1: 0→100 XP … L10: 7500+ XP) |
| 🔥 Daily Streaks | Complete challenges every day to keep your streak alive |
| 🏅 10 Reward Badges | Unlock badges at XP milestones (First Step → EduQuest God) |
| 📊 Progress Dashboard | XP rings, area chart (XP over time), pie chart, badge collection |
| 🥇 Global Leaderboard | Ranked by XP with podium and your rank highlighted |
| 🎨 7-Color Themes | Switch between Red, Orange, Yellow, Green, Blue, Indigo, Violet |
| 📚 30 Challenges | Across 6 courses from beginner to system design |

---

## 🛠️ Tech Stack

- **Frontend:** Vite + React, React Router DOM, Framer Motion, Recharts, react-hot-toast, Lucide React
- **Backend:** Supabase (PostgreSQL, Auth, Row Level Security, SQL Functions/Triggers)
- **Styling:** Vanilla CSS with CSS Variables (dark glassmorphism theme)
- **Deployment:** Vercel

---

## 📁 Project Structure

```
eduquest-app/
├── src/
│   ├── lib/supabase.js              # Supabase client
│   ├── context/
│   │   ├── AuthContext.jsx          # Auth state + signIn/signUp/signOut
│   │   └── ThemeContext.jsx         # 7-color CSS variable theme
│   ├── components/
│   │   ├── Layout.jsx / Navbar.jsx / Sidebar.jsx
│   │   ├── ThemeSwitcher.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx          # Public landing
│   │   ├── LoginPage.jsx / SignupPage.jsx
│   │   ├── DashboardPage.jsx        # XP ring, stat cards, recent activity
│   │   ├── ChallengesPage.jsx       # Challenges grouped by course
│   │   ├── ChallengeDetailPage.jsx  # Complete challenge + XP + level-up modal
│   │   ├── ProgressPage.jsx         # Charts, rings, badge collection
│   │   ├── LeaderboardPage.jsx      # Podium + ranked list
│   │   └── ProfilePage.jsx          # Edit username, stats, badges
│   ├── App.jsx                      # Router + Providers
│   └── index.css                    # Global dark theme CSS
└── .env                             # VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
```

---

## ⚙️ Setup Guide

### 1. Install dependencies
```bash
cd eduquest-app
npm install
```

### 2. Configure environment variables
Create `.env` in `eduquest-app/`:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run locally
```bash
npm run dev
# Open http://localhost:5173
```

### 4. Build for production
```bash
npm run build
```

---

## 🗄️ Database Schema

```
profiles        — user XP, level, streak, last_active
courses         — 6 programming courses
challenges      — 30 challenges (5 per course)
user_progress   — completed challenges per user
rewards         — 10 badge definitions (XP milestones)
user_rewards    — unlocked badges per user
leaderboard     — VIEW ranked by XP
```

### Key SQL Functions
| Function | Purpose |
|---|---|
| `handle_new_user()` | Trigger: auto-creates profile on signup |
| `complete_challenge(user_id, challenge_id)` | Marks complete, awards XP, updates streak |
| `award_xp(user_id, amount)` | Increments XP, recalculates level, unlocks badges |
| `update_streak(user_id)` | Increments or resets daily streak |
| `calculate_level(xp)` | Returns level 1–10 based on XP thresholds |
| `get_leaderboard(limit)` | Returns top N users ranked by XP |

---

## 🚀 Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project → select repo
3. Set **Root Directory** to `eduquest-app`
4. Add environment variables: `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy** ✅

---

## 📈 Gamification

### XP & Levels
| Level | XP Required |
|---|---|
| 1 | 0 |
| 2 | 100 |
| 3 | 250 |
| 4 | 500 |
| 5 | 1,000 |
| 6 | 2,000 |
| 7 | 3,500 |
| 8 | 5,000 |
| 9 | 7,500 |
| 10 | 10,000 |

### Reward Badges
🌱 First Step · ⚡ Apprentice · 🔭 Explorer · ⚔️ Challenger · 📚 Scholar  
🏆 Master · 👑 Legend · 💎 Champion · 🌟 Grandmaster · 🔱 EduQuest God

---

## 🎨 Seven Color Themes
Red · Orange · Yellow · Green · Blue · **Indigo (default)** · Violet

---

*Built with ❤️ for EduQuest — Level Up Your Learning*
