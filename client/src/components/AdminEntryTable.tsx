import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon, Edit, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { DictionaryEntry } from "@shared/schema";
import AdminEntryForm from "./AdminEntryForm";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import SearchBar from "./SearchBar";
import LoadingSpinner from "./LoadingSpinner";

const AdminEntryTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<DictionaryEntry | undefined>(undefined);
  const [entryToDelete, setEntryToDelete] = useState<number | undefined>(undefined);

  const { data: entries = [], isLoading } = useQuery<DictionaryEntry[]>({
    queryKey: ["/api/dictionary", searchQuery],
    queryFn: async () => {
      const url = searchQuery 
        ? `/api/dictionary?q=${encodeURIComponent(searchQuery)}`
        : "/api/dictionary";
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch dictionary entries");
      return response.json();
    },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddNew = () => {
    setEntryToEdit(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (entry: DictionaryEntry) => {
    setEntryToEdit(entry);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setEntryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Dictionary Management</h2>
          <Button onClick={handleAddNew} className="inline-flex items-center gap-1">
            <PlusIcon className="h-4 w-4" /> New Entry
          </Button>
        </div>
        
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search dictionary entries..."
          initialQuery={searchQuery}
        />
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <LoadingSpinner 
                size="medium" 
                message={searchQuery ? `Searching for "${searchQuery}"...` : undefined}
              />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-1/3">Pootie Tang Phrase</TableHead>
                      <TableHead className="w-1/3">English Translation</TableHead>
                      <TableHead className="w-1/4">Context/Usage</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6">
                          No dictionary entries found
                        </TableCell>
                      </TableRow>
                    ) : (
                      entries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.pootieTangPhrase}</TableCell>
                          <TableCell>{entry.englishTranslation}</TableCell>
                          <TableCell className="text-gray-500">{entry.usageContext}</TableCell>
                          <TableCell className="text-right space-x-2 whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(entry)}
                              className="text-primary hover:text-primary-dark"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(entry.id)}
                              className="text-destructive hover:text-destructive/80"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {entries.length > 0 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{entries.length}</span> entries
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <AdminEntryForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        entryToEdit={entryToEdit}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        entryId={entryToDelete}
      />
    </>
  );
};

export default AdminEntryTable;
