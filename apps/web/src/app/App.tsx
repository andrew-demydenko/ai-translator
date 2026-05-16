import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  redirect,
} from "react-router-dom";
import { Header } from "@/widgets/header";
import { TranslationPage } from "@/pages/translation";
import { PracticePage } from "@/pages/practice";

const App: React.FC = () => {
  return (
    <Router>
      <div className="h-screen bg-slate-50 p-4 md:p-8 flex flex-col">
        <div className="flex-1 max-w-4xl mx-auto space-y-6 w-full flex flex-col min-h-[1px]">
          <Header />
          <Routes>
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/translate/:mode" element={<TranslationPage />} />
            {/* Redirect any other unknown routes to standard mode */}

            <Route
              path="*"
              element={<Navigate to="/translate/standard" replace />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
