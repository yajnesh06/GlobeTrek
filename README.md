# GlobeTrekAI Travel Planner

A modern travel planning application powered by AI that helps you create personalized trip itineraries based on your preferences, interests, and travel style.

## Features

- **AI-Generated Personalized Trip Itineraries**: Create custom travel plans tailored to your specific preferences
- **Interactive Budget Planning**: Set your travel budget and see detailed cost breakdowns for accommodations, food, transportation, and activities
- **Day-by-Day Activity Planning**: Get a comprehensive timeline of activities for each day of your trip
- **Real-Time Weather Information**: View current weather data for your destination to help with planning
- **Travel Highlights**: Discover curated attractions, hidden gems, restaurants, and local foods
- **Interactive AI Chat Assistant**: Get answers to your trip-related questions from our AI travel guide
- **Trip Saving & Management**: Save and manage multiple trip itineraries in your personal dashboard
- **Responsive Design**: Enjoy a seamless experience across desktop, tablet, and mobile devices

## Technology Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API & TanStack Query
- **Data Storage**: Supabase (authentication and database)
- **Weather Data**: OpenWeatherMap API
- **AI Integration**: Google Gemini AI

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- A Supabase account (for authentication and database)
- API keys for OpenWeatherMap and Google Gemini AI

### Installation and Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd GlobeTrek
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your API keys and Supabase configuration:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     VITE_OPENWEATHER_API_KEY=your_openweather_api_key
     VITE_GEMINI_API_KEY=your_gemini_api_key
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:8080`

## Usage Guide

### Creating a New Trip

1. Navigate to the "Plan Trip" page
2. Fill in your trip details:
   - Destination and dates
   - Number of travelers
   - Budget level and specific budget amount
   - Interests and preferences
   - Accommodation and transportation preferences
3. Click "Generate Itinerary" to create your personalized travel plan
4. Review your itinerary, which includes:
   - Day-by-day schedule
   - Cost breakdown
   - Curated highlights and recommendations
5. Save your trip to access it later

### Managing Saved Trips

1. Sign in to your account
2. Go to the "Saved Trips" page
3. View, edit, or delete your saved itineraries

### Using the AI Chat Assistant

1. With an itinerary open, click on the chat icon
2. Ask questions related to your trip such as:
   - Local customs and etiquette
   - Transportation options
   - Activity recommendations
   - Food suggestions

## Project Structure

The project follows a modular architecture with:

- `/src/components`: UI components and user interface elements
- `/src/contexts`: React context providers for state management
- `/src/hooks`: Custom React hooks
- `/src/integrations`: Third-party service integrations
- `/src/lib`: Utility functions and API clients
- `/src/pages`: Main application pages
- `/src/types`: TypeScript type definitions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- AI-powered by Google's Gemini AI
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- autocomplete by Geoapify 
