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
      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border border-gray-200"
      title="Click to replace main translation"
    >
      {text}
    </button>
  );
};
