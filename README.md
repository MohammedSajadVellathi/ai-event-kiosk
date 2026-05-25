# Magic Avatar AI Kiosk

A production-grade AI avatar generation kiosk — fullscreen, multi-platform, PWA-enabled.

```
project/
├── frontend/      Next.js 16 · TypeScript · Tailwind · Framer Motion · Zustand
├── backend/       FastAPI · Python — AI generation service
├── shared/        Shared type definitions
└── README.md
```

---

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm start            # serve production build
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload  # http://localhost:8000
```

---

## Session Flow

```
ATTRACT → LANGUAGE → TEMPLATE → CAMERA → PROCESSING → RESULT → PAYMENT → DELIVERY
```

| Step       | Description                                                          |
|------------|----------------------------------------------------------------------|
| Attract    | Fullscreen idle screen — tap anywhere to start                       |
| Language   | EN / हिन्दी selection                                                 |
| Template   | 2×2 grid — Sports · Corporate · Festival · Custom                    |
| Camera     | Live front camera, face guide, consent checkbox                      |
| Processing | Uploading → Face Processing → Applying Template → Finalizing         |
| Result     | Fullscreen generated image · Retake / Continue / Download · 60s reset|
| Payment    | Tier selection (Digital / Digital+Print) + UPI QR                    |
| Delivery   | QR download · WhatsApp · Email · Print                               |

---

## API Endpoints

| Method | Path         | Description                |
|--------|--------------|----------------------------|
| GET    | `/health`    | Service health check       |
| GET    | `/templates` | List available templates   |
| POST   | `/generate`  | Generate avatar from image |

### POST `/generate`

```
Content-Type: multipart/form-data
Field: image (JPEG / PNG)
```

Response:
```json
{ "success": true, "imageUrl": "https://..." }
```

---

## Architecture

### Frontend (`frontend/`)

```
app/                     Next.js App Router pages + API routes
  api/health/            GET /api/health
  api/templates/         GET /api/templates
  api/generate/          POST /api/generate (mock)
  api/payment/status/    GET /api/payment/status (mock)
components/
  screens/               8 full-screen session views
  ui/                    Shared UI primitives
features/session/        ScreenRouter + SessionManager
store/                   Zustand session state (useSessionStore)
services/api.ts          All fetch: health() · fetchTemplates() · generatePortrait()
hooks/                   useCamera · useSessionTimeout · usePaymentPolling
constants/               templates.ts (enhanced from assets/templates.json)
assets/templates.json    Template source of truth
types/                   TypeScript interfaces + bilingual label strings
```

### Backend (`backend/`)

```
app/
  main.py              FastAPI app + CORS
  routes/
    generate.py        POST /generate
    templates.py       GET /templates
  services/
    avatar.py          AI generation (mock → plug in your model here)
  models/
    schemas.py         Pydantic request/response models
storage/
  templates/           Template style assets
  outputs/             Generated image storage
```

### Adding Real AI Generation

Replace the mock in `backend/app/services/avatar.py`:

```python
async def process_avatar(image_bytes: bytes, content_type: str) -> GenerateResponse:
    # Plug in your pipeline:
    # url = await call_stable_diffusion(image_bytes)
    # url = await call_replicate(image_bytes)
    # url = await call_comfyui(image_bytes)
    return GenerateResponse(success=True, imageUrl=url)
```

---

## Platform Support

| Platform | Display mode |
|---|---|
| Mobile portrait (iOS / Android) | Responsive |
| Tablet portrait | Responsive |
| Desktop | Responsive |
| Vertical kiosk 1080×1920 | `display: fullscreen` PWA |

## License

MIT
