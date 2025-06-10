import { HighlightItem } from '@/types';

// --- Constants ---
const WIKIPEDIA_API_BASE = 'https://en.wikipedia.org/w/api.php';
const UNSPLASH_API_BASE = 'https://api.unsplash.com/search/photos';
const PEXELS_API_BASE = 'https://api.pexels.com/v1/search';

// --- Interface Definitions (kept for completeness) ---
interface UnsplashImageResult {
  urls: {
    small: string;
    regular: string;
  };
  alt_description: string;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

interface PexelsImageResult {
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
  photographer: string;
  photographer_url: string;
}

// Global Set to track URLs used within the current batch to prevent immediate duplicates
// This is cleared at the start of each batch processing.
const usedImageUrls = new Set<string>();

/**
 * Common words and generic descriptors to filter out from keywords.
 * These words don't add specific value to image search queries or alt text relevance.
 */
const COMMON_KEYWORDS = new Set([
  'the', 'a', 'an', 'of', 'and', 'in', 'at', 'on', 'for', 'with', 'to', 'from',
  'de', 'la', 'le', 'du', 'by', 'is', 'are', 'was', 'were', 'be', 'being', 'been',
  // Generic terms that might lead to irrelevant images if not filtered
  'photo', 'image', 'picture', 'wallpaper', 'background', 'abstract', 'texture', 'art', 'stock',
  'view', 'scene', 'landscape', 'cityscape', 'urban', 'travel', 'trip', 'journey', 'tour', 'explore',
  'experience', 'famous', 'popular', 'best', 'top', 'local', 'traditional', 'authentic',
  'scenic', 'beautiful', 'picturesque', 'iconic', 'must-see', 'hidden', 'gem', 'recommended',
  'visit', 'try', 'eat', 'see', 'do', 'go', 'about', 'around', 'near', 'inside', 'outside',
  'main', 'old', 'new', 'grand', 'royal', 'national', 'state', 'public', 'private',
  'well-known', 'popular', 'great', 'good', 'unique', 'charming', 'vibrant', 'bustling',
  'peaceful', 'serene', 'tranquil', 'exotic', 'modern', 'ancient', 'colonial', 'gothic',
  'baroque', 'renaissance', 'modernist', 'art deco', 'art nouveau', 'futuristic',
  'traditional', 'contemporary', 'urban', 'rural', 'natural', 'man-made', 'waterfront',
  'downtown', 'uptown', 'suburban', 'residential', 'commercial', 'industrial',
  'central', 'eastern', 'western', 'northern', 'southern', 'north', 'south', 'east', 'west',
  'single', 'double', 'multiple', 'various', 'diverse', 'different', 'many', 'few',
  'some', 'any', 'all', 'every', 'each', 'no', 'not', 'none', 'nothing', 'something',
  'anything', 'everything', 'someone', 'anyone', 'everyone', 'nobody', 'no one',
  'somebody', 'anybody', 'everybody', 'where', 'when', 'what', 'who', 'why', 'how',
  'which', 'whose', 'whom', 'here', 'there', 'then', 'now', 'always', 'never', 'often',
  'sometimes', 'usually', 'rarely', 'seldom', 'ever', 'once', 'twice', 'thrice',
  'always', 'often', 'sometimes', 'rarely', 'never', 'usually', 'occasionally',
  'frequently', 'constantly', 'continually', 'daily', 'weekly', 'monthly', 'yearly',
  'annually', 'biennially', 'triennially', 'decadally', 'centennially', 'millennially',
  'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth',
  'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth',
  'seventeenth', 'eighteenth', 'nineteenth', 'twentieth', 'thirtieth', 'fortieth',
  'fiftieth', 'sixtieth', 'seventieth', 'eightieth', 'ninetieth', 'hundredth', 'thousandth',
  'millionth', 'billionth', 'trillionth', 'zillionth', 'last', 'next', 'previous', 'former',
  'latter', 'oldest', 'newest', 'latest', 'earliest', 'final', 'initial', 'ultimate',
  'penultimate', 'entire', 'whole', 'complete', 'partial', 'full', 'empty', 'open', 'closed',
  'left', 'right', 'up', 'down', 'inside', 'outside', 'above', 'below', 'under', 'over',
  'onto', 'into', 'out of', 'off of', 'away from', 'towards', 'from', 'with', 'without',
  'through', 'across', 'along', 'around', 'before', 'after', 'during', 'since', 'until',
  'while', 'within', 'beyond', 'except', 'despite', 'between', 'among', 'behind', 'in front of',
  'next to', 'beside', 'opposite', 'underneath', 'beneath', 'atop', 'upon', 'via', 'per',
  'plus', 'minus', 'times', 'divided by', 'equals', 'is', 'are', 'was', 'were', 'be', 'being',
  'been', 'have', 'has', 'had', 'do', 'does', 'did', 'doing', 'will', 'would', 'shall',
  'should', 'can', 'could', 'may', 'might', 'must', 'ought', 'need', 'dare',
  'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their',
  'mine', 'yours', 'hers', 'ours', 'theirs', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'me', 'him', 'us', 'them', 'myself', 'yourself', 'himself', 'herself', 'itself',
  'ourselves', 'yourselves', 'themselves', 'and', 'but', 'or', 'nor', 'for', 'yet', 'so',
  'because', 'although', 'though', 'while', 'whereas', 'unless', 'until', 'when',
  'where', 'why', 'how', 'than', 'as', 'if', 'then', 'than', 'that', 'which', 'who',
  'whom', 'whose', 'whether', 'what', 'whatever', 'whoever', 'whomever', 'whichever',
  'whenever', 'wherever', 'however', 'moreover', 'furthermore', 'therefore', 'thus',
  'hence', 'consequently', 'accordingly', 'nevertheless', 'nonetheless', 'otherwise',
  'instead', 'rather', 'besides', 'except', 'only', 'just', 'even', 'almost', 'nearly',
  'quite', 'rather', 'pretty', 'very', 'too', 'enough', 'so', 'such', 'what', 'how',
  'really', 'actually', 'truly', 'certainly', 'definitely', 'probably', 'possibly',
  'perhaps', 'maybe', 'surely', 'undoubtedly', 'fortunately', 'unfortunately',
  'happily', 'sadly', 'angrily', 'quickly', 'slowly', 'carefully', 'loudly', 'softly',
  'brightly', 'darkly', 'warmly', 'coldly', 'easily', 'difficultly', 'simply', 'complexly',
  'badly', 'well', 'better', 'best', 'worse', 'worst', 'more', 'most', 'less', 'least',
  'many', 'much', 'little', 'few', 'small', 'large', 'big', 'great', 'tiny', 'huge',
  'tall', 'short', 'long', 'quick', 'slow', 'fast', 'early', 'late', 'new', 'old',
  'young', 'old', 'good', 'bad', 'evil', 'ugly', 'beautiful', 'pretty', 'handsome',
  'nice', 'kind', 'mean', 'cruel', 'happy', 'sad', 'angry', 'glad', 'sorry', 'proud',
  'ashamed', 'afraid', 'brave', 'nervous', 'calm', 'excited', 'bored', 'tired', 'sleepy',
  'hungry', 'thirsty', 'full', 'empty', 'hot', 'cold', 'warm', 'cool', 'wet', 'dry',
  'clean', 'dirty', 'rich', 'poor', 'expensive', 'cheap', 'easy', 'difficult', 'simple',
  'complex', 'hard', 'soft', 'light', 'dark', 'bright', 'dull', 'loud', 'quiet', 'noisy',
  'silent', 'strong', 'weak', 'healthy', 'sick', 'fat', 'thin', 'heavy', 'light',
  'true', 'false', 'right', 'wrong', 'correct', 'incorrect', 'able', 'unable', 'possible',
  'impossible', 'probable', 'improbable', 'certain', 'uncertain', 'sure', 'unsure',
  'known', 'unknown', 'visible', 'invisible', 'present', 'absent', 'alive', 'dead',
  'open', 'closed', 'full', 'empty', 'free', 'busy', 'ready', 'unready', 'near', 'far',
  'inside', 'outside', 'up', 'down', 'on', 'off', 'in', 'out', 'over', 'under', 'through',
  'about', 'across', 'after', 'against', 'along', 'among', 'around', 'at', 'before',
  'behind', 'below', 'beneath', 'beside', 'between', 'beyond', 'but', 'by', 'concerning',
  'despite', 'down', 'during', 'except', 'for', 'from', 'in', 'into', 'like', 'near',
  'of', 'off', 'on', 'onto', 'out', 'outside', 'over', 'past', 'per', 'regarding',
  'since', 'through', 'to', 'toward', 'under', 'underneath', 'until', 'up', 'upon',
  'with', 'within', 'without', 'about', 'above', 'across', 'after', 'against', 'along',
  'among', 'around', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'between',
  'beyond', 'but', 'by', 'concerning', 'despite', 'down', 'during', 'except', 'for',
  'from', 'in', 'into', 'like', 'near', 'of', 'off', 'on', 'onto', 'out', 'outside',
  'over', 'past', 'per', 'regarding', 'since', 'through', 'to', 'toward', 'under',
  'underneath', 'until', 'up', 'upon', 'with', 'within', 'without',
]);

/**
 * Extracts and cleans keywords from text, removing common words and ensuring uniqueness.
 * Converts to lowercase.
 * @param text The input string.
 * @returns An array of cleaned, unique keywords.
 */
function extractKeywords(text: string): string[] {
  return text.toLowerCase()
    .split(/\s+/) // Split by whitespace
    .map(word => word.replace(/[^a-z0-9]/g, '')) // Remove non-alphanumeric
    .filter(word => word.length > 2 && !COMMON_KEYWORDS.has(word)); // Filter short and common words
}

/**
 * Calculates a relevance score for an image based on its alt text and search terms.
 * Higher score indicates better relevance.
 */
const calculateRelevanceScore = (
  altText: string,
  itemName: string,
  itemLocation?: string,
  overallDestination?: string,
  itemDescription?: string,
  itemTags?: string[]
): number => {
  const lowerAltText = altText.toLowerCase();
  const lowerItemName = itemName.toLowerCase();
  const lowerItemLocation = itemLocation?.toLowerCase() || '';
  const lowerOverallDestination = overallDestination?.toLowerCase() || '';
  const lowerItemDescription = itemDescription?.toLowerCase() || '';
  const lowerItemTags = itemTags?.map(tag => tag.toLowerCase()) || [];

  let score = 0;

  // 1. Exact match / Strong substring match for item name (Highest priority)
  if (lowerAltText === lowerItemName) {
    score += 1000; // Perfect match
  } else if (lowerAltText.includes(lowerItemName)) {
    score += 500; // Strong substring match
  }

  // 2. Exact match of item name as a whole word (e.g., "Eiffel Tower" not just "tower")
  const regexItemName = new RegExp(`\\b${lowerItemName}\\b`, 'i');
  if (regexItemName.test(lowerAltText)) {
      score += 200;
  }

  // 3. Match against significant parts of the item name (if multi-word)
  const itemNameParts = lowerItemName.split(' ').filter(p => p.length > 2 && !COMMON_KEYWORDS.has(p));
  itemNameParts.forEach(part => {
    if (lowerAltText.includes(part)) {
      score += 50;
    }
  });


  // 4. Location relevance
  if (itemLocation && lowerAltText.includes(lowerItemLocation)) {
    score += 150;
  }
  if (overallDestination && lowerAltText.includes(lowerOverallDestination)) {
    score += 75;
  }
  // Boost for specific location terms if location is multi-word
  const locationParts = lowerItemLocation.split(' ').filter(p => p.length > 2 && !COMMON_KEYWORDS.has(p));
  locationParts.forEach(part => {
      if (lowerAltText.includes(part)) {
          score += 25;
      }
  });


  // 5. Description keywords
  const descriptionKeywords = extractKeywords(lowerItemDescription);
  descriptionKeywords.forEach(keyword => {
    if (lowerAltText.includes(keyword)) {
      score += 10;
    }
  });

  // 6. Tags
  lowerItemTags.forEach(tag => {
    if (lowerAltText.includes(tag)) {
      score += 5;
    }
  });

  // 7. Penalties for generic or clearly irrelevant alt texts
  const genericPenalties = ['photo', 'image', 'picture', 'wallpaper', 'background', 'abstract', 'texture', 'art', 'stock',
    'generic', 'illustration', 'design', 'graphic', 'render']; // Added more generic terms
  if (genericPenalties.some(term => lowerAltText === term || lowerAltText.includes(`a ${term}`) || lowerAltText.includes(`the ${term}`))) {
    score -= 300; // Strong penalty
  }
  // Penalize if alt text is very short AND doesn't contain the item name strongly
  if (altText.length < 15 && !lowerAltText.includes(lowerItemName) && score < 500) {
    score -= 100;
  }

  // Penalize if the alt text contains irrelevant general "city/country" terms without specifics
  // if (overallDestination && lowerAltText.includes(lowerOverallDestination) && !lowerAltText.includes(lowerItemName)) {
  //   score -= 50; // if it's just "Paris" and not "Eiffel Tower Paris"
  // }

  // Ensure score doesn't drop below zero
  return Math.max(0, score);
};


/**
 * Fetches an image from Wikipedia/Wikimedia Commons for a given query.
 * Prioritizes the main image associated with the most relevant search result.
 *
 * @param query The search query (e.g., "Eiffel Tower Paris").
 * @returns A Promise that resolves to image data (url, alt, credit) or undefined.
 */
async function fetchImageFromWikipedia(query: string): Promise<{ url: string; alt: string; credit: string } | undefined> {
  try {
    // Step 1: Search for a relevant Wikipedia page
    // Using srlimit=5 to get more results for better relevance check
    const searchUrl = `${WIKIPEDIA_API_BASE}?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=5`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    const searchResults = searchData.query?.search;
    if (!searchResults || searchResults.length === 0) {
      console.log(`[Wikipedia] No page found for query: "${query}"`);
      return undefined;
    }

    // Find the most relevant page from search results
    let bestPageId: number | undefined;
    let highestRelevance = -1; // Higher means more relevant (based on initial search title match)

    // Simple relevance based on title containing query words
    const queryWords = extractKeywords(query);

    for (const result of searchResults) {
        let currentRelevance = 0;
        const lowerTitle = result.title.toLowerCase();

        // Boost for exact match of query in title
        if (lowerTitle === query.toLowerCase()) {
            currentRelevance += 100;
        } else if (lowerTitle.includes(query.toLowerCase())) {
            currentRelevance += 50;
        }

        // Boost for each query keyword found in title
        queryWords.forEach(word => {
            if (lowerTitle.includes(word)) {
                currentRelevance += 10;
            }
        });

        // Penalize for very short titles if not exact match (could be disambiguation pages)
        if (lowerTitle.length < 10 && lowerTitle !== query.toLowerCase()) {
            currentRelevance -= 20;
        }

        if (currentRelevance > highestRelevance) {
            highestRelevance = currentRelevance;
            bestPageId = result.pageid;
        }
    }

    if (!bestPageId) {
      console.log(`[Wikipedia] No sufficiently relevant page found from search results for query: "${query}"`);
      return undefined;
    }

    // Step 2: Get the main image (pageimage) from the found page
    const pageImageUrl = `${WIKIPEDIA_API_BASE}?action=query&prop=pageimages&format=json&pithumbsize=800&pageids=${bestPageId}&origin=*`; // Increased thumbnail size
    const pageImageResponse = await fetch(pageImageUrl);
    const pageImageData = await pageImageResponse.json();

    const pages = pageImageData.query?.pages;
    const thumbnail = pages?.[bestPageId]?.thumbnail;
    const originalImageName = pages?.[bestPageId]?.pageimage;

    if (!thumbnail?.source || !originalImageName) {
      console.log(`[Wikipedia] No main image (thumbnail/filename) found for page ID: ${bestPageId} (original query: "${query}")`);
      return undefined;
    }

    // Step 3: Get detailed image info for full URL and attribution
    const imageInfoUrl = `${WIKIPEDIA_API_BASE}?action=query&titles=File:${encodeURIComponent(originalImageName)}&prop=imageinfo&iiprop=url|extmetadata&format=json&origin=*`;
    const imageInfoResponse = await fetch(imageInfoUrl);
    const imageInfoData = await imageInfoResponse.json();

    const imagePages = imageInfoData.query?.pages;
    const imagePageId = Object.keys(imagePages || {})[0];
    const imageInfo = imagePages?.[imagePageId]?.imageinfo?.[0];

    if (imageInfo?.url && imageInfo.extmetadata) {
      const fullImageUrl = imageInfo.url;
      const licenseShortName = imageInfo.extmetadata.LicenseShortName?.value || 'Unknown License';
      const artist = imageInfo.extmetadata.Artist?.value?.replace(/<[^>]*>?/gm, '').trim() || 'Unknown Artist';
      const imageDescription = imageInfo.extmetadata.ImageDescription?.value?.replace(/<[^>]*>?/gm, '').trim() || `Image of ${query}`;

      const credit = `Photo by ${artist} / Wikimedia Commons (${licenseShortName})`;

      // Final check for relevance before returning
      const finalRelevanceScore = calculateRelevanceScore(
        imageDescription, query, undefined, undefined, query, extractKeywords(query)
      ); // Pass query as item name for scoring context here

      if (finalRelevanceScore > 0) { // Simple threshold, can be refined if needed
          console.log(`[Wikipedia] Found image for "${query}" (Score: ${finalRelevanceScore}): ${fullImageUrl}`);
          return {
            url: fullImageUrl,
            alt: imageDescription,
            credit: credit
          };
      } else {
          console.log(`[Wikipedia] Image for "${query}" deemed not relevant after final scoring.`);
          return undefined;
      }
    }

    console.log(`[Wikipedia] Failed to get detailed image info or attribution for "${query}".`);
    return undefined;

  } catch (error) {
    console.error(`[Wikipedia] Error fetching image for "${query}":`, error);
    return undefined;
  }
}

// Add timeout utility
const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs: number = 5000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Improved cache with expiration
interface CacheItem {
  data: { url: string; alt: string; credit: string };
  timestamp: number;
}

const imageCache = new Map<string, CacheItem>();
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

const getCachedImage = (key: string) => {
  const cached = imageCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
    return cached.data;
  }
  if (cached) {
    imageCache.delete(key); // Remove expired cache
  }
  return null;
};

