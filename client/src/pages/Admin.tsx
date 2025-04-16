import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import AdminEntryTable from "@/components/AdminEntryTable";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { Separator } from "@/components/ui/separator";

const Admin = () => {
  const { isAuthenticated } = useAuth();
  const [_, setLocation] = useLocation();

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
      
      <AdminEntryTable />
    </div>
  );
};

export default Admin;
