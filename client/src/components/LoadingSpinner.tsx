import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Array of Pootie Tang catchphrases
const CATCHPHRASES = [
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

  // Map size to dimensions
  const sizeMap = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  // Change the phrase every 2 seconds
  useEffect(() => {
    if (!showPhrase) return;

    // Set initial phrase
    setPhrase(CATCHPHRASES[Math.floor(Math.random() * CATCHPHRASES.length)]);

    // Set up interval to change phrase
    const interval = setInterval(() => {
      setPhrase(CATCHPHRASES[Math.floor(Math.random() * CATCHPHRASES.length)]);
    }, 2000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [showPhrase]);

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeMap[size])} />
      
      {showPhrase && (
        <p className={cn("text-primary mt-2 text-center", phraseClassName)}>
          {message || phrase}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;