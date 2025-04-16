import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialQuery?: string;
}

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search for English or Pootie Tang words...", 
  initialQuery = ""
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-8">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full py-6 pl-10 pr-4 bg-gray-50"
                placeholder={placeholder}
              />
            </div>
          </div>
          <div>
            <Button 
              type="submit"
              className="w-full md:w-auto py-3 px-6"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
