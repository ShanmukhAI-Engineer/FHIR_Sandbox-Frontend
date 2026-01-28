# FOR THE BACKEND (TO BE ADDED TO EXISTING GITHUB REPO)

This folder contains documentation on how to add the FastAPI backend to your existing repository:
https://github.com/ShanmukhAI-Engineer/FHIR_Sandbox/tree/main

## Backend Structure to Add

Add these files to your existing repo:

```
FHIR_Sandbox/
├── api/                    # NEW FOLDER
│   ├── main.py            # FastAPI application
│   ├── models.py          # Pydantic models
│   ├── routes/            # API routes
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── generation.py
│   │   ├── knowledge.py
│   │   ├── llm.py
│   │   └── export.py
│   └── requirements.txt   # Additional FastAPI dependencies
├── [existing files...]
```

## Installation

1. Add FastAPI dependencies to your requirements.txt:
```bash
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-multipart==0.0.6
```

2. Run the backend:
```bash
uvicorn api.main:app --reload --port 8000
```

## Environment Variables

Add to your `.env`:
```
ENTERPRISE_BASE_URL=your_llm_api_url
ENTERPRISE_CLIENT_ID=your_client_id
ENTERPRISE_CLIENT_SECRET=your_client_secret
```

## Backend Files

See the individual files in this `backend_docs` folder for the complete implementation.

## CORS Configuration

The backend is configured to accept requests from:
- http://localhost:3000 (Next.js dev server)
- http://localhost:8000 (FastAPI docs)

Update `api/main.py` CORS settings for production deployment.
