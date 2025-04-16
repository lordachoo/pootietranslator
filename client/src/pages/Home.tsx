import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/SearchBar";
import DictionaryCard from "@/components/DictionaryCard";
import SiteInfo from "@/components/SiteInfo";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { DictionaryEntry } from "@shared/schema";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Using staleTime: 0 to ensure we always show loading state on new searches
  const { data: entries = [], isLoading } = useQuery<DictionaryEntry[]>({
    queryKey: ["/api/dictionary", searchQuery],
    queryFn: async () => {
      console.log("Loading dictionary entries...");
      
      // Add artificial delay to make loading state more visible (for testing)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const url = searchQuery 
        ? `/api/dictionary?q=${encodeURIComponent(searchQuery)}`
        : "/api/dictionary";
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch dictionary entries");
      
      console.log("Dictionary entries loaded");
      return response.json();
    },
    staleTime: 0, // Don't use cached data
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <SiteInfo className="mb-8" />
      </div>
      <SearchBar onSearch={handleSearch} />

      <div className="max-w-5xl mx-auto">
        <div className="text-sm text-gray-600 mb-4">
          {searchQuery ? (
            `Showing results for "${searchQuery}" (${entries.length} ${entries.length === 1 ? 'entry' : 'entries'})`
          ) : (
            `Showing ${entries.length} dictionary ${entries.length === 1 ? 'entry' : 'entries'}`
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <LoadingSpinner 
              size="large" 
              showPhrase={true}
            />
          </div>
        ) : entries.length > 0 ? (
          entries.map((entry) => (
            <DictionaryCard key={entry.id} entry={entry} />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No entries found</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? `No results found for "${searchQuery}". Try a different search term.` 
                : "No dictionary entries available yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
