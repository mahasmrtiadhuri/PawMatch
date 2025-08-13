import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertDogSchema, Dog } from "@shared/schema";
import { 
  DOG_SIZES, 
  DOG_ACTIVITY_LEVELS, 
  DOG_GENDERS,
  DOG_TRAINING_LEVELS,
  DOG_HEALTH_STATUSES,
  DOG_ADOPTION_STATUSES
} from "@/lib/constants";

// For demo purposes, we're assuming the user is logged in as a shelter admin with shelterId 1
const SHELTER_ID = 1;

export default function ShelterDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDogOpen, setIsAddDogOpen] = useState(false);

  // Fetch shelter dogs
  const { data: dogs, isLoading } = useQuery({
    queryKey: [`/api/shelters/${SHELTER_ID}/dogs`],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error('Failed to fetch shelter dogs');
      return await res.json();
    }
  });

  // Add dog form
  const form = useForm({
    resolver: zodResolver(insertDogSchema),
    defaultValues: {
      name: "",
      breed: "",
      age: 12, // Default to 1 year (12 months)
      size: "Medium",
      gender: "Male",
      description: "",
      imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1", // Default image
      goodWithKids: false,
      goodWithDogs: false,
      goodWithCats: false,
      activityLevel: "Medium",
      trainingLevel: "Basic",
      healthStatus: "Healthy",
      shelterId: SHELTER_ID,
      adoptionStatus: "available"
    }
  });

  // Add dog mutation
  const addDogMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/dogs', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/shelters/${SHELTER_ID}/dogs`] });
      toast({
        title: "Dog added successfully",
        description: "The new dog profile has been created.",
      });
      setIsAddDogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error adding dog",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  // Update dog status mutation
  const updateDogStatusMutation = useMutation({
    mutationFn: async ({ dogId, status }: { dogId: number, status: string }) => {
      return await apiRequest('PUT', `/api/dogs/${dogId}`, { adoptionStatus: status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/shelters/${SHELTER_ID}/dogs`] });
      toast({
        title: "Status updated",
        description: "The dog's adoption status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating status",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  // Form submission handler
  const onSubmit = (data: any) => {
    addDogMutation.mutate(data);
  };

  // Update dog status
  const updateDogStatus = (dogId: number, status: string) => {
    updateDogStatusMutation.mutate({ dogId, status });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Shelter Dashboard</h1>
          <Dialog open={isAddDogOpen} onOpenChange={setIsAddDogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary-500 hover:bg-primary-600">
                <i className="fas fa-plus mr-2"></i> Add New Dog
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">Add New Dog</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dog Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter dog name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="breed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Breed</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter dog breed" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age (months)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Enter age in months" 
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Example: 12 months = 1 year
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Size</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DOG_SIZES.map((size) => (
                                <SelectItem key={size} value={size}>{size}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DOG_GENDERS.map((gender) => (
                                <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="activityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select activity level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DOG_ACTIVITY_LEVELS.map((level) => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="trainingLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Training Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select training level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DOG_TRAINING_LEVELS.map((level) => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="healthStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Health Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select health status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DOG_HEALTH_STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter image URL" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL to a photo of the dog
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the dog's personality, behavior, etc." 
                            {...field} 
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="goodWithKids"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Good with kids</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="goodWithDogs"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Good with other dogs</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="goodWithCats"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Good with cats</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddDogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-primary-500 hover:bg-primary-600"
                      disabled={addDogMutation.isPending}
                    >
                      {addDogMutation.isPending ? "Adding..." : "Add Dog"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mb-8">
            <TabsTrigger value="all">All Dogs</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="adopted">Adopted</TabsTrigger>
          </TabsList>
          
          {DOG_ADOPTION_STATUSES.map(status => (
            <TabsContent key={status} value={status === "available" ? "available" : status === "pending" ? "pending" : status === "adopted" ? "adopted" : "all"}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                  // Loading skeletons
                  [...Array(4)].map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3">
                          <div className="h-48 md:h-full bg-gray-200 animate-pulse" />
                        </div>
                        <CardContent className="p-4 md:w-2/3">
                          <div className="flex justify-between mb-4">
                            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                          </div>
                          <div className="space-y-2 mb-4">
                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                          </div>
                          <div className="flex justify-between">
                            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))
                ) : dogs?.filter((dog: Dog) => status === "all" || dog.adoptionStatus === status).length > 0 ? (
                  dogs
                    .filter((dog: Dog) => status === "all" || dog.adoptionStatus === status)
                    .map((dog: Dog) => (
                      <Card key={dog.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3">
                            <img 
                              src={dog.imageUrl} 
                              alt={dog.name} 
                              className="h-48 md:h-full w-full object-cover"
                            />
                          </div>
                          <CardContent className="p-4 md:w-2/3">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-xl font-bold">{dog.name}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                dog.adoptionStatus === "available" 
                                  ? "bg-green-100 text-green-800" 
                                  : dog.adoptionStatus === "pending" 
                                    ? "bg-yellow-100 text-yellow-800" 
                                    : "bg-blue-100 text-blue-800"
                              }`}>
                                {dog.adoptionStatus.charAt(0).toUpperCase() + dog.adoptionStatus.slice(1)}
                              </span>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-500 space-x-4 mb-2">
                              <div>{dog.breed}</div>
                              <div>{Math.floor(dog.age / 12)} years</div>
                              <div>{dog.gender}</div>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{dog.description}</p>
                            
                            <div className="flex justify-between">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(`/dog/${dog.id}`, '_blank')}
                              >
                                View Profile
                              </Button>
                              
                              {dog.adoptionStatus === "available" && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                                  onClick={() => updateDogStatus(dog.id, "pending")}
                                  disabled={updateDogStatusMutation.isPending}
                                >
                                  Mark as Pending
                                </Button>
                              )}
                              
                              {dog.adoptionStatus === "pending" && (
                                <div className="space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="border-green-500 text-green-600 hover:bg-green-50"
                                    onClick={() => updateDogStatus(dog.id, "adopted")}
                                    disabled={updateDogStatusMutation.isPending}
                                  >
                                    Mark as Adopted
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => updateDogStatus(dog.id, "available")}
                                    disabled={updateDogStatusMutation.isPending}
                                  >
                                    Return to Available
                                  </Button>
                                </div>
                              )}
                              
                              {dog.adoptionStatus === "adopted" && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateDogStatus(dog.id, "available")}
                                  disabled={updateDogStatusMutation.isPending}
                                >
                                  Return to Available
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <h3 className="text-xl font-semibold">No dogs found</h3>
                    <p className="text-gray-500 mt-2">
                      {status === "all" 
                        ? "You haven't added any dogs yet." 
                        : `You don't have any ${status} dogs.`}
                    </p>
                    {status === "all" && (
                      <Button 
                        className="mt-4 bg-primary-500 hover:bg-primary-600"
                        onClick={() => setIsAddDogOpen(true)}
                      >
                        Add Your First Dog
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
