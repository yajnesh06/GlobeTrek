// src/lib/gemini.ts

import { TripFormData, GeneratedItinerary } from '../types';
import { toast } from 'sonner';

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function generateItinerary(tripData: TripFormData): Promise<GeneratedItinerary | null> {
  let jsonText: string = ''; // Declare jsonText here, initialized to an empty string

  try {
    // Check if API key is available
    if (!API_KEY) {
      console.error("Missing Gemini API key in environment variables");
      toast.error("Failed to generate itinerary: API key missing. Check the deployment guide for instructions.");
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
      You are an expert travel planner. Create a detailed and engaging travel itinerary based on the user's preferences.

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

      IMPORTANT: Create an itinerary that strictly fits within the specified budget of ${tripData.currency}${tripData.budgetAmount.toLocaleString()} for the entire trip. The itinerary should reflect the budget level (${tripData.budget}) in terms to accommodation quality, restaurant choices, and activities.

      Include the following sections:
      1. A day-by-day itinerary with specific times for activities, meals, and transport.
      2. A list of at least 12-15 must-visit attractions with detailed descriptions, choosing ones that fit within the budget.
      3. A selection of at least 10-12 hidden gems/local spots that tourists often miss and are budget-friendly.
      4. Recommended restaurants with description of cuisine (at least 8), ensuring they match the budget level.
      5. Local foods to try with descriptions (at least 6).

      Format the entire response STRICTLY as a single, valid JSON object. Do NOT include any conversational text or explanation outside of the JSON. Ensure all string values are properly escaped.

      JSON Structure:
      \`\`\`json
      {
        "destination": "Destination name",
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD",
        "duration": ${durationDays},
        "budget": "${tripData.budget}",
        "budgetAmount": ${tripData.budgetAmount},
        "travelers": ${tripData.travelers},
        "interests": ${JSON.stringify(tripData.interests)},
        "transportationType": ${JSON.stringify(tripData.transportationType)},
        "summary": "Brief trip summary with number of travelers mentioned and how the budget is being utilized",
        "days": [
          {
            "day": 1,
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
          // ... more days
        ],
        "highlights": {
          "mustVisitPlaces": [
            {
              "name": "Specific Place Name (e.g., Eiffel Tower, not just 'Tower')",
              "description": "Description",
              "location": "Specific Location (e.g., Champ de Mars, Paris; or a street address if famous, not just 'Paris')",
              "tags": ["tag1", "tag2", "budget-friendly"]
            }
            // ... more must-visit places
          ],
          "hiddenGems": [
            {
              "name": "Specific Place Name (e.g., Canal Saint-Martin, not just 'Canal')",
              "description": "Description",
              "location": "Specific Location (e.g., 10th Arrondissement, Paris; or a street address if famous, not just 'Paris')",
              "tags": ["tag1", "tag2", "budget-friendly"]
            }
            // ... more hidden gems
          ],
          "restaurants": [
            {
              "name": "Specific Restaurant Name (e.g., Le Relais de l'Entrecôte)",
              "description": "Description with price range",
              "location": "Specific Location (e.g., Rue Saint-Honoré, Paris; or street address if famous, not just 'Paris')",
              "tags": ["tag1", "tag2", "budget-friendly"]
            }
            // ... more restaurants
          ],
          "localFood": [
            {
              "name": "Specific Food Name (e.g., Croissant)",
              "description": "Description with typical price",
              "tags": ["tag1", "tag2"]
            }
            // ... more local foods
          ]
        }
      }
      \`\`\`

      IMPORTANT REQUIREMENTS:
      1. You MUST include at least 8 mustVisitPlaces items in the array.
      2. You MUST include at least 6 hiddenGems items in the array.
      3. You MUST include at least 6 restaurants items in the array.
      4. You MUST include at least 6 localFood items in the array.
      5. Ensure the entire response is a single, VALID JSON object that can be parsed directly.
      6. Make sure each highlight (mustVisitPlaces, hiddenGems, restaurants, localFood) has at least 2-3 relevant tags.
      7. All recommendations MUST be within the specified budget of ${tripData.currency}${tripData.budgetAmount.toLocaleString()}.
      8. Include price estimates or ranges where appropriate in the descriptions.
      9. Keep descriptions concise but informative (2-4 sentences).
      10. Include the number of travelers in the summary.
      11. The JSON should include the 'budget', 'budgetAmount', 'travelers', 'interests', and 'transportationType' fields directly from the input. I have provided the exact structure for these in the JSON example above.
      12. For all 'name' fields within 'mustVisitPlaces', 'hiddenGems', and 'restaurants', provide the most specific and unique name possible, avoiding generic terms.
      13. For all 'location' fields within 'mustVisitPlaces', 'hiddenGems', and 'restaurants', provide a specific address, neighborhood, or district, in addition to the city and country if applicable. Do NOT just provide the city name if a more granular location is known.
    `;

    // Show toast to indicate processing
    toast.info("Generating your personalized itinerary...");

    console.log("Making API request to Gemini API...");

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
          temperature: 0.7,
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
    console.log("Raw API response data:", JSON.stringify(data, null, 2)); // Log full raw data for debugging

    try {
      const generatedText = data.candidates[0].content.parts[0].text;
      console.log("Extracted generated text:", generatedText); // Log the text content

      // --- IMPROVED JSON EXTRACTION ---
      // Use regex to find the JSON block, accounting for potential leading/trailing ```json markers
      const jsonMatch = generatedText.match(/```json\s*(\{[\s\S]*?\})\s*```/);

      if (jsonMatch && jsonMatch[1]) {
        jsonText = jsonMatch[1];
        console.log("JSON extracted using ```json``` markers.");
      } else {
        // Fallback to original substring method if markers not found (less robust)
        const jsonStartIndex = generatedText.indexOf('{');
        const jsonEndIndex = generatedText.lastIndexOf('}') + 1;

        if (jsonStartIndex === -1 || jsonEndIndex === 0) {
          throw new Error('No valid JSON object found in the response.');
        }
        jsonText = generatedText.substring(jsonStartIndex, jsonEndIndex);
        console.log("JSON extracted using substring method.");
      }

      const itinerary = JSON.parse(jsonText) as GeneratedItinerary;

      // Ensure the required fields are present (these are now explicitly included in the prompt structure)
      // This is still a good fallback, but the model should now populate them.
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

      toast.success("Itinerary generated successfully!");

      return {
        ...itinerary,
        currency: tripData.currency, // Explicitly include the currency from the form data
      };
    } catch (parseError) {
      console.error('Error parsing the generated content:', parseError);
      // jsonText is now guaranteed to be defined due to its declaration at the top of the try block
      console.log('JSON text attempted to parse:', jsonText);
      throw new Error('Failed to parse the AI response. Please try again. Details: ' + (parseError instanceof Error ? parseError.message : String(parseError)));
    }
  } catch (error) {
    console.error('Error generating itinerary:', error);
    toast.error('Failed to generate itinerary. Please check your environment variables and try again. ' + (error instanceof Error ? error.message : ''));
    return null;
  }
}