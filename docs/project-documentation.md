
# Voyage AI Travel Planner - Project Documentation

## Project Overview

Voyage is an AI-powered travel planning application that helps users create personalized trip itineraries. The application leverages Google's Gemini AI to generate detailed travel plans based on user preferences, including destination, dates, budget, interests, and more.

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (based on Radix UI)
- **Form Handling**: react-hook-form with Zod validation
- **Routing**: React Router
- **State Management**: React Context API & useState
- **API Integration**: Google Gemini AI for generating itineraries and chat responses
- **Notifications**: Sonner for toast notifications

## Key Features

1. **Personalized Trip Planning**: Generates custom itineraries based on user preferences
2. **Day-by-Day Itinerary**: Provides a detailed schedule for each day of the trip
3. **Travel Highlights**: Showcases must-visit attractions, hidden gems, recommended restaurants, and local foods
4. **Interactive AI Chat Assistant**: Offers a conversational interface for trip-related questions
5. **Responsive Design**: Works seamlessly across desktop and mobile devices

## File Structure

```
src/
├── components/              # UI components
│   ├── ui/                  # shadcn/ui components 
│   ├── TripForm.tsx         # Form for collecting trip preferences
│   ├── ItineraryView.tsx    # Displays the generated itinerary
│   ├── TripChat.tsx         # AI chat interface for trip questions
│   └── ...
├── lib/                     # Utility functions and API integrations
│   ├── gemini.ts            # Google Gemini API integration
│   └── utils.ts             # General utility functions
├── pages/                   # Application pages
│   ├── Index.tsx            # Landing page
│   ├── PlanTrip.tsx         # Trip planning page
│   └── NotFound.tsx         # 404 page
├── types/                   # TypeScript type definitions
│   └── index.ts             # Shared types for the application
└── App.tsx                  # Main application component with routing
```

## Core Workflows

### Trip Planning Process

1. User fills out the trip form with preferences (destination, dates, interests, etc.)
2. Application sends this data to the Gemini API
3. Gemini generates a structured itinerary JSON response
4. Application displays the itinerary with daily activities and highlights

### AI Chat Functionality

1. User asks a question about their trip
2. Application sends the question along with itinerary context to Gemini
3. Gemini generates a contextually relevant response
4. Response is displayed in a conversational interface

## API Integration

The application uses Google's Gemini API for two main functions:
- Generating detailed trip itineraries based on user input
- Providing contextual responses to user questions in the chat interface

Each API call is constructed with a carefully crafted prompt that includes all relevant context information to generate high-quality, personalized content.

## Deployment and Performance Considerations

- The application is designed to be responsive and work well on both desktop and mobile devices
- API calls to Gemini are optimized with appropriate parameters to balance response quality and speed
- Loading states are implemented to provide visual feedback during API calls

## Future Enhancements

Potential areas for improvement:
- Saving itineraries for later reference
- Sharing itineraries with other users
- Adding weather data integration for trip planning
- Implementing offline functionality for viewing saved itineraries
