
# Deployment Guide for VoyageurAI

This guide will walk you through deploying your VoyageurAI application to Vercel and setting up the required environment variables.

## Deploying to Vercel

### Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. API keys for the services used in the application

### Steps to Deploy

1. **Connect Your Repository**
   - Go to [Vercel](https://vercel.com/new)
   - Import your project repository
   - Configure project settings

2. **Environment Variables**
   Set up the following environment variables in your Vercel project settings:

   | Name | Value | Description |
   |------|-------|-------------|
   | `VITE_SUPABASE_URL` | `your-supabase-url` | Your Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | `your-supabase-anon-key` | Your Supabase anonymous key |
   | `VITE_GOOGLE_GEMINI_API_KEY` | `your-gemini-api-key` | Your Google Gemini API key |
   | `VITE_OPEN_WEATHER_API_KEY` | `your-openweather-api-key` | Your OpenWeather API key |

   To set these variables:
   1. Go to your Vercel project dashboard
   2. Click on "Settings" tab
   3. Navigate to "Environment Variables" section
   4. Add each variable with its corresponding value

   > **IMPORTANT**: The application requires these environment variables to function properly in production. Without them, features like itinerary generation and weather data will not work.

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy" and wait for the build process to complete
   - Vercel will provide you with a deployment URL

### Troubleshooting Common Issues

If you encounter the "Failed to generate itinerary" error:

1. **Check Environment Variables**: Ensure all required environment variables are correctly set in Vercel.
   - The Google Gemini API key (`VITE_GOOGLE_GEMINI_API_KEY`) is essential for itinerary generation.
   - You can get a Gemini API key from the [Google AI Studio](https://makersuite.google.com/app/apikey).

2. **Verify API Access**: Make sure your API keys are valid and have sufficient access/quota.

3. **Check Browser Console**: Open your browser's developer tools (F12) and check the console for error messages that might provide more details about the issue.

4. **Redeploy After Changes**: After adding environment variables, redeploy your application for the changes to take effect.

## Environment Variables Reference

Below is a complete list of environment variables used in the application:

| Variable | Description | Required | Where to Get It |
|----------|-------------|----------|----------------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes | [Supabase Dashboard](https://supabase.com/dashboard) > Project Settings > API |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes | [Supabase Dashboard](https://supabase.com/dashboard) > Project Settings > API |
| `VITE_GOOGLE_GEMINI_API_KEY` | Google Gemini API key | Yes | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `VITE_OPEN_WEATHER_API_KEY` | OpenWeather API key | Yes | [OpenWeather](https://home.openweathermap.org/api_keys) |

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Google Gemini AI Documentation](https://ai.google.dev/docs)
- [OpenWeather API Documentation](https://openweathermap.org/api)
