import React from "react";

interface ContextNoteProps {
  note: string;
}

/**
 * Displays a linguistic note providing context or explaining differences between translations.
 */
export const ContextNote: React.FC<ContextNoteProps> = ({ note }) => {
  if (!note) return null;

  return (
    <div className="text-sm text-gray-600 bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
      <div className="flex items-start gap-2">
        <span className="text-amber-600 mt-0.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </span>
        <p>
          <span className="font-semibold text-amber-800">Context:</span> {note}
        </p>
      </div>
    </div>
  );
};
