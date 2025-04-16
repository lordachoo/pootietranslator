import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Volume2 } from "lucide-react";
import { insertDictionaryEntrySchema, type DictionaryEntry } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { z } from "zod";

// Extend schema with custom validations
const formSchema = insertDictionaryEntrySchema.extend({
  pootieTangPhrase: z.string().min(2, {
    message: "Pootie Tang phrase must be at least 2 characters.",
  }),
  englishTranslation: z.string().min(2, {
    message: "English translation must be at least 2 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AdminEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  entryToEdit?: DictionaryEntry;
}

const AdminEntryForm = ({ isOpen, onClose, entryToEdit }: AdminEntryFormProps) => {
  const { toast } = useToast();
  const isEditing = !!entryToEdit;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pootieTangPhrase: "",
      englishTranslation: "",
      usageContext: "",
      pronunciation: "",
      audioUrl: "",
    },
  });

  useEffect(() => {
    if (entryToEdit) {
      form.reset({
        pootieTangPhrase: entryToEdit.pootieTangPhrase,
        englishTranslation: entryToEdit.englishTranslation,
        usageContext: entryToEdit.usageContext || "",
        pronunciation: entryToEdit.pronunciation || "",
        audioUrl: entryToEdit.audioUrl || "",
      });
    } else {
      form.reset({
        pootieTangPhrase: "",
        englishTranslation: "",
        usageContext: "",
        pronunciation: "",
        audioUrl: "",
      });
    }
  }, [entryToEdit, form, isOpen]);

  const createEntryMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      console.log("Creating dictionary entry...");
      
      // Add artificial delay to make loading state more visible (for testing)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await apiRequest("POST", "/api/dictionary", data);
      console.log("Dictionary entry created");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dictionary"] });
      toast({
        title: "Success",
        description: "Dictionary entry created successfully",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create entry: ${error}`,
        variant: "destructive",
      });
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      console.log("Updating dictionary entry...");
      
      if (!entryToEdit) throw new Error("No entry to edit");
      
      // Add artificial delay to make loading state more visible (for testing)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await apiRequest("PUT", `/api/dictionary/${entryToEdit.id}`, data);
      
      console.log("Dictionary entry updated");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dictionary"] });
      toast({
        title: "Success",
        description: "Dictionary entry updated successfully",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update entry: ${error}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    if (isEditing) {
      updateEntryMutation.mutate(data);
    } else {
      createEntryMutation.mutate(data);
    }
  };

  const isPending = createEntryMutation.isPending || updateEntryMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? "Edit Dictionary Entry" : "Add New Dictionary Entry"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pootieTangPhrase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pootie Tang Phrase</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phrase..." {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="englishTranslation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>English Translation</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter translation..." {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usageContext"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Context</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter usage context or examples..." 
                      {...field} 
                      value={field.value || ''}
                      rows={3}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium mb-2">Pronunciation Guide</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add pronunciation information to help users correctly say the Pootie Tang phrase.
              </p>
              
              <FormField
                control={form.control}
                name="pronunciation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phonetic Pronunciation</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. /sah-dah-tay/" 
                        {...field} 
                        value={field.value || ''}
                        disabled={isPending} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a phonetic spelling to help with pronunciation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="audioUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audio URL (Optional)</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="https://example.com/audio.mp3" 
                          {...field} 
                          value={field.value || ''}
                          disabled={isPending} 
                          className="flex-1"
                        />
                        {field.value && (
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => {
                              if (!field.value) return;
                              const audio = new Audio(field.value);
                              audio.play().catch(err => {
                                console.error("Error playing audio:", err);
                                toast({
                                  title: "Audio Error",
                                  description: "Could not play the audio file",
                                  variant: "destructive"
                                });
                              });
                            }}
                            disabled={isPending || !field.value}
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Link to an audio file for pronunciation (mp3, wav, etc)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="small" showPhrase={false} className="mr-2" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save Entry"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminEntryForm;
