# CyberMind AI - Cyberpunk Chat Interface

A futuristic, cyberpunk-themed AI chat application built with Next.js, featuring real-time responses from Google's Gemini AI model and deployed on Netlify.

## 🚀 Live Demo

The application is now configured for Netlify deployment with serverless functions.

## Features

- 🌟 **Cyberpunk Aesthetic**: Neon colors, glitch effects, and futuristic design
- 🤖 **AI Integration**: Powered by Google Gemini 2.0 Flash for intelligent responses
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Serverless Functions**: Netlify Functions for secure API handling
- 🎭 **Interactive UI**: Smooth animations and cyberpunk visual effects
- 🔒 **Secure API**: Server-side API key handling for security
- 🎬 **Video Generation**: Demo mode for Veo 3.0 video synthesis

## 🛠️ Deployment Instructions

### 1. Deploy to Netlify

1. **Connect Repository**:
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: `18`

3. **Set Environment Variables**:
   - Go to Site Settings > Environment Variables
   - Add these variables:
     ```
     GOOGLE_AI_API_KEY=your_google_ai_api_key_here
     GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
     ```

4. **Get Google AI API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Copy and paste into Netlify environment variables

### 2. Manual Deployment

If you prefer manual deployment:

```bash
# Build the project
npm run build

# The 'out' folder contains the static files
# Upload the 'out' folder to Netlify manually
```

## 🔧 Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   - Create `.env.local` file
   - Add your Google AI API key:
     ```
     GOOGLE_AI_API_KEY=your_actual_api_key_here
     ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   - Navigate to `http://localhost:3000`

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes (for local development)
│   ├── globals.css        # Global styles with cyberpunk theme
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main chat interface
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── VideoGenerator.tsx # Video generation component
├── netlify/              # Netlify configuration
│   └── functions/        # Serverless functions
├── netlify.toml          # Netlify configuration
└── _redirects           # Netlify redirects
```

## 🎨 Cyberpunk Features

- **Visual Effects**: Neon glows, glitch animations, matrix-style backgrounds
- **Typography**: Futuristic fonts (Orbitron & Fira Code)
- **Color Scheme**: Electric blues, neon greens, deep purples
- **Animations**: Smooth transitions and cyberpunk-themed effects
- **Interactive Elements**: Hover effects and responsive feedback

## 🔐 Security Features

- API keys handled server-side via Netlify Functions
- Environment variables secured on Netlify
- No client-side exposure of sensitive credentials
- CORS properly configured for cross-origin requests

## 🎬 Video Generation

Currently in demo mode. To enable full video generation:

1. Set up Google Cloud authentication
2. Configure service account credentials
3. Enable Vertex AI API
4. Update Netlify Functions with proper authentication

## 🛠️ Technology Stack

- **Framework**: Next.js 13 with App Router
- **Deployment**: Netlify with serverless functions
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **UI Components**: shadcn/ui with custom styling
- **AI Model**: Google Gemini 2.0 Flash
- **Fonts**: Orbitron (display) and Fira Code (monospace)
- **Icons**: Lucide React

## 🔧 Customization

Customize the cyberpunk theme by modifying:
- `app/globals.css` - Custom CSS animations and effects
- `tailwind.config.ts` - Color schemes and design tokens
- `app/page.tsx` - UI components and layout
- `netlify/functions/` - Serverless function logic

## 🚨 Troubleshooting

### Common Issues:

1. **API Key Not Working**:
   - Ensure `GOOGLE_AI_API_KEY` is set in Netlify environment variables
   - Check that the API key is valid and has proper permissions

2. **Build Failures**:
   - Verify Node.js version is 18 or higher
   - Check that all dependencies are properly installed

3. **Functions Not Working**:
   - Ensure `netlify.toml` is properly configured
   - Check function logs in Netlify dashboard

### Support:

If you encounter issues:
1. Check the Netlify function logs
2. Verify environment variables are set correctly
3. Ensure your Google AI API key has proper permissions

---

Enjoy exploring the digital realm with CyberMind AI! 🚀🤖

**Neural networks online. Ready to deploy to the cybernet.**