import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryId?: number;
}

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  entryId 
}: DeleteConfirmationModalProps) => {
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      console.log("Deleting dictionary entry...");
      
      if (!entryId) throw new Error("No entry ID provided");
      
      // Add artificial delay to make loading state more visible (for testing)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await apiRequest("DELETE", `/api/dictionary/${entryId}`);
      
      console.log("Dictionary entry deleted");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dictionary"] });
      toast({
        title: "Success",
        description: "Dictionary entry deleted successfully",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete entry: ${error}`,
        variant: "destructive",
      });
      onClose();
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold">Delete Entry?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this dictionary entry? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? (
              <div className="flex items-center">
                <LoadingSpinner size="small" showPhrase={false} className="mr-2" />
                <span>Deleting...</span>
              </div>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationModal;