const setCachedImage = (key: string, data: { url: string; alt: string; credit: string }) => {
  imageCache.set(key, { data, timestamp: Date.now() });
};

export const imageService = {
  /**
   * Fetches an image for a single HighlightItem, trying cache first, then Wikipedia, then Unsplash, then Pexels.
   * Prioritizes more specific queries and applies a relevance scoring system.
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
    unsplashApiKey: string | undefined,
    pexelsApiKey: string | undefined,
    overallDestination?: string
  ): Promise<HighlightItem> => {
    // Generate search queries
    const searchQueries = generateSearchQueries(item, overallDestination);
    
    // Try to get from cache first
    for (const query of searchQueries) {
      const cacheKey = `${item.name}::${query}`;
      const cached = getCachedImage(cacheKey);
      if (cached && !usedImageUrls.has(cached.url)) {
        usedImageUrls.add(cached.url);
        return { ...item, imageUrl: cached.url, imageAlt: cached.alt, imageCredit: cached.credit };
      }
    }

    // Define API calls - USING PROXY FOR WIKIPEDIA NOW
    const apiCalls = [];
    
    try {
      // Try Wikipedia first (via proxy)
      for (const query of searchQueries.slice(0, 2)) {
        const wikipediaResult = await fetchWikipediaImageViaProxy(query);
        if (wikipediaResult && !usedImageUrls.has(wikipediaResult.url)) {
          usedImageUrls.add(wikipediaResult.url);
          setCachedImage(`${item.name}::${searchQueries[0]}`, wikipediaResult);
          return { 
            ...item, 
            imageUrl: wikipediaResult.url, 
            imageAlt: wikipediaResult.alt, 
            imageCredit: wikipediaResult.credit 
          };
        }
      }
      
      // Continue with other image sources if Wikipedia fails
      for (const query of searchQueries.slice(0, 2)) {
        // Unsplash
        if (unsplashApiKey) {
          apiCalls.push(
            fetchUnsplashImage(query, unsplashApiKey).catch(error => {
              console.warn(`Unsplash failed for "${query}":`, error.message);
              return null;
            })
          );
        }
        
        // Pexels
        if (pexelsApiKey) {
          apiCalls.push(
            fetchPexelsImage(query, pexelsApiKey).catch(error => {
              console.warn(`Pexels failed for "${query}":`, error.message);
              return null;
            })
          );
        }
      }

      // Process results from other APIs
      const results = await Promise.allSettled(apiCalls);
      
      let bestImage: { url: string; alt: string; credit: string } | null = null;
      let bestScore = -1;

      for (const result of results) {
        if (result.status === 'fulfilled' && result.value && !usedImageUrls.has(result.value.url)) {
          const score = calculateRelevanceScore(
            result.value.alt, item.name, item.location, overallDestination, item.description, item.tags
          );
          
          if (score > bestScore) {
            bestScore = score;
            bestImage = result.value;
          }
        }
      }

      if (bestImage) {
        usedImageUrls.add(bestImage.url);
        setCachedImage(`${item.name}::${searchQueries[0]}`, bestImage);
        return { ...item, imageUrl: bestImage.url, imageAlt: bestImage.alt, imageCredit: bestImage.credit };
      }

    } catch (error) {
      console.error(`[ImageService] Error fetching images for "${item.name}":`, error);
    }

    // Return with default placeholder if all APIs fail
    return { 
      ...item, 
      imageUrl: `/assets/defaults/${item.category?.toLowerCase() || 'attraction'}.jpg`,
      imageAlt: `${item.name}`,
      imageCredit: 'Default image' 
    };
  },

  /**
   * Fetches images for a batch of HighlightItems, using fallback logic.
   *
   * @param items An array of HighlightItem objects.
   * @param apiKeys An object containing API keys for Unsplash and Pexels.
   * @param overallDestination Optional: The main destination of the trip.
   * @returns A Promise that resolves to an array of HighlightItem objects,
   * updated with image URLs, alt text, and credits where available.
   */
  fetchImagesBatch: async (
    items: HighlightItem[],
    apiKeys: { unsplash?: string; pexels?: string },
    overallDestination?: string
  ): Promise<HighlightItem[]> => {
    usedImageUrls.clear();
    
    // Process in smaller batches to avoid overwhelming APIs
    const BATCH_SIZE = 5;
    const results: HighlightItem[] = [];
    
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(item =>
        imageService.fetchSingleImage(item, apiKeys.unsplash, apiKeys.pexels, overallDestination)
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error(`[ImageService] Failed to fetch image for item ${i + index}:`, result.reason);
          results.push(batch[index]); // Return original item without image
        }
      });
      
      // Small delay between batches to be respectful to APIs
      if (i + BATCH_SIZE < items.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    return results;
  }
};

