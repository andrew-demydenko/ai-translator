import React from "react";
import { Popover } from "@/shared/ui";

interface HistoryEntry {
  original: string;
  translated: string;
}

interface HistoryPopoverProps {
  history: HistoryEntry[];
  onClear: () => void;
}

export const HistoryPopover: React.FC<HistoryPopoverProps> = ({
  history,
  onClear,
}) => {
  return (
    <Popover
      trigger={({ toggle }) => (
        <button
          onClick={toggle}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-blue-600 flex items-center gap-1"
          title="Translation History"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 8v4l3 3" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          {history.length > 0 && (
            <span className="text-[10px] bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
              {history.length}
            </span>
          )}
        </button>
      )}
    >
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="text-sm font-bold text-slate-700 text-nowrap">
          История переводов
        </h3>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            Очистить
          </button>
        )}
      </div>
      <div className="overflow-y-auto max-h-[400px]">
        {history.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm text-nowrap">
            История пуста
          </div>
        ) : (
          <div className="divide-y divide-slate-100 w-[70vw] max-w-[600px]">
            {history.map((entry, index) => (
              <div
                key={index}
                className="flex gap-3 p-3 hover:bg-slate-50 transition-colors"
              >
                <div className="text-sm flex-1 text-slate-800 font-medium">
                  {entry.original}
                </div>
                <div className="text-sm flex-1 text-slate-500 mt-1 italic">
                  {entry.translated}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Popover>
  );
};
