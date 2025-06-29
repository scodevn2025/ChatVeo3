# CyberMind AI - Cyberpunk Chat Interface

A futuristic, cyberpunk-themed AI chat application built with Next.js, featuring real-time streaming responses from Google's Gemini AI model.

## Features

- 🌟 **Cyberpunk Aesthetic**: Neon colors, glitch effects, and futuristic design
- 🤖 **AI Integration**: Powered by Google Gemini 2.0 Flash for intelligent responses
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Streaming**: Live response streaming for immediate feedback
- 🎭 **Interactive UI**: Smooth animations and cyberpunk visual effects
- 🔒 **Secure API**: Server-side API key handling for security

## Setup Instructions

1. **Clone and Install**:
   ```bash
   npm install
   ```

2. **Get Google AI API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Copy the key

3. **Configure Environment**:
   - Open `.env.local`
   - Replace `your_google_ai_api_key_here` with your actual API key:
     ```
     GOOGLE_AI_API_KEY=your_actual_api_key_here
     ```

4. **Run the Application**:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   - Navigate to `http://localhost:3000`
   - Start chatting with CyberMind AI!

## Technology Stack

- **Framework**: Next.js 13 with App Router
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **UI Components**: shadcn/ui with custom styling
- **AI Model**: Google Gemini 2.0 Flash
- **Fonts**: Orbitron (display) and Fira Code (monospace)
- **Icons**: Lucide React

## Cyberpunk Features

- **Visual Effects**: Neon glows, glitch animations, matrix-style backgrounds
- **Typography**: Futuristic fonts with terminal-inspired styling
- **Color Scheme**: Electric blues, neon greens, deep purples
- **Animations**: Smooth transitions and cyberpunk-themed effects
- **Interactive Elements**: Hover effects and responsive feedback

## API Configuration

The application uses Google's Generative AI with the following configuration:
- Model: Gemini 2.0 Flash Experimental
- Max Output Tokens: 65,535
- Temperature: 1.0
- Safety Settings: Configured for creative use

## Security Notes

- API keys are handled server-side for security
- Environment variables are used for sensitive configuration
- Client-side code never exposes API credentials

## Customization

You can customize the cyberpunk theme by modifying:
- `app/globals.css` - Custom CSS animations and effects
- `tailwind.config.ts` - Color schemes and design tokens
- `app/page.tsx` - UI components and layout

Enjoy exploring the digital realm with CyberMind AI! 🚀🤖