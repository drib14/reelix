# Deploying Reelix on Render

This repository is pre-configured with a `render.yaml` Render Blueprint for automated deployment of both **Frontend Static Site** and **Backend Express API**.

---

## 🚀 Option 1: Automated Blueprint Deployment (Recommended)

1. Push your latest code to GitHub / GitLab.
2. Go to your [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically parse `render.yaml` and create:
   - **`reelix-api`** (Backend Express API & Static Client Fallback)
   - **`reelix-web`** (Frontend Vite React Static Site)
6. Fill in the required secret environment variables under `reelix-api`:
   - `MONGO_URI`: Your MongoDB Atlas Connection String
   - `TMDB_API_KEY`: Your TMDB API Key
   - `TMDB_READ_ACCESS_TOKEN`: Your TMDB Read Access Token
   - `GROQ_API_KEY`: Your Groq AI Key
   - `CLIENT_URL`: `https://reelix-web.onrender.com`
7. Click **Apply**. Render will automatically build both services!

---

## 📦 Option 2: Single Web Service Deployment (Turnkey Fullstack)

Reelix backend is pre-configured to automatically serve production static frontend files from `frontend/dist` when `NODE_ENV=production`:

1. Click **New +** -> **Web Service**.
2. Connect your repo and set:
   - **Name**: `reelix-app`
   - **Environment**: `Node`
   - **Build Command**: `npm install && cd frontend && npm install && npm run build`
   - **Start Command**: `node backend/index.js`
3. Add Environment Variables:
   - `PORT`: `10000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: *Your MongoDB connection string*
   - `JWT_SECRET`: *Your JWT Secret*
   - `TMDB_API_KEY`: *Your TMDB API Key*
   - `TMDB_READ_ACCESS_TOKEN`: *Your TMDB Read Access Token*
   - `GROQ_API_KEY`: *Your Groq AI Key*
4. Click **Deploy Web Service**. Your app will be live at `https://reelix-app.onrender.com`!
