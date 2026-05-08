import React from "react";
import { SentenceExample } from "@ai-translator/shared-types";

interface ExamplesSectionProps {
  examples: SentenceExample[];
}

/**
 * Displays usage examples for the translation in both source and target languages.
 */
export const ExamplesSection: React.FC<ExamplesSectionProps> = ({ examples }) => {
  if (!examples || examples.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Examples</h3>
      <div className="space-y-2">
        {examples.map((ex, i) => (
          <div key={i} className="p-3 bg-gray-50 rounded border-l-2 border-blue-400">
            <p className="text-sm text-gray-500 italic mb-1">{ex.source}</p>
            <p className="text-sm font-medium text-gray-800">{ex.translated}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
