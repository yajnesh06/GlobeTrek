// src/hooks/useAttractionImages.ts

import { useState, useEffect } from 'react';
import { HighlightItem } from '@/types'; // Ensure HighlightItem is correctly imported
import { imageService } from '@/lib/imageService'; // Ensure imageService is correctly imported

interface UseAttractionImagesResult {
  highlightItems: HighlightItem[];
  isLoading: boolean;
}

// Add overallDestination to the hook's parameters
export const useAttractionImages = (
  initialItems: HighlightItem[],
  overallDestination?: string // <--- NEW PARAMETER HERE
): UseAttractionImagesResult => {
  const [highlightItems, setHighlightItems] = useState<HighlightItem[]>(initialItems);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        // Pass overallDestination to the imageService
        const updatedItems = await imageService.fetchImagesBatch(initialItems, overallDestination); // <--- Pass new param here
        setHighlightItems(updatedItems);
      } catch (error) {
        console.error("Error fetching images in useAttractionImages:", error);
        // On error, revert to initial items, potentially with undefined image props
        setHighlightItems(initialItems.map(item => ({ ...item, imageUrl: undefined, imageAlt: undefined, imageCredit: undefined })));
      } finally {
        setIsLoading(false);
      }
    };

    if (initialItems.length > 0) {
      fetchImages();
    } else {
      setHighlightItems([]);
      setIsLoading(false);
    }
  }, [initialItems, overallDestination]); // Re-run effect if overallDestination changes

  return { highlightItems, isLoading };
};