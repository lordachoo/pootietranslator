import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

// Fallback catchphrases (used if settings can't be loaded)
const FALLBACK_CATCHPHRASES = [
  "Sa da tay!",
  "Wa da tah!",
  "Sine your pitty on the runny kine!",
  "Sepatown!",
  "Cole me down on the panny sty!",
  "Tippy tow!",
  "Capatchow!",
  "Wadatah!",
];

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  showPhrase?: boolean;
  className?: string;
  phraseClassName?: string;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  showPhrase = true,
  className = "",
  phraseClassName = "",
  message,
}) => {
  const [phrase, setPhrase] = useState<string>("");
  const [phrases, setPhrases] = useState<string[]>(FALLBACK_CATCHPHRASES);

  // Map size to dimensions
  const sizeMap = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  // Fetch loading phrases from site settings
  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/settings");
        return await response.json();
      } catch (error) {
        console.error("Error fetching settings:", error);
        return null;
      }
    },
    // Don't refetch settings too often for the spinner
    staleTime: 60000, // 1 minute
    retryDelay: 5000, // Wait 5s before retry
  });

  // Parse phrases from settings when they load
  useEffect(() => {
    if (settings) {
      try {
        const phraseSetting = settings.find((s: any) => s.key === "loadingPhrases");
        if (phraseSetting?.value) {
          const loadedPhrases = JSON.parse(phraseSetting.value);
          if (Array.isArray(loadedPhrases) && loadedPhrases.length > 0) {
            setPhrases(loadedPhrases);
            console.log("LoadingSpinner: Loaded phrases from settings:", loadedPhrases);
          }
        }
      } catch (error) {
        console.error("Error parsing loading phrases:", error);
      }
    }
  }, [settings]);

  // Change the phrase every 2 seconds
  useEffect(() => {
    if (!showPhrase) return;

    // Set initial phrase
    const initialPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setPhrase(initialPhrase);
    console.log("LoadingSpinner: Initial phrase set to", initialPhrase);

    // Set up interval to change phrase
    const interval = setInterval(() => {
      const newPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      setPhrase(newPhrase);
      console.log("LoadingSpinner: Phrase changed to", newPhrase);
    }, 2000);

    console.log("LoadingSpinner: Started phrase rotation interval");

    // Clean up interval on unmount
    return () => {
      clearInterval(interval);
      console.log("LoadingSpinner: Cleaned up phrase rotation interval");
    };
  }, [showPhrase, phrases]);

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      {/* Spinner with pulsating effect */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" 
             style={{ 
               width: size === "small" ? "16px" : size === "medium" ? "32px" : "48px", 
               height: size === "small" ? "16px" : size === "medium" ? "32px" : "48px"
             }}></div>
        <Loader2 className={cn(
          "animate-spin text-primary relative z-10", 
          sizeMap[size]
        )} />
      </div>
      
      {/* Catchphrase with gradient text effect */}
      {showPhrase && (
        <p className={cn(
          "mt-4 text-center font-medium bg-gradient-to-r from-primary/90 to-primary/60 bg-clip-text text-transparent", 
          size === "small" ? "text-xs" : size === "medium" ? "text-sm" : "text-base",
          phraseClassName
        )}>
          {message || phrase}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;