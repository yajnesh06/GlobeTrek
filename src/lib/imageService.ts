// src/lib/imageService.ts

import { HighlightItem } from '@/types'; // Assuming HighlightItem is defined in your types.ts

interface UnsplashImageResult {
  urls: {
    small: string;
    regular: string;
    // ... other sizes if needed
  };
  alt_description: string;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

// Interface for Pexels API response structure
interface PexelsImageResult {
  src: {
    original: string;
    large2x: string;
    large: string; // We'll use 'large' for consistency with Unsplash 'regular'
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string; // Alt text for the image
  photographer: string;
  photographer_url: string;
  // ... other properties if needed
}

export const imageService = {
  /**
   * Fetches an image for a single HighlightItem, trying Unsplash first, then Pexels as fallback.
   *
   * @param item The HighlightItem object to fetch an image for.
   * @param unsplashApiKey Your Unsplash API key.
   * @param pexelsApiKey Your Pexels API key.
   * @param overallDestination Optional: The main destination of the trip (e.g., "Paris", "London").
   * @returns A Promise that resolves to the HighlightItem object updated with image URL,
   * alt text, and credit, or original item with undefined image properties if no image found.
   */
  fetchSingleImage: async (
    item: HighlightItem,
    unsplashApiKey: string,
    pexelsApiKey: string,
    overallDestination?: string // <--- NEW PARAMETER HERE
  ): Promise<HighlightItem> => {
    // --- CONSTRUCT A MORE SPECIFIC QUERY ---
    const combinedQueryParts = [item.name]; // Start with the item's name

    // Add item's specific location if available to make the search more precise
    if (item.location && typeof item.location === 'string' && item.location.trim() !== '') {
      combinedQueryParts.push(item.location);
    }

    // Add the overall trip destination for even more context
    if (overallDestination && typeof overallDestination === 'string' && overallDestination.trim() !== '') {
      // Only add destination if it's not already part of the location (basic check)
      if (!item.location?.includes(overallDestination) && !item.name.includes(overallDestination)) {
        combinedQueryParts.push(overallDestination);
      }
    }

    const combinedQuery = combinedQueryParts.join(' '); // Join all parts with a space

    // Log the constructed query for debugging purposes
    console.log(`Attempting image search for query: "${combinedQuery}" (original name: "${item.name}")`);

    // --- Try Unsplash first ---
    if (unsplashApiKey) {
      try {
        const unsplashResponse = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(combinedQuery)}&per_page=1&client_id=${unsplashApiKey}`
        );

        if (unsplashResponse.ok) {
          const unsplashData = await unsplashResponse.json();
          const result: UnsplashImageResult = unsplashData.results[0];

          if (result) {
            console.log(`Unsplash HIT for: "${item.name}" with query "${combinedQuery}"`);
            return {
              ...item,
              imageUrl: result.urls.regular, // Using 'regular'
              imageAlt: result.alt_description || `Image of ${item.name}`,
              imageCredit: `Photo by ${result.user.name} on Unsplash`,
            };
          } else {
            console.warn(`Unsplash: No relevant image found for "${item.name}" with query "${combinedQuery}". Trying Pexels...`);
          }
        } else {
          console.warn(`Unsplash API failed for "${item.name}" (Status: ${unsplashResponse.status}). Trying Pexels...`);
        }
      } catch (error: unknown) {
        console.error(`Unsplash: Error fetching image for "${item.name}" with query "${combinedQuery}":`, error);
        console.warn(`Trying Pexels as fallback for "${item.name}"...`);
      }
    } else {
      console.warn("Unsplash API Key is not defined. Skipping Unsplash, trying Pexels directly.");
    }


    // --- Fallback to Pexels if Unsplash failed or no results ---
    if (pexelsApiKey) {
      try {
        const pexelsResponse = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(combinedQuery)}&per_page=1`,
          {
            headers: {
              Authorization: pexelsApiKey,
            },
          }
        );

        if (pexelsResponse.ok) {
          const pexelsData = await pexelsResponse.json();
          const result: PexelsImageResult = pexelsData.photos[0];

          if (result) {
            console.log(`Pexels HIT for: "${item.name}" with query "${combinedQuery}"`);
            return {
              ...item,
              imageUrl: result.src.large, // Using 'large' for Pexels
              imageAlt: result.alt || `Image of ${item.name}`,
              imageCredit: `Photo by ${result.photographer} on Pexels`,
            };
          } else {
            console.warn(`Pexels: No relevant image found for "${item.name}" with query "${combinedQuery}".`);
          }
        } else {
          console.warn(`Pexels API failed for "${item.name}" (Status: ${pexelsResponse.status}).`);
        }
      } catch (error: unknown) {
        console.error(`Pexels: Error fetching image for "${item.name}" with query "${combinedQuery}":`, error);
      }
    } else {
      console.warn("Pexels API Key is not defined. No image fallback available.");
    }

    // If both failed or no keys, return original item with undefined image properties
    return { ...item, imageUrl: undefined, imageAlt: undefined, imageCredit: undefined };
  },

  /**
   * Fetches images for a batch of HighlightItems, using fallback logic.
   *
   * @param items An array of HighlightItem objects.
   * @param overallDestination Optional: The main destination of the trip.
   * @returns A Promise that resolves to an array of HighlightItem objects,
   * updated with image URLs, alt text, and credits where available.
   */
  fetchImagesBatch: async (items: HighlightItem[], overallDestination?: string): Promise<HighlightItem[]> => {
    const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;
    const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

    if (!UNSPLASH_API_KEY && !PEXELS_API_KEY) {
      console.error(
        "Neither Unsplash nor Pexels API Key is defined. Image fetching will not work."
      );
      return items.map(item => ({ ...item, imageUrl: undefined, imageAlt: undefined, imageCredit: undefined }));
    }

    const imagePromises = items.map(item =>
      imageService.fetchSingleImage(item, UNSPLASH_API_KEY, PEXELS_API_KEY, overallDestination) // <--- Pass new param here
    );

    const results = await Promise.allSettled(imagePromises);
    const updatedItems: HighlightItem[] = [];

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        updatedItems.push(result.value);
      }
    });

    return updatedItems;
  },
};