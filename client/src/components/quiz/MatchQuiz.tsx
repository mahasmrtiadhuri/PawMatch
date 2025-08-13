import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/queryClient';
import { insertUserPreferencesSchema } from '@shared/schema';
import { useLocation } from 'wouter';

// Extend the schema with validation
const quizSchema = insertUserPreferencesSchema.extend({
  userId: z.number().optional(),
});

type QuizFormValues = z.infer<typeof quizSchema>;

export default function MatchQuiz() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  // Initialize form
  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      activityLevel: "Medium",
      homeType: "House",
      hasYard: true,
      hasKids: false,
      hasOtherPets: false,
      experienceLevel: "Some experience",
      preferredAge: "Adult",
      preferredSize: "Medium",
      hoursAlone: 4
    }
  });
  
  // Form submission handler
  const onSubmit = async (data: QuizFormValues) => {
    try {
      // For demo purposes, we'll simulate the API request without an actual userId
      console.log('Quiz submitted with data:', data);
      
      toast({
        title: "Preferences Saved!",
        description: "We're analyzing your perfect matches now.",
      });
      
      // Navigate to the recommendation results page
      setTimeout(() => {
        setLocation('/recommendations');
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem saving your preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  const totalSteps = 3;
  
  // Next step handler
  const nextStep = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Previous step handler
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">Find Your Perfect Match</h2>
          <span className="text-sm text-gray-500">Step {step} of {totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Tell us about your lifestyle</h3>
              
              <FormField
                control={form.control}
                name="activityLevel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>How active is your lifestyle?</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Low" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Low - Mostly relaxing at home
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Medium" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Medium - Regular walks and some outdoor activities
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="High" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            High - Very active with regular exercise and outdoor adventures
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="homeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What type of home do you live in?</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select home type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hasYard"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Do you have a yard or outdoor space?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hoursAlone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How many hours would the dog be alone on a typical day?</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        min={0}
                        max={24}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Tell us about your household</h3>
              
              <FormField
                control={form.control}
                name="hasKids"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Do you have children in your home?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hasOtherPets"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Do you have other pets?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="experienceLevel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>What is your experience level with dogs?</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="First-time" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            First-time dog owner
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Some experience" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Some experience with dogs
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Experienced" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Experienced dog owner
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Dog preferences</h3>
              
              <FormField
                control={form.control}
                name="preferredAge"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>What age dog are you looking for?</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Puppy" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Puppy (0-1 year)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Young" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Young (1-3 years)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Adult" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Adult (3-7 years)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Senior" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Senior (7+ years)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="preferredSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What size dog would be best for your home?</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size preference" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Small">Small (under 25 lbs)</SelectItem>
                        <SelectItem value="Medium">Medium (25-50 lbs)</SelectItem>
                        <SelectItem value="Large">Large (over 50 lbs)</SelectItem>
                        <SelectItem value="Any">Any size</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep}
              >
                Previous
              </Button>
            )}
            {step < totalSteps ? (
              <Button 
                type="button" 
                className="ml-auto"
                onClick={nextStep}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" className="ml-auto">
                Find My Match
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
