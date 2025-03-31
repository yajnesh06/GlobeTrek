
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Globe, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { TripFormData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  destination: z.string().min(2, 'Destination is required'),
  startingAddress: z.string().min(2, 'Starting address is required'),
  startDate: z.date(),
  endDate: z.date(),
  budget: z.string(),
  budgetAmount: z.number().min(1000, 'Budget must be at least 1000'),
  travelers: z.number().min(1, 'At least 1 traveler required').max(20, 'Maximum 20 travelers allowed'),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  dietaryRestrictions: z.array(z.string()).optional(),
  accommodationType: z.string(),
  transportationType: z.array(z.string()).min(1, 'Select at least one transportation type'),
  additionalNotes: z.string().optional(),
  currency: z.string().default('INR'),
});

const interestOptions = [
  'Adventure', 'Art & Culture', 'Food & Cuisine', 'History', 'Nature',
  'Nightlife', 'Photography', 'Relaxation', 'Shopping', 'Wildlife'
];

const dietaryOptions = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'Allergies', 'No Restrictions'
];

const accommodationOptions = [
  'Budget Hostel', 'Mid-range Hotel', 'Luxury Resort', 'Vacation Rental', 'Homestay', 'Any'
];

const transportationOptions = [
  'Public Transport', 'Rental Car', 'Rental Bikes','Taxi/Uber', 'Walking', 'Guided Tours'
];

