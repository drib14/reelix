# Reelix — Next-Gen Movie & TV Streaming Platform with AI Discovery

Reelix is a modern, high-definition movie & TV series streaming platform built with **React 18**, **Redux Toolkit**, **Node.js**, **Express**, **MongoDB**, **TMDB API**, and **Gemini AI**. It features multi-criteria filtration, multi-server streaming (6 HD mirrors), multi-season & episode chunking for series and anime, watch progress tracking, vector icons, animated hero banners, glowing skeleton loaders, and a high-contrast dark mode aesthetic.

---

## 🚀 Features & Capabilities

### 🎬 1. Multi-Criteria Media Discovery (Movies & TV Series)
* **Media Type Tabs**: Toggle between **Movies** and **TV Shows & Series** with dedicated endpoint discovery (`/discover/movie` and `/discover/tv`).
* **Multi-Provider Watch Regions**: Discover titles available on **Netflix**, **Disney+**, **Amazon Prime Video**, **Apple TV+**, **Max**, **Hulu**, **Paramount+**, and **Peacock** for any region (default region: **US**).
* **Multi-Filter Engine**: Combine **Origin Country**, **Genre**, **Release Year**, **Minimum Rating**, and **Sorting** (Popularity, Rating, Release Date).
* **Responsive Mobile Sheet Drawer**: Smooth slide-over filter sheet drawer for screens < 1024px.

### 📺 2. 6 High-Definition Streaming Servers
* Every movie, TV episode, and anime series supports **6 fast streaming servers**:
  1. **VidSrc PRO HD** (1080p / 4K)
  2. **AutoEmbed Ultra** (Fast multi-CDN)
  3. **VidSrc.me** (Multi-language subtitles)
  4. **VidSrc.icu** (Dual audio)
  5. **2Embed Premium** (Global mirror)
  6. **Direct HD Stream** (1080p MP4 Fallback)

### ⛩️ 3. Anime & TV Series Episode Explorer
* **Season Selector**: Dropdown to select Season 1, Season 2, Season 3, etc.
* **Episode Range Chunks**: Range filter chips (`[All]`, `[1-25]`, `[26-50]`, `[51-75]`, `[76-100]`, `[101+]`) for long-running series and anime.
* **Episode Jump Search**: Type an episode number to scroll instantly.
* **In-Player Navigation**: **Next Ep ▶** and **◀ Prev Ep** quick controls built into player controls.
* **Watch Progress Tracking**: Automatic `localStorage` progress saved every 5 seconds with watched percentage indicators and **NOW PLAYING** badges.

### 🤖 4. AI-Powered Recommendation Assistant
* Natural language movie & series recommendations powered by **Gemini AI / Groq AI**.
* Accessible via floating AI assistant widget and search page prompt suggestions.

### 🎨 5. High-Impact UI & Skeleton Loaders
* **Animated Hero Banner**: Auto-rotating spotlight hero banner with keyframe entry animations, rating badges, synopsis, and direct stream play.
* **Shimmering Skeleton Loaders**: Skeleton screens for hero banners, movie cards, catalog rows, and grid pages.
* **Minimalist Poster Cards**: Vector icons (`FaFire`, `FaStar`, `FaRocket`, `FaCheck`), star ratings, media type badges, and clean 1-line titles.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Redux Toolkit (RTK Query), React Router 6, Tailwind CSS, React Icons |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT), Cookie Parser |
| **Integrations** | TMDB REST API v3, Groq AI / Gemini API, Axios |
| **Styling** | Vanilla CSS Keyframes, Tailwind Utility Classes, Glassmorphism Backdrop Blur |

---

## 📂 Project Structure

```
reelix/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Connection setup
│   ├── controllers/
│   │   ├── movieController.js    # TMDB Discovery, TV details & search controllers
│   │   ├── userController.js     # User Auth & Profile management
│   │   └── aiController.js       # AI Chatbot Assistant controller
│   ├── routes/
│   │   ├── moviesRoutes.js       # Media, discovery & platform endpoints
│   │   ├── userRoutes.js         # Auth routes
│   │   └── aiRoutes.js           # AI Assistant routes
│   ├── utils/
│   │   └── tmdbService.js        # TMDB API wrapper (Movies, TV, Providers, Genres)
│   └── index.js                  # Express server entry point & static file serving
├── frontend/
│   ├── src/
│   │   ├── component/
│   │   │   ├── Explorer/         # FilterBar component with mobile drawer
│   │   │   ├── Landing/          # Hero, PlatformsMarquee, Trending, AIFeatureSection, FAQ
│   │   │   └── Skeletons/        # HeroSkeleton, CardSkeleton components
│   │   ├── pages/
│   │   │   ├── Movies/           # AllMovies, MovieDetails, MovieGrid, MovieCard, Search
│   │   │   └── Home.jsx          # Assembled Homepage
│   │   └── redux/
│   │       ├── api/              # RTK Query slices (movies, users, AI)
│   │       └── constants.js      # Environment Base URL & production resolution
├── render.yaml                   # Infrastructure-as-code deployment specification
└── package.json                  # Root Monorepo configuration
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file inside the `backend` folder:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/reelix
JWT_SECRET=your_jwt_secret_key
TMDB_API_KEY=your_tmdb_api_key
TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token
GROQ_API_KEY=your_groq_api_key
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.3-70b-versatile
CLIENT_URL=http://localhost:5173
```

For the frontend, create a `.env` file inside the `frontend` folder (optional for local dev):

```env
VITE_BASE_URL=http://localhost:3000
```

---

## 🚀 Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/reelix.git
cd reelix

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install
cd ..
```

### 2. Run Application Locally
```bash
# Option A: Run Fullstack concurrently (Backend on 3000, Frontend on 5173)
npm run fullstack

# Option B: Run Backend only
npm run backend

# Option C: Run Frontend only
npm run frontend
```

---

## 🌐 Production Deployment Guide

### Option 1: Render Deployment (Recommended via `render.yaml`)
1. Connect your GitHub repository to [Render](https://render.com/).
2. Select **Blueprints** and point to `render.yaml`.
3. Fill in secret environment variables (`MONGO_URI`, `TMDB_READ_ACCESS_TOKEN`, `GROQ_API_KEY`).
4. Click **Apply**. Render will automatically provision:
   - `reelix-api` (Express backend serving static frontend build fallback).
   - `reelix-web` (Vite static website with CDN optimization).

### Option 2: Single-Service Production Deployment
```bash
# Build frontend static assets into frontend/dist
npm run build

# Start production server (serves API & static frontend build)
NODE_ENV=production npm start
```

---

## 📋 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/movies/discover` | Multi-criteria discovery for Movies and TV Shows |
| `GET` | `/api/v1/movies/platforms` | Watch provider platforms list with TMDB logo paths |
| `GET` | `/api/v1/movies/countries` | ISO Country list |
| `GET` | `/api/v1/movies/tv-genres` | TV show genres list |
| `GET` | `/api/v1/movies/tv/:id` | Detailed TV show metadata (seasons & episode counts) |
| `GET` | `/api/v1/movies/search/:keyword` | Multi-content search across Movies and TV Shows |
| `POST` | `/api/v1/ai/chat` | Reelix AI streaming assistant recommendation chat |
| `GET` | `/health` | API health check endpoint |

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).