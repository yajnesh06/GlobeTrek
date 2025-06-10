# GlobeTrekAI Travel Planner

**GlobeTrekAI** is a modern AI-powered travel planning application that helps you create fully personalized trip itineraries based on your interests, travel style, and budget.

---

## ✨ Features

- 🧠 **AI-Generated Personalized Trip Itineraries**
- 💰 **Interactive Budget Planning** with detailed breakdowns
- 📅 **Day-by-Day Activity Scheduling**
- ☀️ **Real-Time Weather Integration**
- ⚡ **Fast Image Loading** using optimized caching & parallel processing
- 📍 **Curated Travel Highlights**: attractions, hidden gems, and local food
- 💬 **Interactive AI Chat Assistant** to guide and assist
- 💾 **Trip Saving & Management Dashboard**
- 🔗 **Trip Sharing** via link, email, or social media
- 🧭 **Multi-Step Trip Form** with Zod validation and guidance
- 🎛️ **Customizable Travel Preferences**
- 📱 **Fully Responsive UI** for desktop, tablet, and mobile

---

## 🛠️ Technology Stack

- **Frontend**: React (TypeScript) + Vite
- **Styling**: Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: React Context API, TanStack Query
- **Authentication & Database**: Supabase (OAuth + Postgres)
- **AI Services**: Google Gemini API
- **Weather Data**: OpenWeatherMap API
- **Image Services**: Wikipedia, Unsplash, Pexels
- **Form Validation**: React Hook Form + Zod
- **Autocomplete**: Geoapify for location prediction

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v8+) or Bun
- Supabase project + keys
- API keys for:
  - OpenWeatherMap
  - Google Gemini AI
  - (Optional) Unsplash, Pexels for richer imagery

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd GlobeTrek
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Create `.env` in root with the following:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_UNSPLASH_API_KEY=your_unsplash_api_key
   VITE_PEXELS_API_KEY=your_pexels_api_key
   ```

4. Start development server:
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. Visit: `http://localhost:8080`

---

## 🧭 Usage Guide

### Plan a New Trip

1. Go to **Plan Trip**
2. Enter:
   - Destination, dates
   - Travelers count
   - Budget & interests
   - Accommodation, transport type
3. Click **Generate Itinerary**
4. Get:
   - Daily activities
   - Budget breakdown
   - AI-powered recommendations
5. Save the trip to your dashboard

### Manage Trips

- Access **Saved Trips**
- View, edit, or delete itineraries

### Use AI Travel Assistant

- Open any trip → click **chat icon**
- Ask:
  - Local tips
  - Food or activity suggestions
  - Safety or etiquette help

### Share Trips

- Open itinerary → click **Share**
- Choose from:
  - Social, messaging, or email
  - Copy link if unsupported

---

## 📁 Project Structure

```
/src
  ├── components        # UI elements
  ├── contexts          # React context providers
  ├── hooks             # Custom React hooks
  ├── lib               # API & utility functions
  │    ├── gemini.ts
  │    ├── supabase.ts
  │    ├── weather.ts
  │    └── imageService.ts
  ├── pages             # Application pages
  └── types             # Global TypeScript types
```

---

## ⚙️ Performance Optimizations

- **Parallel Image Processing**: Faster image loading
- **Smart Caching**: Reduces repeat API calls
- **Lazy Loading**: Loads only what's needed
- **API Timeout Optimization**: Faster fallback responses
- **Preloading Key Resources**: Faster perceived performance

---

## 🤝 Contributing

We welcome contributions! 💡

1. Fork the repo
2. Create feature branch:  
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit & push:
   ```bash
   git commit -m "Add YourFeature"
   git push origin feature/YourFeature
   ```
4. Open a Pull Request 🎉

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) – Weather data
- [Google Gemini AI](https://deepmind.google/) – AI travel assistance
- [shadcn/ui](https://ui.shadcn.com/) – UI components
- [Unsplash](https://unsplash.com/), [Pexels](https://pexels.com/), [Wikipedia](https://wikipedia.org/) – Image services
- [Geoapify](https://www.geoapify.com/) – Location autocomplete