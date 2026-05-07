import React, { useState } from "react";
import { useTranslationSocket } from "./hooks/useTranslationSocket";
import { TranslationRequest } from "@ai-translator/shared-types";

const App: React.FC = () => {
  const [text, setText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("uk");
  const [mode, setMode] = useState<TranslationRequest["mode"]>("standard");

  const { translate, status, chunks, result, error } = useTranslationSocket("ws://localhost:3001");

  const handleTranslate = () => {
    if (!text.trim()) return;
    translate({
      text,
      sourceLang,
      targetLang,
      mode,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">AI Translator</h1>
          <p className="text-gray-600">Phase 1 - Core MVP</p>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Source Language (e.g., en)"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Target Language (e.g., uk)"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="border p-2 rounded"
            />
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as TranslationRequest["mode"])}
              className="border p-2 rounded"
            >
              <option value="standard">Standard</option>
              <option value="formal">Formal</option>
              <option value="informal">Informal</option>
              <option value="technical">Technical</option>
            </select>
          </div>

          <textarea
            className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter text to translate..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            onClick={handleTranslate}
            disabled={status === "streaming"}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {status === "streaming" ? "Translating..." : "Translate"}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow">
            {error}
          </div>
        )}

        {(status === "streaming" || result) && (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Translation Result</h2>
            
            {status === "streaming" && (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <p className="text-gray-500 italic">Streaming JSON: {chunks}</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-lg font-medium">{result.translation}</p>
                </div>
                
                {result.alternatives && result.alternatives.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Alternatives</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {result.alternatives.map((alt, i) => (
                        <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.contextNote && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border-l-4 border-gray-300">
                    <strong>Note:</strong> {result.contextNote}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
