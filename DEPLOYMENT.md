# Deployment Guide — PaperMind & CodeSage

Both projects follow the same pattern:
- **Backend** → Render.com (free tier)
- **Frontend** → Vercel (free tier)

---

## Step 0 — Get your free Groq API key

1. Go to https://console.groq.com
2. Sign up (free, no credit card)
3. Click **API Keys → Create API Key**
4. Copy the key — you'll need it for both backends

---

## PAPERMIND

### Backend (Render)

1. Push `papermind/backend/` to a new GitHub repo named `papermind-backend`
2. Go to https://render.com → **New → Web Service**
3. Connect your GitHub repo
4. Fill in:
   - **Name:** `papermind-backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click **Environment → Add Environment Variable**:
   - Key: `GROQ_API_KEY`
   - Value: (your key from Step 0)
6. Click **Deploy**
7. Wait ~3 minutes. Copy your URL: `https://papermind-backend-xxxx.onrender.com`

> ⚠️ First request after cold start takes ~60 seconds (model download). Normal after that.

### Frontend (Vercel)

1. Push `papermind/frontend/` to a new GitHub repo named `papermind-frontend`
2. Go to https://vercel.com → **Add New Project**
3. Import your `papermind-frontend` repo
4. In **Environment Variables**, add:
   - Key: `VITE_API_URL`
   - Value: `https://papermind-backend-xxxx.onrender.com` (your Render URL)
5. Click **Deploy**
6. Your live URL: `https://papermind-frontend.vercel.app` (or custom name)

---

## CODESAGE

### Backend (Render)

1. Push `codesage/backend/` to a new GitHub repo named `codesage-backend`
2. Go to https://render.com → **New → Web Service**
3. Connect your GitHub repo
4. Fill in:
   - **Name:** `codesage-backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Environment Variables:
   - Key: `GROQ_API_KEY`
   - Value: (your key from Step 0)
6. Deploy. Copy URL: `https://codesage-backend-r2fj.onrender.com`

> CodeSage backend is lightweight — no model download, starts fast.

### Frontend (Vercel)

1. Push `codesage/frontend/` to a new GitHub repo named `codesage-frontend`
2. Vercel → **Add New Project** → import `codesage-frontend`
3. Environment Variables:
   - Key: `VITE_API_URL`
   - Value: `https://codesage-backend-r2fj.onrender.com`
4. Deploy

---

## After deploying both

1. Test PaperMind: upload a PDF → ask a question
2. Test CodeSage: paste Python code → click Review
3. Add live URLs to your resume
4. Add live URLs and screenshots to GitHub READMEs
5. Start applying!

---

## Running locally (for development)

### Backend
```bash
cd papermind/backend          # or codesage/backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
uvicorn main:app --reload
```
Backend runs at http://localhost:8000 (PaperMind) or :8001 (CodeSage)

### Frontend
```bash
cd papermind/frontend         # or codesage/frontend
npm install
cp .env.example .env.local
# Edit .env.local: VITE_API_URL=http://localhost:8000
npm run dev
```
Frontend runs at http://localhost:5173

---

## Common issues

| Problem | Fix |
|---------|-----|
| "GROQ_API_KEY not found" | Add env variable in Render dashboard |
| CORS error in browser | Backend is not running — check Render logs |
| First PaperMind request times out | Wait 90 seconds, try again (model loading) |
| Vercel shows blank page | Check VITE_API_URL is set correctly in Vercel env |
| "No text found" on PDF | PDF is image-based (scanned). Use a text-based PDF |
| Render service sleeping | Free tier sleeps after 15 min — first request is slow |
