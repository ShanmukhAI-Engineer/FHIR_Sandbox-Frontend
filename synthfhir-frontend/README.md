# SynthFHIR - Next.js Frontend

🏥 Modern Next.js frontend for the SynthFHIR Synthetic FHIR Data Generator

## Overview

This is a professional, enterprise-grade Next.js frontend that replaces the original Streamlit UI with a modern, responsive web application featuring a purple gradient theme and glassmorphism design.

## Features

✨ **Modern UI/UX**
- Purple gradient theme with glassmorphism effects
- Responsive design (desktop and mobile)
- Smooth animations and micro-interactions
- Dark mode optimized

🎯 **Core Functionality**
- **Generate**: Create synthetic FHIR data with natural language prompts
- **Knowledge Base**: Manage DDL files and guidelines
- **Results**: Preview and export generated data as CSV
- **Settings**: View LLM configuration and system status

🔧 **Technical Stack**
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Lucide React for icons
- RESTful API client

## Project Structure

```
synthfhir-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with sidebar
│   │   ├── page.tsx            # Dashboard/Home
│   │   ├── generate/page.tsx   # Main generation UI
│   │   ├── knowledge/page.tsx  # Knowledge base management
│   │   ├── results/page.tsx    # View & export results
│   │   ├── settings/page.tsx   # LLM & app settings
│  │   └── globals.css         # Design system & styles
│   ├── components/
│   │   └── layout/             # Layout components
│   │       ├── Sidebar.tsx     # Navigation sidebar
│   │       └── Header.tsx      # LLM status header
│   └── lib/
│       ├── api.ts              # API client
│       └── types.ts            # TypeScript types
├── .env.local                  # Environment variables
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see backend_docs/)

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Update API URL in .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

```bash
# Run development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, update this to your deployed backend URL.

## Available Pages

### 1. Dashboard (`/`)
- Feature overview
- Quick stats
- Getting started guide
- Quick actions

### 2. Generate (`/generate`)
- Natural language prompt input
- Resource selection (Patient, Coverage, Claim, Observation)
- Quick filters (age, gender, state, insurance)
- LLM settings (temperature, max tokens)
- Output options (MD5 hashing, validation)
- Real-time generation results

### 3. Knowledge Base (`/knowledge`)
- View indexed documents per resource
- Index/reindex documents
- Upload new guidelines
- DDL status indicators

### 4. Results (`/results`)
- Preview generated data in tables
- Export to CSV
- Copy as JSON
- Download files

### 5. Settings (`/settings`)
- LLM configuration status
- Enterprise OAuth2 credentials check
- Default settings display
- Enabled resources list

## Design System

### Color Palette (Purple Theme)

```css
--color-primary: 147 51 234;        /* Purple-600 */
--color-primary-dark: 126 34 206;   /* Purple-700 */
--color-accent: 192 132 252;        /* Purple-400 */
--color-bg-dark: 15 23 42;          /* Slate-900 */
--color-bg-card: 30 41 59;          /* Slate-800 */
```

### Components

- **Glass Cards**: Glassmorphism with backdrop blur
- **Buttons**: Gradient primary, solid secondary
- **Inputs**: Dark themed with purple focus rings
- **Badges**: Status indicators with color coding

## API Integration

The frontend communicates with the FastAPI backend via `src/lib/api.ts`:

- `GET /api/config` - Get app configuration
- `POST /api/generate` - Generate synthetic data
- `GET /api/knowledge/status` - Knowledge base stats
- `POST /api/knowledge/index` - Index documents
- `GET /api/llm/status` - LLM configuration status
- `POST /api/export/{resource}` - Export to CSV

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### AWS Amplify

1. Connect GitHub repository
2. Set build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
3. Add environment variables
4. Deploy

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Performance

- Optimized bundle size
- Code splitting per route
- Image optimization
- API response caching

## Contributing

See the main FHIR_Sandbox repository for contribution guidelines.

## License

Same as FHIR_Sandbox repository.

## Support

For issues related to:
- **Frontend**: Create issue in synthfhir-frontend repo
- **Backend/API**: Create issue in FHIR_Sandbox repo

---

Built with ❤️ using Next.js 14
