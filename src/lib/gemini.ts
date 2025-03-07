
import { TripFormData, GeneratedItinerary } from '../types';
import { toast } from 'sonner';

// Get API key from environment or use fallback for development
const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY || "AIzaSyDzme5XdqHO-htFRLSJvs1F2LvgmPG2NEQ";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function generateItinerary(tripData: TripFormData): Promise<GeneratedItinerary | null> {
  try {
    // Check if API key is available in production
    if (!API_KEY) {
      console.error("Missing Gemini API key in environment variables");
      toast.error("API configuration error. Please contact support.");
      return null;
    }

    const startDate = tripData.startDate instanceof Date 
      ? tripData.startDate.toISOString().split('T')[0]
      : typeof tripData.startDate === 'string' ? tripData.startDate : '';
    
    const endDate = tripData.endDate instanceof Date 
      ? tripData.endDate.toISOString().split('T')[0]
      : typeof tripData.endDate === 'string' ? tripData.endDate : '';

    // Calculate duration in days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const prompt = `
      Create a detailed travel itinerary for a trip to ${tripData.destination} from ${tripData.startingAddress}.
      
      Trip details:
      - Starting Address: ${tripData.startingAddress}
      - Destination: ${tripData.destination}
      - Travel dates: From ${startDate} to ${endDate} (${durationDays} days)
      - Total budget: ${tripData.currency}${tripData.budgetAmount.toLocaleString()} (${tripData.budget} level)
      - Number of travelers: ${tripData.travelers}
      - Per person budget: ${tripData.currency}${Math.round(tripData.budgetAmount / tripData.travelers).toLocaleString()}
      - Interests: ${tripData.interests.join(', ')}
      - Dietary restrictions: ${tripData.dietaryRestrictions.join(', ') || 'None'}
      - Accommodation preference: ${tripData.accommodationType}
      - Transportation preference: ${tripData.transportationType.join(', ')}
      - Additional notes: ${tripData.additionalNotes || 'None'}
      
      IMPORTANT: Create an itinerary that fits within the specified budget of ${tripData.currency}${tripData.budgetAmount.toLocaleString()} for the entire trip. The itinerary should reflect the budget level (${tripData.budget}) in terms of accommodation quality, restaurant choices, and activities.
      
      Include:
      1. A day-by-day itinerary with specific times for activities, meals, and transport
      2. A list of at least 12-15 must-visit attractions with detailed descriptions, choosing ones that fit within the budget
      3. A selection of at least 10-12 hidden gems/local spots that tourists often miss and are budget-friendly
      4. Recommended restaurants with description of cuisine (at least 8), ensuring they match the budget level
      5. Local foods to try with descriptions (at least 6)
      
      Format the response as valid JSON with the following structure:
      {
        "destination": "Destination name",
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD",
        "duration": number of days,
        "budget": "budget level from input",
        "budgetAmount": numeric budget amount from input,
        "travelers": number of travelers from input,
        "interests": ["interest1", "interest2", ...],
        "transportationType": ["type1", "type2", ...],
        "summary": "Brief trip summary with number of travelers mentioned and how the budget is being utilized",
        "days": [
          {
            "day": day number,
            "date": "YYYY-MM-DD",
            "activities": [
              {
                "time": "HH:MM",
                "description": "Activity description",
                "type": "attraction/restaurant/transportation/accommodation/other",
                "location": "Location name",
                "notes": "Additional notes including price if applicable"
              }
            ]
          }
        ],
        "highlights": {
          "mustVisitPlaces": [
            {
              "name": "Place name",
              "description": "Description",
              "location": "Location",
              "tags": ["tag1", "tag2", "budget-friendly"]
            }
          ],
          "hiddenGems": [
            {
              "name": "Place name",
              "description": "Description",
              "location": "Location",
              "tags": ["tag1", "tag2", "budget-friendly"]
            }
          ],
          "restaurants": [
            {
              "name": "Restaurant name",
              "description": "Description with price range",
              "location": "Location",
              "tags": ["tag1", "tag2", "budget-friendly"]
            }
          ],
          "localFood": [
            {
              "name": "Food name",
              "description": "Description with typical price",
              "tags": ["tag1", "tag2"]
            }
          ]
        }
      }

      IMPORTANT REQUIREMENTS:
      1. You MUST include at least 12 mustVisitPlaces
      2. You MUST include at least 10 hiddenGems
      3. You MUST include at least 8 restaurants
      4. You MUST include at least 6 localFood items
      5. Ensure the response is valid JSON that can be parsed directly
      6. Make sure each highlight has at least 2-3 relevant tags
      7. All recommendations MUST be within the specified budget of ${tripData.currency}${tripData.budgetAmount.toLocaleString()}
      8. Include price estimates or ranges where appropriate in the descriptions
      9. Keep descriptions concise but informative (2-4 sentences)
      10. Include the number of travelers in the summary
      11. MOST IMPORTANT: Include the budget, budgetAmount, transportationType, and interests arrays in the returned JSON
    `;

    // Show toast to indicate processing
    toast.info("Generating your personalized itinerary...");

    console.log("Making API request to Gemini with key:", API_KEY.substring(0, 4) + "...");

    // Optimized API request with improved parameters for faster response
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7, // Slightly higher for more creative responses
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from Gemini API:', errorData);
      throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log("Received response from Gemini API");
    
    try {
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Find the beginning and end of the JSON object in the response
      const jsonStartIndex = generatedText.indexOf('{');
      const jsonEndIndex = generatedText.lastIndexOf('}') + 1;
      
      if (jsonStartIndex === -1 || jsonEndIndex === 0) {
        throw new Error('No JSON object found in the response.');
      }
      
      const jsonText = generatedText.substring(jsonStartIndex, jsonEndIndex);
      let itinerary = JSON.parse(jsonText) as GeneratedItinerary;
      
      // Ensure the required fields are present
      if (!itinerary.budget) itinerary.budget = tripData.budget;
      if (!itinerary.budgetAmount) itinerary.budgetAmount = tripData.budgetAmount;
      if (!itinerary.travelers) itinerary.travelers = tripData.travelers;
      if (!itinerary.interests) itinerary.interests = tripData.interests;
      if (!itinerary.transportationType) itinerary.transportationType = tripData.transportationType;
      
      // Log success message
      console.log(`Successfully generated itinerary with: 
        - ${itinerary.highlights.mustVisitPlaces.length} attractions
        - ${itinerary.highlights.hiddenGems.length} hidden gems
        - ${itinerary.highlights.restaurants.length} restaurants
        - ${itinerary.highlights.localFood.length} local foods
        - Budget: ${tripData.currency}${itinerary.budgetAmount.toLocaleString()}`);
      
      return itinerary;
    } catch (parseError) {
      console.error('Error parsing the generated content:', parseError);
      console.log('Raw response:', data);
      throw new Error('Failed to parse the AI response. Please try again.');
    }
  } catch (error) {
    console.error('Error generating itinerary:', error);
    toast.error('Failed to generate itinerary. Please try again. ' + (error instanceof Error ? error.message : ''));
    return null;
  }
}
