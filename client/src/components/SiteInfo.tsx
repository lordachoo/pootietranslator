import { useQuery } from "@tanstack/react-query";

type SiteSettings = {
  id: number;
  key: string;
  value: string;
  updatedAt: string;
};

interface SiteInfoProps {
  className?: string;
}

const SiteInfo = ({ className = "" }: SiteInfoProps) => {
  // Fetch site settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      const response = await fetch("/api/settings");
      if (!response.ok) {
        throw new Error("Failed to fetch site settings");
      }
      return response.json();
    }
  });

  // Get title and description from settings
  const getSetting = (key: string): string => {
    if (!settings) return "";
    const setting = settings.find((s: SiteSettings) => s.key === key);
    return setting?.value || "";
  };

  const title = getSetting("siteTitle");
  const description = getSetting("siteDescription");

  // Show loading skeleton if data is still loading
  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="h-8 bg-gray-200 rounded-md animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded-md animate-pulse w-full"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
        {title || "Pootie Tang Dictionary"}
      </h1>
      <p className="text-muted-foreground mt-2">
        {description || "Translate between Pootie Tang and English"}
      </p>
    </div>
  );
};

export default SiteInfo;