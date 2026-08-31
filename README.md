# NextCineplex Dashboard

Cinema Management, Box Office POS & Concession Operations Command Center for NextCineplex multiplexes.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **State & Server Cache**: TanStack React Query v5
- **Backend & Auth**: Supabase (PostgreSQL, Row Level Security, Auth)
- **UI & Icons**: Lucide React, React Hot Toast

---

## 🚀 Getting Started

### 1. Prerequisites & Environment
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## ✨ Core Features

- **Executive Overview**: Real-time revenue metrics (`৳`), screening timetables, branch stats, and combined transaction feed.
- **Movies Catalog**: Manage upcoming and now-showing titles, posters, metadata, and status lifecycle.
- **Cinemas & Auditoriums**: Branch administration with visual interactive seat map designer (regular, premium, accessible).
- **Showtimes Scheduler**: Time slot clash-detection, price management, and status controls.
- **Box Office Bookings**: Ticket management, search, and POS live seat selection modal.
- **Concessions & Snacks**: Snack inventory management, availability toggles, and live kitchen order pipeline.
- **Dark & Light Modes**: High-contrast theme toggle with system memory.
- **Admin RBAC**: Strict administrator role verification with protected routing.
