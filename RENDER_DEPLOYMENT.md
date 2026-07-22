# Deploying Reelix on Render

This repository is pre-configured with a `render.yaml` Render Blueprint for 1-click automated deployment of both the **Frontend** and **Backend**.

---

## Option 1: Automatic Deployment using Render Blueprint (Recommended)

1. Push your repository to GitHub / GitLab.
2. Go to your [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically read `render.yaml` and create two services:
   - **`reelix-api`** (Backend Express API Web Service)
   - **`reelix`** (Frontend Vite React Static Site; if `reelix` is already taken on Render, rename it to `reelix-web`)
6. Fill in the required secret environment variables under `reelix-api` in the Render dashboard:
   - `MONGO_URI`: Your MongoDB Atlas Connection String
   - `TMDB_API_KEY`: Your TMDB API Key (`4206e3afce442757c35211b9dc03cab1`)
   - `TMDB_READ_ACCESS_TOKEN`: Your TMDB Read Token
   - `GROQ_API_KEY`: Your Groq AI Key (`gsk_...`)
7. Click **Apply**. Render will automatically build both services!

---

## Option 2: Manual Deployment on Render

### Step A: Deploy Backend Service (`reelix-api`)

1. Click **New +** -> **Web Service**.
2. Connect your repo and set:
   - **Name**: `reelix-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start`
3. Add Environment Variables:
   - `PORT`: `10000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: *Your MongoDB connection string*
   - `JWT_SECRET`: *Any secret key*
   - `TMDB_API_KEY`: `4206e3afce442757c35211b9dc03cab1`
   - `GROQ_API_KEY`: `gsk_...`
   - `CLIENT_URL`: `https://reelix.onrender.com` (or `https://reelix-web.onrender.com`)

---

### Step B: Deploy Frontend Static Site (`reelix` / `reelix-web`)

1. Click **New +** -> **Static Site**.
2. Connect your repo and set:
   - **Name**: `reelix` *(if taken, use `reelix-web`)*
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `./frontend/dist`
3. Add Environment Variables:
   - `VITE_BASE_URL`: `https://reelix-api.onrender.com` (Your backend URL)
4. Add Rewrite Rule (under Redirects / Rewrites):
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
