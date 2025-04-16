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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Form validation schema
const formSchema = z.object({
  siteTitle: z.string().min(1, "Site title is required"),
  siteDescription: z.string().min(1, "Site description is required"),
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
    },
  });

  // Fetch the current site settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      const response = await fetch("/api/settings");
      const data = await response.json();
      return data;
    },
  });

  // Set the form values when settings are loaded
  useEffect(() => {
    if (settings && !settingsLoading) {
      const titleSetting = settings.find((s: any) => s.key === "siteTitle");
      const descriptionSetting = settings.find((s: any) => s.key === "siteDescription");

      form.reset({
        siteTitle: titleSetting?.value || "",
        siteDescription: descriptionSetting?.value || "",
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

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      
      // Update title and description
      await updateTitleMutation.mutateAsync(data.siteTitle);
      await updateDescriptionMutation.mutateAsync(data.siteDescription);
      
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>
          Customize the website title and description text
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

            <Button type="submit" disabled={isLoading || settingsLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
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