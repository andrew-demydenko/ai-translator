import React from "react";

interface AlternativeChipProps {
  text: string;
  onClick: (text: string) => void;
}

export const AlternativeChip: React.FC<AlternativeChipProps> = ({
  text,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(text)}
      className="bg-gray-100 text-left px-6 hover:bg-gray-200 text-gray-700 py-2 rounded-full text-sm font-medium transition-colors border border-gray-200"
      title="Click to replace main translation"
    >
      {text}
    </button>
  );
};
