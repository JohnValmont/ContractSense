# ContractSense - Deployment Guide

This repository contains the codebase for ContractSense. The architecture is split into a Next.js frontend and a Python Flask backend.

Follow these steps to deploy to your preferred platforms:

## 1. Supabase (Database & Auth)
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. In the frontend `.env.local` file, you will need to add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
*(Note: Supabase auth is integrated into the frontend structure. To fully lock down the dashboard, you would add Supabase middleware, but for the hackathon demo, the upload routes are directly accessible).*

## 2. GitHub
1. Create a new empty repository on GitHub.
2. In your terminal, run the following commands:
   ```bash
   git add .
   git commit -m "Initial commit - ContractSense AAA"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## 3. Render (Backend)
1. Go to [Render](https://render.com/) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Set the **Root Directory** to `backend`.
4. Set the **Build Command** to:
   ```bash
   pip install -r requirements.txt
   ```
5. Set the **Start Command** to:
   ```bash
   gunicorn main:app
   ```
6. **Environment Variables:**
   Add `GEMINI_API_KEY` in the Render environment settings with your Google Gemini API key.

## 4. Vercel (Frontend)
1. Go to [Vercel](https://vercel.com/) and import your GitHub repository.
2. Set the **Root Directory** to `frontend`.
3. Vercel will automatically detect that it's a Next.js project.
4. **Environment Variables:**
   Add `NEXT_PUBLIC_BACKEND_URL` and set it to your deployed Render URL (e.g., `https://contract-sense-backend.onrender.com`). *Note: You'll need to update the `fetch` call in `src/app/dashboard/page.tsx` to use this environment variable instead of `http://localhost:8000`.*
5. Click **Deploy**.

## Running Locally
**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```
