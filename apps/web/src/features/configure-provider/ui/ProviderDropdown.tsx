import React, { useState } from "react";
import { Popover } from "@/shared/ui";
import { useProviderStore } from "../model/provider.store";
import { useSetApiKey } from "../model/useSetApiKey";
import type { Provider } from "../model/types";

export const ProviderDropdown: React.FC = () => {
  const { provider, model, host, setProvider, setModel, setHost } =
    useProviderStore();
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKeyLocal] = useState("");

  const saveApiKeyMutation = useSetApiKey(() => {
    setApiKeyLocal("");
    setIsOpen(false);
    saveApiKeyMutation.reset();
  });

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) return;
    saveApiKeyMutation.mutate(apiKey.trim());
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={({ toggle }) => (
        <button
          onClick={toggle}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-blue-600"
          title="AI Provider Settings"
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
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      )}
      contentClassName="w-72"
    >
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="text-sm font-bold text-slate-700">AI Provider</h3>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Provider
          </label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as Provider)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="ollama">Ollama</option>
            <option value="deepseek">DeepSeek</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Model
          </label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. llama3.2, deepseek-chat"
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-300"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Host
          </label>
          <input
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="e.g. http://localhost:11434, https://api.deepseek.com"
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-300"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            API Key
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKeyLocal(e.target.value)}
              placeholder="sk-..."
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-300"
            />
            <button
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim() || saveApiKeyMutation.isPending}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saveApiKeyMutation.isPending ? "..." : "Save"}
            </button>
          </div>
          {saveApiKeyMutation.isError && (
            <p className="text-xs text-red-500">Failed to save API key</p>
          )}
        </div>
      </div>
    </Popover>
  );
};
