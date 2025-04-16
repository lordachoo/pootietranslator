import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/SearchBar";
import DictionaryCard from "@/components/DictionaryCard";
import type { DictionaryEntry } from "@shared/schema";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="container mx-auto px-4 py-8">
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
          <div className="text-center py-8">Loading dictionary entries...</div>
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
