
# Deployment Guide for VoyageurAI

This guide will walk you through deploying your VoyageurAI application to Vercel and creating a Docker image for containerized deployment.

## Deploying to Vercel

### Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

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

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy" and wait for the build process to complete
   - Vercel will provide you with a deployment URL

### Handling Updates

For subsequent updates, simply push changes to your connected repository, and Vercel will automatically rebuild and redeploy your application.

## Creating a Docker Image

### Prerequisites

1. [Docker](https://docs.docker.com/get-docker/) installed on your machine
2. Basic familiarity with Docker commands

### Steps to Create a Docker Image

1. **Create a Dockerfile**
   Create a file named `Dockerfile` in your project root with the following content:

   ```dockerfile
   # Build stage
   FROM node:18-alpine as build

   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   # Production stage
   FROM nginx:stable-alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create an Nginx Configuration**
   Create a file named `nginx.conf` in your project root:

   ```nginx
   server {
     listen 80;
     
     location / {
       root /usr/share/nginx/html;
       index index.html;
       try_files $uri $uri/ /index.html;
     }
   }
   ```

3. **Create a .dockerignore File**
   ```
   node_modules
   dist
   .git
   .github
   .gitignore
   README.md
   .env
   .env.local
   ```

4. **Build the Docker Image**
   Open a terminal in your project directory and run:
   ```bash
   docker build -t voyageur-ai:latest .
   ```

5. **Run the Docker Container Locally (Optional)**
   ```bash
   docker run -p 8080:80 \
     -e VITE_SUPABASE_URL=your-supabase-url \
     -e VITE_SUPABASE_ANON_KEY=your-supabase-anon-key \
     -e VITE_GOOGLE_GEMINI_API_KEY=your-gemini-api-key \
     -e VITE_OPEN_WEATHER_API_KEY=your-openweather-api-key \
     voyageur-ai:latest
   ```

6. **Push to a Docker Registry (Optional)**
   First, tag your image:
   ```bash
   docker tag voyageur-ai:latest yourusername/voyageur-ai:latest
   ```
   
   Then push to Docker Hub (you'll need to be logged in):
   ```bash
   docker push yourusername/voyageur-ai:latest
   ```

## Environment Variables Reference

Below is a complete list of environment variables used in the application:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_GOOGLE_GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |
| `VITE_OPEN_WEATHER_API_KEY` | OpenWeather API key for weather data | Yes |

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Supabase Documentation](https://supabase.io/docs)
