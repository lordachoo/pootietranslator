import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import LoginModal from "./LoginModal";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleTabChange = (value: string) => {
    setLocation(value);
  };

  const handleAuthButtonClick = () => {
    if (isAuthenticated) {
      logout();
      setLocation("/");
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Languages className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Pootie Tang Dictionary</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="secondary" 
              onClick={handleAuthButtonClick}
              className="rounded-full font-medium text-sm"
            >
              {isAuthenticated ? "Logout" : "Admin Login"}
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
              {isAuthenticated && (
                <TabsTrigger
                  value="/admin"
                  className="py-4 px-6 font-medium border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 rounded-none bg-transparent"
                >
                  Admin Panel
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
};

export default Header;
