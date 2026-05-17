import React from "react";
import { clsx } from "clsx";
import { NavLink, useLocation } from "react-router-dom";
import { ProviderDropdown } from "@/features/configure-provider";
import { useConfigStatus } from "@/features/configure-provider/model/useConfigStatus";

const ConnectionIndicator: React.FC = () => {
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
    label = "LLM Connected";
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
    </div>
  );
};

export const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <NavLink
          to="/"
          className={clsx(
            "text-2xl font-bold text-slate-900 tracking-tight border-b-4",
            location.pathname.includes("/translate")
              ? "border-blue-600"
              : "border-transparent",
          )}
        >
          AI Translator
        </NavLink>

        <NavLink
          to="/practice"
          className={({ isActive }) =>
            clsx(
              "text-2xl font-bold text-slate-900 tracking-tight border-b-4",
              isActive ? "border-blue-600" : "border-transparent",
            )
          }
        >
          Practice
        </NavLink>
      </div>

      <div className="flex items-center gap-3">
        <ConnectionIndicator />
        <ProviderDropdown />
      </div>
    </header>
  );
};
