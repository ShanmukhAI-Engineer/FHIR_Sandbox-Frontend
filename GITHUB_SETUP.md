# GitHub Repository Setup Guide

This guide will help you push the code to a new GitHub repository.

## Prerequisites

- Git installed on your system
- GitHub account
- GitHub CLI (optional but recommended)

## Option 1: Using GitHub CLI (Recommended)

```bash
# Navigate to project directory
cd c:\Users\User\Downloads\Sandbox-FE

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: SynthFHIR Next.js frontend with FastAPI backend docs"

# Create GitHub repo and push (GitHub CLI will prompt for details)
gh repo create synthfhir-frontend --public --source=. --remote=origin --push
```

## Option 2: Using Git + GitHub Web Interface

### Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `synthfhir-frontend`
3. Description: "Modern Next.js frontend for SynthFHIR Synthetic FHIR Data Generator"
4. Keep it Public or Private (your choice)
5. Do NOT initialize with README (we already have one)
6. Click "Create repository"

### Step 2: Push Code

```bash
# Navigate to project directory
cd c:\Users\User\Downloads\Sandbox-FE

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: SynthFHIR Next.js frontend with FastAPI backend docs"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/synthfhir-frontend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## What Gets Pushed

```
synthfhir-frontend/          # Next.js frontend
├── src/                     # All source code
├── public/                  # Static assets
├── .env.local              # Environment template
├── package.json            # Dependencies
├── README.md               # Frontend docs
└── ...

backend_docs/               # FastAPI backend documentation
├── README.md              # Integration guide
├── main.py                # FastAPI app template
├── models.py              # Pydantic models
├── routes_*.py            # API routes (5 files)
├── Dockerfile             # Container config
└── requirements_additions.txt

DEPLOYMENT.md              # AWS deployment guide

.gitignore                 # Git ignore rules
README.md                  # Project overview (create this)
```

## .gitignore Recommendations

Create a `.gitignore` file in the root:

```
# Node
node_modules/
.next/
out/
build/
dist/

# Environment
.env.local
.env*.local

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# IDE
.vscode/
.idea/
*.swp
*.swo

# Python (if adding backend later)
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.venv
```

## After Pushing

### 1. Update Repository Description

On GitHub, add topics:
- `nextjs`
- `fastapi`
- `fhir`
- `synthetic-data`
- `healthcare`
- `typescript`

### 2. Create Release

```bash
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0
```

### 3. Enable GitHub Pages (Optional)

If you want to host docs:
- Settings → Pages
- Source: Deploy from branch
- Branch: main / docs
- Save

### 4. Set Up GitHub Actions (Optional)

For CI/CD, create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd synthfhir-frontend && npm ci
      - run: cd synthfhir-frontend && npm run build
```

## Verify Upload

After pushing, visit:
```
https://github.com/YOUR_USERNAME/synthfhir-frontend
```

You should see:
- ✅ All folders and files
- ✅ README.md displayed on homepage
- ✅ Proper file structure

## Next Steps

1. **Deploy frontend to Vercel**:
   - Connect GitHub repo to Vercel
   - Set `NEXT_PUBLIC_API_URL` environment variable
   - Deploy

2. **Integrate backend into FHIR_Sandbox repo**:
   - Follow `backend_docs/README.md`
   - Add files to existing repo

3. **Deploy backend to AWS ECS**:
   - Follow `DEPLOYMENT.md`

## Troubleshooting

### Large files error

If you get "file too large" error:

```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "*.psd"
git lfs track "*.zip"

# Add .gitattributes
git add .gitattributes
git commit -m "Add Git LFS tracking"
```

### Permission denied (publickey)

Use HTTPS instead of SSH, or set up SSH keys:

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub: Settings → SSH and GPG keys
```

---

Your code is now on GitHub! 🎉
