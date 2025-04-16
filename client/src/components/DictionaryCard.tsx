import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import type { DictionaryEntry } from "@shared/schema";

interface DictionaryCardProps {
  entry: DictionaryEntry;
}

const DictionaryCard = ({ entry }: DictionaryCardProps) => {
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
          {entry.usageContext && (
            <div className="mt-2 flex items-center text-sm text-gray-500">
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
