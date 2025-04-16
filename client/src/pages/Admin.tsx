import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import AdminEntryTable from "@/components/AdminEntryTable";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import SiteSettingsForm from "@/components/SiteSettingsForm";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  const { isAuthenticated } = useAuth();
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dictionary");

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <ChangePasswordForm />
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <Tabs defaultValue="dictionary" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="dictionary">Dictionary Entries</TabsTrigger>
          <TabsTrigger value="settings">Site Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dictionary">
          <AdminEntryTable />
        </TabsContent>
        
        <TabsContent value="settings">
          <SiteSettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
