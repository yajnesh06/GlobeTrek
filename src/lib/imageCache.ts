// src/lib/imageCache.ts

interface ImageData {
    url: string;
    alt?: string;
    credit?: string;
  }
  
  class ImageCache {
    private cache = new Map<string, ImageData>();
  
    // Stores an image for a specific item name
    set(name: string, data: ImageData) {
      this.cache.set(name, data);
    }
  
    // Retrieves an image data by item name
    get(name: string): ImageData | undefined {
      return this.cache.get(name);
    }
  
    // Checks if an image for a given name is in cache
    has(name: string): boolean {
      return this.cache.has(name);
    }
  
    // Clears the entire cache (useful for development or forced refresh)
    clear() {
      this.cache.clear();
    }
  }
  
  export const imageCache = new ImageCache();