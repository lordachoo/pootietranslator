import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import AdminEntryTable from "@/components/AdminEntryTable";

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
      <AdminEntryTable />
    </div>
  );
};

export default Admin;
