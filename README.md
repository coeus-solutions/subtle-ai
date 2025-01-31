# SubtleAI

A modern web application for generating AI-powered subtitles for your videos. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🎥 Easy video upload and management
- 🤖 AI-powered subtitle generation in multiple languages
- 📝 Download subtitles in SRT/VTT formats
- 🌐 Modern, responsive UI with real-time preview
- 🔒 Secure user authentication
- 📊 Usage analytics and billing management

## Getting Started

### Prerequisites

- Node.js 16 or later
- npm 7 or later
- Backend API running (see [SubtleAI API](https://github.com/coeus-solutions/api-subtle-ai))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/coeus-solutions/subtle-ai
cd subtleai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment:
```bash
cp .env.example .env.development
```
Edit `.env.development` and set your API URL if different from the default.

### Development

Run the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Building for Production

1. Create production environment file:
```bash
cp .env.example .env.production
```
Edit `.env.production` with your production API URL.

2. Build the application:
```bash
npm run build
```

3. Preview the production build:
```bash
npm run preview
```

## Environment Variables

- `VIDEO_ANALYZER_API_URL`: Base URL for the backend API
  - Development: `http://localhost:8000/api/v1`
  - Production: Your production API URL

The application uses different environment files for development and production:
- `.env.development` - Used when running `npm run dev`
- `.env.production` - Used when building for production

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Formik & Yup
- Lucide Icons

## License

MIT License - see LICENSE file for details 