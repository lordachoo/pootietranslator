import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import LoginModal from "./LoginModal";
import { useQuery } from "@tanstack/react-query";

const Header = () => {
  const [location, setLocation] = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Fetch site settings for the title
  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      const response = await fetch("/api/settings");
      if (!response.ok) {
        throw new Error("Failed to fetch site settings");
      }
      return response.json();
    }
  });

  // Get site title from settings
  const getSiteTitle = (): string => {
    if (!settings) return "Pootie Tang Dictionary";
    const titleSetting = settings.find((s: any) => s.key === "siteTitle");
    return titleSetting?.value || "Pootie Tang Dictionary";
  };

  const handleTabChange = (value: string) => {
    setLocation(value);
  };

  const handleAuthButtonClick = () => {
    setShowLoginModal(true);
  };

  return (
    <>
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Languages className="h-6 w-6" />
            <h1 className="text-2xl font-bold">{getSiteTitle()}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="secondary" 
              onClick={handleAuthButtonClick}
              className="rounded-full font-medium text-sm"
            >
              Admin Login
            </Button>
          </div>
        </div>
      </header>

      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <Tabs
            defaultValue="/"
            value={location}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="flex w-full justify-start bg-transparent h-auto">
              <TabsTrigger
                value="/"
                className="py-4 px-6 font-medium border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 rounded-none bg-transparent"
              >
                Dictionary
              </TabsTrigger>
              <TabsTrigger
                value="/admin"
                className="py-4 px-6 font-medium border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 rounded-none bg-transparent"
              >
                Admin Panel
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* LoginModal temporarily removed to fix auth issues */}
    </>
  );
};

export default Header;
