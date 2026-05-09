import React from "react";

interface FormalityBadgeProps {
  level: "formal" | "neutral" | "informal";
}

/**
 * Displays a badge indicating the formality level of the translation.
 */
export const FormalityBadge: React.FC<FormalityBadgeProps> = ({ level }) => {
  const styles = {
    formal: "bg-purple-100 text-purple-700 border-purple-200",
    neutral: "bg-blue-100 text-blue-700 border-blue-200",
    informal: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-tighter border ${styles[level]}`}
    >
      {level}
    </span>
  );
};
