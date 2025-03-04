import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, PlusCircle, MinusCircle } from 'lucide-react';
import { TripFormData } from '@/types';
import TripFormStepper from './TripFormStepper';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  destination: z.string().min(2, { message: 'Please enter a valid destination' }),
  startingAddress: z.string().min(2, { message: 'Please enter a valid starting address' }),
  startDate: z.date({ required_error: 'Please select a start date' }),
  endDate: z.date({ required_error: 'Please select an end date' }),
  budget: z.string({ required_error: 'Please select a budget' }),
  travelers: z.number().min(1, { message: 'At least 1 traveler required' }).max(20, { message: 'Maximum 20 travelers allowed' }),
  interests: z.array(z.string()).min(1, { message: 'Please select at least one interest' }),
  dietaryRestrictions: z.array(z.string()),
  accommodationType: z.string({ required_error: 'Please select accommodation type' }),
  transportationType: z.array(z.string()).min(1, { message: 'Please select at least one transportation type' }),
  additionalNotes: z.string().optional(),
});

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: '',
      startingAddress: '',
      travelers: 2,
      interests: [],
      dietaryRestrictions: [],
      transportationType: [],
      additionalNotes: '',
      budget: 'moderate', // Set a default budget
    },
  });

  const steps = [
    'Destination',
    'Dates',
    'Travelers',
    'Preferences',
    'Review'
  ];

  const handleNext = async () => {
    const fieldsToValidate = {
      0: ['destination', 'startingAddress'],
      1: ['startDate', 'endDate'],
      2: ['travelers', 'budget'],
      3: ['interests', 'accommodationType', 'transportationType'],
    }[currentStep];

    if (fieldsToValidate) {
      const isValid = await form.trigger(fieldsToValidate as any);
      if (!isValid) return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    const tripData: TripFormData = {
      destination: data.destination,
      startingAddress: data.startingAddress,
      startDate: data.startDate,
      endDate: data.endDate,
      budget: data.budget,
      travelers: data.travelers,
      interests: data.interests,
      dietaryRestrictions: data.dietaryRestrictions,
      accommodationType: data.accommodationType,
      transportationType: data.transportationType,
      additionalNotes: data.additionalNotes || '',
    };
    
    onSubmit(tripData);
  };

  const interestOptions = [
    { id: 'culture', label: 'Culture & History' },
    { id: 'nature', label: 'Nature & Outdoors' },
    { id: 'adventure', label: 'Adventure & Sports' },
    { id: 'food', label: 'Food & Cuisine' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'relaxation', label: 'Relaxation & Wellness' },
    { id: 'nightlife', label: 'Nightlife & Entertainment' },
    { id: 'photography', label: 'Photography' },
    { id: 'art', label: 'Art & Museums' },
    { id: 'local', label: 'Local Experiences' },
  ];

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'glutenFree', label: 'Gluten-Free' },
    { id: 'dairyFree', label: 'Dairy-Free' },
    { id: 'halal', label: 'Halal' },
    { id: 'kosher', label: 'Kosher' },
    { id: 'nutFree', label: 'Nut-Free' },
  ];

  const transportOptions = [
    { id: 'walking', label: 'Walking' },
    { id: 'publicTransport', label: 'Public Transport' },
    { id: 'taxi', label: 'Taxi / Ride-share' },
    { id: 'rental', label: 'Car Rental' },
    { id: 'bike', label: 'Bicycle' },
    { id: 'tour', label: 'Guided Tours' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <TripFormStepper 
        steps={steps} 
        currentStep={currentStep} 
        onStepClick={(step) => {
          if (step < currentStep) {
            setCurrentStep(step);
          }
        }}
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="form-scroll-container">
            {currentStep === 0 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-semibold text-gray-900">Where do you want to go?</h2>
                <FormField
                  control={form.control}
                  name="startingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Starting Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your starting address" {...field} className="h-12 text-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Destination</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city, country, or region" {...field} className="h-12 text-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-semibold text-gray-900">When are you traveling?</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal h-12",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal h-12",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const startDate = form.getValues().startDate;
                                return date < new Date() || (startDate && date < startDate);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-semibold text-gray-900">Travelers & Budget</h2>
                
                <FormField
                  control={form.control}
                  name="travelers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Travelers</FormLabel>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => field.onChange(Math.max(1, field.value - 1))}
                          className="h-10 w-10 rounded-full"
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        
                        <FormControl>
                          <div className="flex justify-center items-center w-16 h-12 font-medium text-lg border rounded-md">
                            {field.value}
                          </div>
                        </FormControl>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => field.onChange(Math.min(20, field.value + 1))}
                          className="h-10 w-10 rounded-full"
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Budget Level</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                          <FormItem className="h-full">
                            <FormLabel className="sr-only">Budget</FormLabel>
                            <FormControl>
                              <label>
                                <Card className={`cursor-pointer transition-all border h-full ${
                                  field.value === 'budget' ? 'border-voyage-500 bg-voyage-50' : ''
                                }`}>
                                  <CardContent className="flex flex-col items-center justify-between p-6 text-center space-y-2">
                                    <RadioGroupItem 
                                      value="budget" 
                                      id="budget" 
                                      className="sr-only" 
                                    />
                                    <div className="text-xl font-medium">Budget</div>
                                    <div className="text-gray-500 text-sm">Cost-effective options</div>
                                  </CardContent>
                                </Card>
                              </label>
                            </FormControl>
                          </FormItem>
                          
                          <FormItem className="h-full">
                            <FormLabel className="sr-only">Moderate</FormLabel>
                            <FormControl>
                              <label>
                                <Card className={`cursor-pointer transition-all border h-full ${
                                  field.value === 'moderate' ? 'border-voyage-500 bg-voyage-50' : ''
                                }`}>
                                  <CardContent className="flex flex-col items-center justify-between p-6 text-center space-y-2">
                                    <RadioGroupItem 
                                      value="moderate" 
                                      id="moderate" 
                                      className="sr-only" 
                                    />
                                    <div className="text-xl font-medium">Moderate</div>
                                    <div className="text-gray-500 text-sm">Mid-range comfort</div>
                                  </CardContent>
                                </Card>
                              </label>
                            </FormControl>
                          </FormItem>
                          
                          <FormItem className="h-full">
                            <FormLabel className="sr-only">Luxury</FormLabel>
                            <FormControl>
                              <label>
                                <Card className={`cursor-pointer transition-all border h-full ${
                                  field.value === 'luxury' ? 'border-voyage-500 bg-voyage-50' : ''
                                }`}>
                                  <CardContent className="flex flex-col items-center justify-between p-6 text-center space-y-2">
                                    <RadioGroupItem 
                                      value="luxury" 
                                      id="luxury" 
                                      className="sr-only" 
                                    />
                                    <div className="text-xl font-medium">Luxury</div>
                                    <div className="text-gray-500 text-sm">Premium experiences</div>
                                  </CardContent>
                                </Card>
                              </label>
                            </FormControl>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-2xl font-semibold text-gray-900">Preferences</h2>
                
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Travel Interests (Select at least one)</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                        {interestOptions.map((interest) => (
                          <FormItem
                            key={interest.id}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(interest.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, interest.id])
                                    : field.onChange(field.value?.filter((value) => value !== interest.id));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {interest.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dietaryRestrictions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dietary Restrictions (Optional)</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                        {dietaryOptions.map((option) => (
                          <FormItem
                            key={option.id}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, option.id])
                                    : field.onChange(field.value?.filter((value) => value !== option.id));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="accommodationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Accommodation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select accommodation type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hotel">Hotel</SelectItem>
                          <SelectItem value="hostel">Hostel</SelectItem>
                          <SelectItem value="apartment">Apartment / Vacation Rental</SelectItem>
                          <SelectItem value="resort">Resort</SelectItem>
                          <SelectItem value="boutique">Boutique Hotel</SelectItem>
                          <SelectItem value="guesthouse">Guesthouse / B&B</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="transportationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Transportation (Select at least one)</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                        {transportOptions.map((option) => (
                          <FormItem
                            key={option.id}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, option.id])
                                    : field.onChange(field.value?.filter((value) => value !== option.id));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us more about your trip, special requirements, or anything else we should know..."
                          className="resize-none min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-semibold text-gray-900">Review Your Trip Details</h2>
                
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Starting Address</h3>
                      <p className="text-base font-medium">{form.getValues().startingAddress}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Destination</h3>
                      <p className="text-base font-medium">{form.getValues().destination}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Travel Dates</h3>
                      <p className="text-base font-medium">
                        {form.getValues().startDate && format(form.getValues().startDate, "PPP")} to {form.getValues().endDate && format(form.getValues().endDate, "PPP")}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Travelers</h3>
                      <p className="text-base font-medium">{form.getValues().travelers}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Budget Level</h3>
                      <p className="text-base font-medium capitalize">{form.getValues().budget}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Interests</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {form.getValues().interests.map((interest) => (
                        <span key={interest} className="px-2.5 py-0.5 bg-voyage-100 text-voyage-800 rounded-full text-sm">
                          {interestOptions.find(opt => opt.id === interest)?.label || interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {form.getValues().dietaryRestrictions.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Dietary Restrictions</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {form.getValues().dietaryRestrictions.map((diet) => (
                          <span key={diet} className="px-2.5 py-0.5 bg-gray-100 text-gray-800 rounded-full text-sm">
                            {dietaryOptions.find(opt => opt.id === diet)?.label || diet}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Accommodation</h3>
                    <p className="text-base font-medium capitalize">{form.getValues().accommodationType}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Transportation</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {form.getValues().transportationType.map((transport) => (
                        <span key={transport} className="px-2.5 py-0.5 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {transportOptions.find(opt => opt.id === transport)?.label || transport}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {form.getValues().additionalNotes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Additional Notes</h3>
                      <p className="text-base">{form.getValues().additionalNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between pt-4 border-t">
            {currentStep > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
              >
                Previous
              </Button>
            ) : (
              <div></div>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-voyage-500 hover:bg-voyage-600"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-voyage-500 hover:bg-voyage-600"
              >
                Create My Itinerary
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TripForm;
