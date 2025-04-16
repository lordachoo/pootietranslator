import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";

// Form validation schema
const formSchema = z.object({
  siteTitle: z.string().min(1, "Site title is required"),
  siteDescription: z.string().min(1, "Site description is required"),
  gifUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  loadingPhrases: z.string().refine((value) => {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed);
    } catch {
      return false;
    }
  }, "Must be a valid JSON array of phrases. Example: [\"Sa da tay!\", \"Wa da tah!\"]"),
});

type FormValues = z.infer<typeof formSchema>;

const SiteSettingsForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Define the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteTitle: "",
      siteDescription: "",
      gifUrl: "",
      loadingPhrases: "[]",
    },
  });

  // Fetch the current site settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      console.log("Loading site settings...");
      
      // Add artificial delay to make loading state more visible (for testing)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await fetch("/api/settings");
      const data = await response.json();
      
      console.log("Site settings loaded");
      return data;
    },
    staleTime: 0, // Don't use cached data
  });

  // Set the form values when settings are loaded
  useEffect(() => {
    if (settings && !settingsLoading) {
      const titleSetting = settings.find((s: any) => s.key === "siteTitle");
      const descriptionSetting = settings.find((s: any) => s.key === "siteDescription");
      const gifUrlSetting = settings.find((s: any) => s.key === "gifUrl");
      const loadingPhrasesSetting = settings.find((s: any) => s.key === "loadingPhrases");

      form.reset({
        siteTitle: titleSetting?.value || "",
        siteDescription: descriptionSetting?.value || "",
        gifUrl: gifUrlSetting?.value || "",
        loadingPhrases: loadingPhrasesSetting?.value || "[]",
      });

      setIsLoading(false);
    }
  }, [settings, settingsLoading, form]);

  // Update site title mutation
  const updateTitleMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "siteTitle",
        value: title,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  // Update site description mutation
  const updateDescriptionMutation = useMutation({
    mutationFn: async (description: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "siteDescription",
        value: description,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  // Update GIF URL mutation
  const updateGifUrlMutation = useMutation({
    mutationFn: async (gifUrl: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "gifUrl",
        value: gifUrl,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  // Update loading phrases mutation
  const updateLoadingPhrasesMutation = useMutation({
    mutationFn: async (phrases: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "loadingPhrases",
        value: phrases,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      
      // Update title, description, GIF URL, and loading phrases
      await updateTitleMutation.mutateAsync(data.siteTitle);
      await updateDescriptionMutation.mutateAsync(data.siteDescription);
      await updateGifUrlMutation.mutateAsync(data.gifUrl || "");
      await updateLoadingPhrasesMutation.mutateAsync(data.loadingPhrases);
      
      toast({
        title: "Settings updated",
        description: "Site settings have been updated successfully",
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update site settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner when initially fetching settings
  if (settingsLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>
            Customize the website title, description text, and add a GIF
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <LoadingSpinner size="large" message="Loading settings..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>
          Customize the website title, description text, and add a GIF
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="siteTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter website title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter website description"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gifUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GIF URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter GIF URL (optional)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                  {field.value && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                      <img 
                        src={field.value} 
                        alt="GIF Preview" 
                        className="max-w-full h-auto rounded-md border max-h-[200px]" 
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loadingPhrases"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loading Spinner Phrases</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={'["Sa da tay!", "Wa da tah!", "Sine your pitty on the runny kine!"]'}
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Enter phrases as a JSON array of strings. These will be displayed randomly in the loading spinner.
                  </FormDescription>
                  <FormMessage />
                  {field.value && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                      <div className="bg-gray-50 rounded-md p-3 text-sm font-mono overflow-auto max-h-[200px]">
                        {(() => {
                          try {
                            const phrases = JSON.parse(field.value);
                            return (
                              <ul className="list-disc pl-5">
                                {Array.isArray(phrases) && phrases.map((phrase, index) => (
                                  <li key={index} className="mb-1">{phrase}</li>
                                ))}
                              </ul>
                            );
                          } catch (e) {
                            return <p className="text-destructive">Invalid JSON format</p>;
                          }
                        })()}
                      </div>
                    </div>
                  )}
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading || settingsLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="small" showPhrase={false} className="mr-2" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Settings"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SiteSettingsForm;