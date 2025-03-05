
import { TripFormData, GeneratedItinerary } from '../types';
import { toast } from 'sonner';

// Using the correct API endpoint for Gemini
const API_KEY = "AIzaSyDzme5XdqHO-htFRLSJvs1F2LvgmPG2NEQ";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function generateItinerary(tripData: TripFormData): Promise<GeneratedItinerary | null> {
  try {
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
      - Budget level: ${tripData.budget}
      - Number of travelers: ${tripData.travelers}
      - Interests: ${tripData.interests.join(', ')}
      - Dietary restrictions: ${tripData.dietaryRestrictions.join(', ') || 'None'}
      - Accommodation preference: ${tripData.accommodationType}
      - Transportation preference: ${tripData.transportationType.join(', ')}
      - Additional notes: ${tripData.additionalNotes || 'None'}
      
      Include:
      1. A day-by-day itinerary with specific times for activities, meals, and transport
      2. A list of at least 12-15 must-visit attractions with detailed descriptions
      3. A selection of at least 10-12 hidden gems/local spots that tourists often miss
      4. Recommended restaurants with description of cuisine (at least 8)
      5. Local foods to try with descriptions (at least 6)
      
      Format the response as valid JSON with the following structure:
      {
        "destination": "Destination name",
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD",
        "duration": number of days,
        "summary": "Brief trip summary with number of travelers mentioned",
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
                "notes": "Additional notes"
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
              "tags": ["tag1", "tag2"]
            }
          ],
          "hiddenGems": [
            {
              "name": "Place name",
              "description": "Description",
              "location": "Location",
              "tags": ["tag1", "tag2"]
            }
          ],
          "restaurants": [
            {
              "name": "Restaurant name",
              "description": "Description",
              "location": "Location",
              "tags": ["tag1", "tag2"]
            }
          ],
          "localFood": [
            {
              "name": "Food name",
              "description": "Description",
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
      7. Keep descriptions concise but informative (2-4 sentences)
      8. Include the number of travelers in the summary
    `;

    // Show toast to indicate processing
    toast.info("Generating your personalized itinerary...");

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
    
    try {
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Find the beginning and end of the JSON object in the response
      const jsonStartIndex = generatedText.indexOf('{');
      const jsonEndIndex = generatedText.lastIndexOf('}') + 1;
      
      if (jsonStartIndex === -1 || jsonEndIndex === 0) {
        throw new Error('No JSON object found in the response.');
      }
      
      const jsonText = generatedText.substring(jsonStartIndex, jsonEndIndex);
      const itinerary = JSON.parse(jsonText) as GeneratedItinerary;
      
      // Log success message
      console.log(`Successfully generated itinerary with: 
        - ${itinerary.highlights.mustVisitPlaces.length} attractions
        - ${itinerary.highlights.hiddenGems.length} hidden gems
        - ${itinerary.highlights.restaurants.length} restaurants
        - ${itinerary.highlights.localFood.length} local foods`);
      
      return itinerary;
    } catch (parseError) {
      console.error('Error parsing the generated content:', parseError);
      console.log('Raw response:', data);
      throw new Error('Failed to parse the AI response. Please try again.');
    }
  } catch (error) {
    console.error('Error generating itinerary:', error);
    toast.error('Failed to generate itinerary. Please try again.');
    return null;
  }
}
