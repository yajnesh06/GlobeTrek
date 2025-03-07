
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AddressAutocompleteProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  name: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

interface Suggestion {
  address_line1: string;
  address_line2: string;
  formatted: string;
  place_id: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  placeholder,
  value,
  onChange,
  name,
  className,
  required,
  disabled
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(inputValue, 300);

  // Reset component when value changes from outside (when changing between fields)
  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
  
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
  
    return debouncedValue;
  }

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const API_KEY = "68555af3f1a040f1ae75866ecdbfe846";
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
            debouncedSearchTerm
          )}&format=json&apiKey=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setSuggestions(data.results || []);
        setShowSuggestions(data.results && data.results.length > 0);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current && 
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const address = suggestion.formatted;
    setInputValue(address);
    onChange(address);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        name={name}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (!e.target.value) {
            onChange("");
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }}
        onFocus={() => {
          // Only show suggestions if we have typed something
          if (suggestions.length > 0 && inputValue.length >= 3) {
            setShowSuggestions(true);
          }
        }}
        onBlur={(e) => {
          setTimeout(() => {
            if (!suggestionRef.current?.contains(document.activeElement)) {
              setShowSuggestions(false);
            }
          }, 200);
        }}
        placeholder={placeholder}
        className={className}
        required={required}
        disabled={disabled}
        autoComplete="off"
      />
      
      {showSuggestions && (
        <div 
          ref={suggestionRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-2 text-sm text-gray-500">Loading suggestions...</div>
          ) : (
            <ul>
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  className="px-4 py-2 cursor-pointer hover:bg-voyage-50 text-sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="font-medium">{suggestion.address_line1}</div>
                  {suggestion.address_line2 && (
                    <div className="text-gray-500 text-xs">{suggestion.address_line2}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
