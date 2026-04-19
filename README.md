# 🚀 Prompt Mastery - AI Prompt Generator

A full-stack web application that helps users create professional, AI-optimized prompts by answering guided questions. Get instant recommendations and copy-paste-ready prompts for ChatGPT, Claude, and other AI assistants.

## ✨ Features

- **Step-by-Step Wizard**: Multi-step form with MCQ format for easy project information gathering
- **Frontend Questions**: Color palette, navbar position, page count, framework selection, etc.
- **Backend Questions**: Database choice, ORM selection, API type, authentication, etc.
- **AI Prompt Generation**: Automatically generates professional prompts from collected data
- **Smart Recommendations**: Suggests features and best practices for the project
- **Beautiful UI**: Dark theme with responsive design
- **Copy-to-Clipboard**: One-click copying of generated prompts

## 📋 Project Structure

```
Prompt-Mastry/
├── backend/              # Express.js + Prisma
│   ├── server.js        # Express server
│   ├── routes/          # API routes
│   │   ├── projects.js  # CRUD operations
│   │   ├── questions.js # Fetch all questions
│   │   └── generate.js  # Generate prompts & recommendations
│   ├── utils/           # Helper functions
│   │   ├── promptGenerator.js      # Prompt generation logic
│   │   └── recommendations.js      # Recommendations logic
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   ├── .env             # Environment variables
│   └── package.json
│
└── frontend/            # Next.js 15
    ├── app/
    │   ├── page.tsx           # Home page
    │   ├── builder/page.tsx   # Multi-step form
    │   ├── results/[id]/page.tsx # Results page
    │   ├── layout.tsx         # Root layout
    │   └── globals.css
    ├── .env.local       # Frontend env variables
    └── package.json
```

## 🛠️ Tech Stack

### Backend
- **Express.js** - Web framework
- **Prisma** - ORM for database management
- **SQLite** - Database (default)
- **CORS** - Cross-origin resource sharing
- **Node.js** - Runtime

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hooks** - State management

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Initialize Prisma database:
```bash
npx prisma migrate dev --name init
```

4. Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🚀 Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Then open `http://localhost:3000` in your browser.

## 📚 API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Questions
- `GET /api/questions` - Get all questionnaire questions

### Generate Prompt
- `POST /api/generate` - Generate prompt and recommendations (no save)
- `POST /api/generate/save` - Generate and save to database
- `GET /api/generate/:projectId` - Get generated prompt for project

## 🎨 How It Works

### User Flow

1. **Home Page**: User sees overview and clicks "Get Started"
2. **Builder Form**: User goes through 5 steps:
   - **Basics**: Project type, AI usage, project name
   - **Frontend**: Color palette, navbar, pages, framework, UI library
   - **Backend**: Database, ORM, authentication, API type, runtime
   - **Additional**: Deployment platform, additional features
   - **Review**: Review all answers before generating
3. **Generate**: Click "Generate Prompt" button
4. **Results**: 
   - See generated prompt
   - View categorized recommendations
   - Copy prompt to clipboard
   - Quick links to AI assistants (ChatGPT, Claude, Gemini)

### Backend Flow

1. Questions data is returned by `/api/questions` endpoint
2. User submits form data to `/api/generate/save`
3. Backend generates:
   - Professional AI prompt from project data
   - Smart recommendations based on project type and features
4. Results stored in SQLite database via Prisma
5. Results displayed in frontend

## 📝 Generated Prompt Includes

- Project overview with type, name, and AI requirements
- Frontend requirements (if applicable)
- Backend requirements (if applicable)
- Additional features list
- Deployment information
- Code quality standards
- Deliverables checklist
- Instructions for AI assistant

## 💡 Recommendations Cover

### Categories
- Frontend (TypeScript, Analytics, Form Validation, State Management)
- Backend (Testing, Logging, Rate Limiting, Documentation)
- AI Features (Model selection, Prompt engineering, Cost management)
- General (Environment setup, Error handling, SEO, Security, CI/CD, Backups)

## 🔧 Customization

### Add More Questions
Edit `backend/routes/questions.js` to add new questions in any category.

### Modify Prompt Template
Edit `backend/utils/promptGenerator.js` to customize the prompt format.

### Update Recommendations
Edit `backend/utils/recommendations.js` to add/modify recommendations logic.

### Change Database
Update `backend/prisma/schema.prisma` and `.env` to use PostgreSQL, MySQL, etc.

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Reinitialize Prisma
npx prisma migrate reset
```

### Frontend can't connect to backend
```bash
# Make sure backend is running on port 5000
# Check .env.local has correct API URL
# Check CORS is properly configured in server.js
```

### Database issues
```bash
# Reset database
npx prisma migrate reset

# Open Prisma Studio to inspect database
npx prisma studio
```

## 📚 Available Scripts

### Backend
- `npm run dev` - Start development server
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:migrate` - Run database migrations

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Backend (Node.js)
- Deploy to Heroku, Railway, Render, or AWS
- Update `DATABASE_URL` environment variable
- Update `FRONTEND_URL` CORS configuration

### Frontend (Next.js)
- Deploy to Vercel, Netlify, or AWS
- Update `NEXT_PUBLIC_API_URL` environment variable

## 📄 License

MIT

## 👨‍💻 Contributing

Feel free to fork and improve!

---

**Happy Prompting! 🎉** Create better prompts and get better results from AI assistants.
