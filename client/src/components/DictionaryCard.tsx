import { Card, CardContent } from "@/components/ui/card";
import { Info, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { DictionaryEntry } from "@shared/schema";

interface DictionaryCardProps {
  entry: DictionaryEntry;
}

const DictionaryCard = ({ entry }: DictionaryCardProps) => {
  const { toast } = useToast();
  
  const handlePronunciation = () => {
    // Determine what text to speak - use pronunciation field if available, otherwise use the phrase
    const textToSpeak = entry.pronunciation && entry.pronunciation.trim() !== "" 
      ? entry.pronunciation.replace(/[\/\-_]/g, '') // Clean up pronunciation guides like /slashes/ and -dashes-
      : entry.pootieTangPhrase;
      
    if (entry.audioUrl && entry.audioUrl.trim() !== "") {
      // If custom audio URL is provided, play that
      const audio = new Audio(entry.audioUrl);
      audio.play().catch(err => {
        console.error("Error playing audio:", err);
        toast({
          title: "Audio Error",
          description: "Could not play the audio file",
          variant: "destructive"
        });
        // Fall back to speech synthesis if audio file fails
        speakPhrase(textToSpeak);
      });
    } else {
      // Otherwise use speech synthesis
      speakPhrase(textToSpeak);
    }
  };
  
  const speakPhrase = (phrase: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.rate = 0.8; // Slow down a bit for clarity
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Speech Not Supported",
        description: "Your browser doesn't support text-to-speech",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="mb-4 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold text-gray-900">{entry.pootieTangPhrase}</h3>
            <div className="text-sm text-gray-500">Pootie Tang Phrase</div>
          </div>
          <div>
            <div className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full">
              <span className="mr-1 text-gray-600">→</span>
              <span className="text-sm font-medium">English Translation</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-gray-900">"{entry.englishTranslation}"</p>
          
          {(entry.pronunciation || (entry.audioUrl && entry.audioUrl.trim() !== "")) && (
            <div className="mt-4 flex flex-wrap gap-3">
              {entry.pronunciation && (
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                  <span className="text-sm font-medium">{entry.pronunciation}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 p-0 hover:text-primary hover:bg-primary/20"
                    onClick={handlePronunciation}
                    title="Hear pronunciation"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {!entry.pronunciation && entry.audioUrl && entry.audioUrl.trim() !== "" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={handlePronunciation}
                >
                  <Volume2 className="h-3.5 w-3.5 mr-1" />
                  Play Audio
                </Button>
              )}
            </div>
          )}
          
          {entry.usageContext && (
            <div className="mt-3 flex items-center text-sm text-gray-500">
              <Info className="h-4 w-4 mr-1" />
              <span>{entry.usageContext}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DictionaryCard;