// Helper functions with timeout
async function fetchWikipediaImage(query: string): Promise<{ url: string; alt: string; credit: string } | null> {
  try {
    // Clean the query - extract just the main attraction name
    const cleanQuery = query
      .split(',')[0]                // Remove everything after first comma
      .replace(/\s+\d+.*$/, '')     // Remove street numbers and what follows
      .replace(/\s+[(-].*$/, '')  // Remove parentheses and hyphens with what follows
      .trim();

    // First try a search to get the proper page title
    const searchUrl = `${WIKIPEDIA_API_BASE}?action=query&list=search&srsearch=${encodeURIComponent(cleanQuery)}&format=json&origin=*&srlimit=1`;
    
    const searchResponse = await fetchWithTimeout(searchUrl, {}, 3000);
    
    if (!searchResponse.ok) {
      return null;
    }
    
    const searchData = await searchResponse.json();
    if (!searchData.query?.search?.length) {
      console.log(`[Wikipedia] No search results for "${cleanQuery}" (original: "${query}")`);
      return null;
    }
    
    // Now get the summary using the proper page title
    const pageTitle = searchData.query.search[0].title;
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
    
    const response = await fetchWithTimeout(summaryUrl, {}, 3000);
    
    if (response.ok) {
      const data = await response.json();
      if (data.thumbnail?.source) {
        const betterImage = data.thumbnail.source.replace(/\/\d+px-/, '/800px-');
        return {
          url: betterImage,
          alt: data.title || cleanQuery,
          credit: 'Wikipedia'
        };
      }
    }
    
    console.log(`[Wikipedia] No thumbnail found for "${pageTitle}" (original: "${query}")`);
  } catch (error) {
    console.warn(`[Wikipedia] Error for "${query}":`, error);
    return null; // Don't throw error, just return null to allow fallbacks
  }
  return null;
}

async function fetchUnsplashImage(query: string, apiKey: string): Promise<{ url: string; alt: string; credit: string } | null> {
  try {
    const response = await fetchWithTimeout(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${apiKey}` } },
      5000
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.results?.length > 0) {
        const photo = data.results[0];
        return {
          url: photo.urls.regular,
          alt: photo.alt_description || query,
          credit: `Photo by ${photo.user.name} on Unsplash`
        };
      }
    }
  } catch (error) {
    throw new Error(`Unsplash API error: ${error}`);
  }
  return null;
}

async function fetchPexelsImage(query: string, apiKey: string): Promise<{ url: string; alt: string; credit: string } | null> {
  try {
    const response = await fetchWithTimeout(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
      { headers: { Authorization: apiKey } },
      5000
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.photos?.length > 0) {
        const photo = data.photos[0];
        return {
          url: photo.src.large,
          alt: photo.alt || query,
          credit: `Photo by ${photo.photographer} on Pexels`
        };
      }
    }
  } catch (error) {
    throw new Error(`Pexels API error: ${error}`);
  }
  return null;
}

function generateSearchQueries(item: HighlightItem, overallDestination?: string): string[] {
  const queries = [];
  
  // Most specific first
  if (item.location) {
    queries.push(`${item.name} ${item.location}`);
  }
  
  if (overallDestination) {
    queries.push(`${item.name} ${overallDestination}`);
  }
  
  queries.push(item.name);
  
  return Array.from(new Set(queries.filter(q => q.trim())));
}

// Add this function to your code
async function fetchWikipediaImageViaProxy(query: string): Promise<{ url: string; alt: string; credit: string } | null> {
  try {
    // Use your own API endpoint instead of direct Wikipedia API calls
    const response = await fetchWithTimeout(
      `/api/wikipedia?query=${encodeURIComponent(query)}`,
      {}, 
      5000
    );
    
    if (!response.ok) {
      console.warn(`[Wikipedia Proxy] API error for "${query}": ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.imageUrl) {
      return {
        url: data.imageUrl,
        alt: data.title || query,
        credit: 'Wikipedia'
      };
    }
    
    console.log(`[Wikipedia Proxy] No image found for "${query}"`);
    return null;
  } catch (error) {
    console.warn(`[Wikipedia Proxy] Error for "${query}":`, error);
    return null;
  }
}
