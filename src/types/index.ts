
export interface TripFormData {
  destination: string;
  startingAddress: string;
  startDate: Date | string;
  endDate: Date | string;
  budget: string;
  budgetAmount: number;
  travelers: number;
  interests: string[];
  dietaryRestrictions: string[];
  accommodationType: string;
  transportationType: string[];
  additionalNotes: string;
  currency: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: ItineraryActivity[];
}

export interface ItineraryActivity {
  time: string;
  description: string;
  type: "attraction" | "restaurant" | "transportation" | "accommodation" | "other";
  location?: string;
  notes?: string;
}

export interface TravelHighlights {
  mustVisitPlaces: HighlightItem[];
  hiddenGems: HighlightItem[];
  restaurants: HighlightItem[];
  localFood: HighlightItem[];
}

export interface HighlightItem {
  name: string;
  description: string;
  location?: string;
  tags?: string[];
}

export interface GeneratedItinerary {
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  summary: string;
  budget: string;
  budgetAmount: number;
  travelers: number;
  interests: string[];
  transportationType: string[];
  accommodationType: string;
  days: ItineraryDay[];
  highlights: TravelHighlights;
  currency?: string;
}
