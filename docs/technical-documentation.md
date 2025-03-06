
# VoyageurAI - Technical Documentation

## Architecture Overview

VoyageurAI is built as a client-side React application with external API integrations for AI functionality and data persistence. The application follows a component-based architecture with a focus on modularity and reusability.

## Technology Stack

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (based on Radix UI)
- **Form Handling**: react-hook-form with Zod validation
- **Routing**: React Router
- **State Management**: React Context API & useState
- **Notifications**: Sonner for toast notifications

### Backend Services
- **Authentication & Database**: Supabase
- **AI Generation**: Google Gemini AI API
- **Weather Data**: OpenWeatherMap API

## Project Structure

```
src/
├── components/              # UI components
│   ├── ui/                  # shadcn/ui components 
│   ├── TripForm.tsx         # Form for collecting trip preferences
│   ├── ItineraryView.tsx    # Displays the generated itinerary
│   └── ...
├── contexts/                # React context providers
│   └── AuthContext.tsx      # Authentication context
├── hooks/                   # Custom React hooks
├── integrations/            # Third-party service integrations
│   └── supabase/            # Supabase integration
├── lib/                     # Utility functions
│   ├── gemini.ts            # Google Gemini API integration
│   ├── supabase.ts          # Supabase client initialization
│   ├── weather.ts           # Weather API integration
│   └── utils.ts             # Miscellaneous utilities
├── pages/                   # Application pages
│   ├── Index.tsx            # Landing page
│   ├── PlanTrip.tsx         # Trip planning page
│   ├── SavedTrips.tsx       # Saved trips page
│   └── ...
├── types/                   # TypeScript type definitions
├── App.tsx                  # Main application component with routing
└── main.tsx                 # Application entry point
```

## Core Components

### Pages

#### Index.tsx
The landing page showcasing the application's features and providing navigation to the trip planning functionality.

#### PlanTrip.tsx
The main trip planning page containing the trip form and itinerary display. This component orchestrates the trip planning process:
1. Collects user input via the TripForm component
2. Sends the data to the Gemini API
3. Displays the generated itinerary
4. Provides options to save or share the itinerary

#### SavedTrips.tsx
Displays the user's saved trips and allows management of these trips.

### Functional Components

#### TripForm.tsx
A multi-step form for collecting user preferences for their trip. Uses react-hook-form for form state management and zod for validation.

#### ItineraryView.tsx
Displays the AI-generated itinerary in a user-friendly format with day navigation, activity timelines, and highlight sections.

#### Navbar.tsx
The application navigation bar with links to different sections and user authentication controls.

#### WeatherCard.tsx
Displays weather information for the destination.

### Context Providers

#### AuthContext.tsx
Manages authentication state and provides authentication functions throughout the application. Integrates with Supabase Auth for user management.

## Data Flows

### Trip Generation Flow

1. User fills out the trip form in `TripForm.tsx`
2. Form data is submitted to the parent `PlanTrip.tsx` component
3. `PlanTrip.tsx` calls `generateItinerary()` from `lib/gemini.ts`
4. `generateItinerary()` sends a request to the Gemini API with a carefully crafted prompt
5. The Gemini API returns a structured JSON response
6. The response is parsed and validated
7. The structured itinerary is stored in the `PlanTrip.tsx` component's state
8. The itinerary is displayed using the `ItineraryView.tsx` component

### Trip Saving Flow

1. User clicks "Save Trip" in the `PlanTrip.tsx` component
2. `handleSaveTrip()` function is called
3. The function checks if the user is authenticated
4. If authenticated, the itinerary is serialized to JSON
5. The serialized itinerary is inserted into the `saved_trips` table in Supabase
6. User is redirected to the `SavedTrips.tsx` page

### Authentication Flow

1. User initiates sign in via the Navbar
2. `signInWithGoogle()` from AuthContext is called
3. Supabase Auth redirects the user to Google's OAuth flow
4. User authenticates with Google
5. Google redirects back to the application with authentication tokens
6. Supabase Auth processes the tokens and creates a session
7. AuthContext updates with the new session information
8. UI updates to reflect the authenticated state

## API Integrations

### Google Gemini AI

Located in `src/lib/gemini.ts`, this integration:
- Formats user input into a detailed prompt
- Sends the prompt to the Gemini API
- Processes and validates the response
- Returns a structured itinerary object

Key aspects:
- Structured prompt engineering to ensure quality responses
- Parameter optimization for response quality and speed
- Comprehensive error handling
- Response validation and fallback mechanisms

### Supabase

Located in `src/lib/supabase.ts` and used throughout the application, this integration provides:
- User authentication via OAuth
- Data storage for user profiles and saved trips
- Row-level security for data access control

### OpenWeatherMap

Located in `src/lib/weather.ts`, this integration:
- Fetches current weather data for destinations
- Formats the weather data for display
- Provides error handling for API failures

## Data Models

### TripFormData
```typescript
interface TripFormData {
  destination: string;
  startingAddress: string;
  startDate: Date | string;
  endDate: Date | string;
  budget: string;
  travelers: number;
  interests: string[];
  dietaryRestrictions: string[];
  accommodationType: string;
  transportationType: string[];
  additionalNotes: string;
}
```

### GeneratedItinerary
```typescript
interface GeneratedItinerary {
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  summary: string;
  budget: string;
  travelers: number;
  interests: string[];
  transportationType: string[];
  accommodationType: string;
  days: ItineraryDay[];
  highlights: TravelHighlights;
}
```

### Database Schema

#### profiles
- `id`: UUID (primary key, references auth.users)
- `email`: String
- `full_name`: String
- `avatar_url`: String

#### saved_trips
- `id`: UUID (primary key)
- `user_id`: UUID (references profiles.id)
- `trip_data`: JSONB
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Security Considerations

### Authentication
- OAuth integration with Google provides secure authentication
- Session tokens are securely stored and managed
- Authentication state is properly managed in the AuthContext

### Data Protection
- Row-level security in Supabase ensures users can only access their own data
- API keys are properly secured and not exposed in client-side code

### Error Handling
- Comprehensive error handling prevents exposing sensitive information
- User-friendly error messages provide appropriate feedback

## Performance Optimizations

- Optimized parameters for Gemini API to balance response quality and speed
- Appropriate loading states to improve perceived performance
- Optional caching for weather data to reduce API calls

## Testing Strategy

- Component testing with React Testing Library
- Integration testing for key workflows
- API mocking for reliable testing of external dependencies

## Deployment Considerations

- Environment variable management for API keys
- Build optimization for production deployment
- Continuous integration and deployment pipeline

## Extension Points

VoyageurAI is designed to be extensible in several ways:

1. **Additional AI Models**: The architecture allows for integration with other AI models or providers.
2. **New Data Sources**: Additional API integrations can be added to enrich the itinerary data.
3. **Enhanced Trip Management**: The saved trips functionality can be extended with categories, sharing, and collaboration features.
4. **Offline Support**: Service workers could be implemented for offline access to saved trips.
5. **Mobile Applications**: The architecture could be extended to support native mobile apps sharing the same backend services.

## Appendix

### Key Dependencies
- react
- react-router-dom
- @supabase/supabase-js
- tailwindcss
- react-hook-form
- zod
- sonner
- lucide-react
- date-fns
- shadcn/ui components