const currencyOptions = [
  { value: 'INR', label: 'Indian Rupee (₹)' },
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
  { value: 'AUD', label: 'Australian Dollar (A$)' },
  { value: 'CAD', label: 'Canadian Dollar (C$)' },
  { value: 'SGD', label: 'Singapore Dollar (S$)' },
  { value: 'AED', label: 'UAE Dirham (د.إ)' },
];

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit }) => {
  const [activeTab, setActiveTab] = useState("basic");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: '',
      startingAddress: '',
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 4)),
      budget: 'medium',
      budgetAmount: 50000,
      travelers: 2,
      interests: [],
      dietaryRestrictions: [],
      accommodationType: 'Mid-range Hotel',
      transportationType: ['Public Transport'],
      additionalNotes: '',
      currency: 'INR',
    },
  });

  // Define budget ranges for INR
  const inrBudgetRanges = {
    low: { min: 5000, max: 30000, default: 15000 },
    medium: { min: 30000, max: 100000, default: 50000 },
    high: { min: 100000, max: 500000, default: 150000 },
    luxury: { min: 300000, max: 1000000, default: 500000 },
  };
  
  // Define budget ranges for other currencies
  const otherCurrencyBudgetRanges = {
    low: { min: 2000, max: 6000, default: 5000 },
    medium: { min: 8000, max: 20000, default: 15000 },
    high: { min: 20000, max: 50000, default: 30000 },
    luxury: { min: 50000, max: 100000, default: 60000 },
  };

  const budgetValue = form.watch('budget');
  const currencyValue = form.watch('currency');
  
  // Determine which budget ranges to use based on currency
  const budgetRanges = currencyValue === 'INR' ? inrBudgetRanges : otherCurrencyBudgetRanges;
  
  // Log for debugging
  console.log(`Using ${currencyValue} currency with budget ranges:`, budgetRanges);

  React.useEffect(() => {
    const budget = form.getValues('budget');
    form.setValue('budgetAmount', budgetRanges[budget as keyof typeof budgetRanges].default);
  }, [budgetValue, currencyValue, form, budgetRanges]);

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    // Add a log to verify the currency is being submitted
    console.log("Submitting form with currency:", data.currency);
    onSubmit(data as TripFormData);
  };

  const getCurrencySymbol = (currency: string) => {
    const found = currencyOptions.find(c => c.value === currency);
    if (!found) return '₹';
    return found.label.substring(found.label.indexOf('(') + 1, found.label.indexOf(')'));
  };

  const goToNextTab = () => {
    switch (activeTab) {
      case "basic":
        setActiveTab("dates");
        break;
      case "dates":
        setActiveTab("budget");
        break;
      case "budget":
        setActiveTab("preferences");
        break;
      case "preferences":
        setActiveTab("extras");
        break;
      default:
        break;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6 mx-auto max-w-full overflow-x-auto">
            <TabsTrigger value="basic">Basics</TabsTrigger>
            <TabsTrigger value="dates">Dates</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="extras">Extras</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6 animate-fade-in">
            <div className="space-y-4">
       

              <FormField
                control={form.control}
                name="startingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Starting From</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your starting location"
                        {...field}
                      />
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
                      <div className="relative">
                        <Globe className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="Where do you want to go?"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="travelers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Number of Travelers</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const currentValue = field.value;
                            if (currentValue > 1) {
                              field.onChange(currentValue - 1);
                            }
                          }}
                        >
                          -
                        </Button>
                        <span className="font-medium text-lg w-8 text-center">{field.value}</span>
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const currentValue = field.value;
                            if (currentValue < 20) {
                              field.onChange(currentValue + 1);
                            }
                          }}
                        >
                          +
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="button" 
                  onClick={goToNextTab}
                  className="flex items-center gap-2 bg-gradient-to-r from-voyage-500 to-voyage-600"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dates" className="space-y-6 animate-fade-in">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-base mb-2">Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className="pl-3 text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              disabled={(date) => date < new Date()}
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
                        <FormLabel className="text-base mb-2">End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className="pl-3 text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              disabled={(date) => {
                                const startDate = form.getValues("startDate");
                                return date < startDate || date < new Date();
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end pt-4">
              <Button 
                type="button" 
                onClick={goToNextTab}
                className="flex items-center gap-2 bg-gradient-to-r from-voyage-500 to-voyage-600"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="budget" className="space-y-6 animate-fade-in">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Budget Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Budget</SelectItem>
                          <SelectItem value="medium">Moderate</SelectItem>
                          <SelectItem value="high">Premium</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose your preferred currency
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="budgetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Budget Amount</FormLabel>
                    <div className="pb-6">
                      <FormControl>
                        <Slider
                          min={budgetRanges[budgetValue as keyof typeof budgetRanges].min}
                          max={budgetRanges[budgetValue as keyof typeof budgetRanges].max}
                          step={1000}
                          defaultValue={[field.value]}
                          onValueChange={(vals) => {
                            field.onChange(vals[0]);
                          }}
                        />
                      </FormControl>
                    </div>
                    <div className="flex justify-between items-center">
                      <FormDescription>
                        {getCurrencySymbol(currencyValue)}{budgetRanges[budgetValue as keyof typeof budgetRanges].min.toLocaleString()}
                      </FormDescription>
                      <Badge variant="outline" className="text-base font-semibold">
                        {getCurrencySymbol(currencyValue)}{field.value.toLocaleString()}
                      </Badge>
                      <FormDescription>
                        {getCurrencySymbol(currencyValue)}{budgetRanges[budgetValue as keyof typeof budgetRanges].max.toLocaleString()}
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                type="button" 
                onClick={goToNextTab}
                className="flex items-center gap-2 bg-gradient-to-r from-voyage-500 to-voyage-600"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6 animate-fade-in">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="interests"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-base">Travel Interests</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {interestOptions.map((interest) => (
                        <FormField
                          key={interest}
                          control={form.control}
                          name="interests"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={interest}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(interest)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, interest])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== interest
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {interest}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-4" />

              <FormField
                control={form.control}
                name="accommodationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Accommodation Preference</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select accommodation type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accommodationOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                type="button" 
                onClick={goToNextTab}
                className="flex items-center gap-2 bg-gradient-to-r from-voyage-500 to-voyage-600"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="extras" className="space-y-6 animate-fade-in">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="transportationType"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-base">Transport Options</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {transportationOptions.map((transport) => (
                        <FormField
                          key={transport}
                          control={form.control}
                          name="transportationType"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={transport}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(transport)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, transport])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== transport
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {transport}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-4" />

              <FormField
                control={form.control}
                name="dietaryRestrictions"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-base">Dietary Restrictions</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {dietaryOptions.map((diet) => (
                        <FormField
                          key={diet}
                          control={form.control}
                          name="dietaryRestrictions"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={diet}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(diet)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, diet])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== diet
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {diet}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
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
                    <FormLabel className="text-base">Additional Requirements</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special requirements or information for your trip"
                        className="resize-none min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-6">
              <Button 
                type="submit" 
                className="w-full md:w-auto bg-gradient-to-r from-voyage-500 to-voyage-600 hover:from-voyage-600 hover:to-voyage-700 text-white font-medium py-2 px-6 rounded-md shadow-md"
              >
                Generate Itinerary
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};

export default TripForm;
