import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Header } from "./components/layout/Header";
import { TranslationPage } from "./pages/TranslationPage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="h-screen bg-slate-50 p-4 md:p-8 flex flex-col">
        <div className="flex-1 max-w-4xl mx-auto space-y-6 w-full flex flex-col min-h-[1px]">
          <Header />
          <Routes>
            <Route path="/" element={<TranslationPage />} />
            <Route path="/:mode" element={<TranslationPage />} />
            {/* Redirect any other unknown routes to standard mode */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
