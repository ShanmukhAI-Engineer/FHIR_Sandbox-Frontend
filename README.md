# SynthFHIR - Complete Full-Stack Application

🏥 **Modern Next.js frontend + FastAPI backend for synthetic FHIR data generation**

---

## 📁 Repository Contents

This repository contains:

1. **Next.js Frontend** (`synthfhir-frontend/`) - Modern web application
2. **FastAPI Backend Docs** (`backend_docs/`) - API implementation templates
3. **Deployment Guides** - Complete AWS and Vercel setup instructions

---

## 🚀 Quick Start

### Frontend Setup

```bash
cd synthfhir-frontend
npm install
npm run dev
```

Visit http://localhost:3000

### Backend Setup

See [`backend_docs/README.md`](backend_docs/README.md) for integration into your FHIR_Sandbox repository.

---

## 🎨 Features

### Frontend
- ✨ Purple gradient theme with glassmorphism
- 📱 Fully responsive design
- 🔄 Real-time LLM status monitoring
- 📊 Data generation with natural language
- 📁 Knowledge base management
- 📥 CSV export functionality

### Backend API
- 🔌 RESTful API with FastAPI
- ✅ Pydantic validation
- 🔐 OAuth2 enterprise LLM support
- 📚 RAG-enhanced generation
- 🗄️ Vector store integration

---

## 📚 Documentation

- **[Frontend README](synthfhir-frontend/README.md)** - Setup and development
- **[Backend Integration Guide](backend_docs/README.md)** - API implementation
- **[Deployment Guide](DEPLOYMENT.md)** - AWS & Vercel deployment
- **[GitHub Setup](GITHUB_SETUP.md)** - Repository initialization
- **[Walkthrough](https://github.com/.../walkthrough.md)** - Complete implementation guide

---

## 🏗️ Architecture

```
┌─────────────────────┐
│   Next.js Frontend  │
│   (Vercel)          │
│   Port: 3000        │
└──────────┬──────────┘
           │
           │ HTTP/REST
           │
┌──────────▼──────────┐
│  FastAPI Backend    │
│  (AWS ECS/Fargate)  │
│  Port: 8000         │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
┌───▼────┐   ┌───▼─────┐
│  LLM   │   │ Vector  │
│  API   │   │  Store  │
└────────┘   └─────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React Icons

### Backend
- FastAPI
- Pydantic
- Python 3.11
- ChromaDB (vector store)

---

## 📦 Deployment

### Frontend → Vercel
```bash
# Push to GitHub
git push origin main

# Import to Vercel
# Set NEXT_PUBLIC_API_URL
# Deploy
```

### Backend → AWS ECS
See detailed guide in [`DEPLOYMENT.md`](DEPLOYMENT.md)

---

## 🧩 Integration with Existing FHIR_Sandbox

This frontend is designed to work with the [FHIR_Sandbox](https://github.com/ShanmukhAI-Engineer/FHIR_Sandbox) backend.

**Integration Steps:**
1. Add `backend_docs/` files to FHIR_Sandbox repo as `api/` folder
2. Install FastAPI dependencies
3. Run backend: `uvicorn api.main:app --reload`
4. Update frontend `NEXT_PUBLIC_API_URL` to backend URL

---

## 📸 Screenshots

### Dashboard
![Dashboard with features and getting started](docs/screenshots/dashboard.png)

### Generate Data
![Generation page with form and filters](docs/screenshots/generate.png)

### Knowledge Base
![Knowledge management with upload](docs/screenshots/knowledge.png)

### Results
![Data table with export options](docs/screenshots/results.png)

*(Screenshots to be added after deployment)*

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

Same as [FHIR_Sandbox](https://github.com/ShanmukhAI-Engineer/FHIR_Sandbox) repository.

---

## 🙏 Acknowledgments

- Built on top of [FHIR_Sandbox](https://github.com/ShanmukhAI-Engineer/FHIR_Sandbox) backend
- Uses FHIR R4 specification
- Inspired by modern healthcare data generation needs

---

## 📧 Support

**Frontend Issues**: Create issue in this repository
**Backend/API Issues**: Create issue in [FHIR_Sandbox](https://github.com/ShanmukhAI-Engineer/FHIR_Sandbox)

---

**Built with ❤️ using Next.js and FastAPI**
