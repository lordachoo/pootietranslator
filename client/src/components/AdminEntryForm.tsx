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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { insertDictionaryEntrySchema, type DictionaryEntry } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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
    },
  });

  useEffect(() => {
    if (entryToEdit) {
      form.reset({
        pootieTangPhrase: entryToEdit.pootieTangPhrase,
        englishTranslation: entryToEdit.englishTranslation,
        usageContext: entryToEdit.usageContext || "",
      });
    } else {
      form.reset({
        pootieTangPhrase: "",
        englishTranslation: "",
        usageContext: "",
      });
    }
  }, [entryToEdit, form, isOpen]);

  const createEntryMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/dictionary", data);
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
      if (!entryToEdit) throw new Error("No entry to edit");
      const response = await apiRequest("PUT", `/api/dictionary/${entryToEdit.id}`, data);
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
                      rows={3}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                {isPending ? "Saving..." : "Save Entry"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminEntryForm;
