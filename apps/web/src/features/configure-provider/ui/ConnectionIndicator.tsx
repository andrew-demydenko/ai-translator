import React from "react";
import { clsx } from "clsx";
import { Popover } from "@/shared/ui/Popover";
import { useConfigStatus } from "../model/useConfigStatus";

export const ConnectionIndicator: React.FC = () => {
  const { status, isLoading, isError } = useConfigStatus();

  let color: string;
  let label: string;
  let title: string;

  if (isLoading) {
    color = "bg-amber-400";
    label = "LLM Checking...";
    title = "Checking LLM connection...";
  } else if (isError) {
    color = "bg-red-500";
    label = "Error";
    title = "Failed to check LLM status";
  } else if (status.llmConnected) {
    color = "bg-green-500";
    label = `LLM Connected (${status.model})`;
    title = `LLM connected (${status.provider}: ${status.model})`;
  } else {
    color = "bg-red-500";
    label = "LLM isn't configured";
    title = `LLM isn't configured: ${status.llmStatus}`;
  }

  return (
    <div className="flex items-center gap-1.5" title={title}>
      <span className={clsx("w-2 h-2 rounded-full", color)} />
      <span className="text-xs text-slate-400 hidden md:inline">{label}</span>
      {!status.llmConnected && (
        <Popover
          trigger={({ toggle }) => (
            <button
              onClick={toggle}
              className="p-2 text-red-300 rounded-full"
              title="LLM Status Info"
            >
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
            </button>
          )}
        >
          <div className="p-3 text-sm w-[200px] text-slate-600">
            {status.llmStatus}
          </div>
        </Popover>
      )}
    </div>
  );
};
