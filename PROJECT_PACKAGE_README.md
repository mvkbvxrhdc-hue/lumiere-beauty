# Lumiere Beauty Full-Stack Project Package

This folder contains the complete Lumiere Beauty MVP package.

## Main Code

- Backend: `app`
- Frontend: `frontend_latest`
- Model training data: `data`
- Trained model artefacts: `app/ml_models`
- Technical report assets: `Technical Report 图片`

## Local Run

Backend:

```bash
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Frontend:

```bash
cd frontend_latest
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

## Cloud Deployment

- Backend can be deployed with `Dockerfile` or `render.yaml`.
- Frontend can be deployed from `frontend_latest`.
- Set `BACKEND_API_BASE_URL` in the frontend host to the deployed backend URL.
- Set `ALLOWED_ORIGINS` in the backend host to include the deployed frontend URL.
