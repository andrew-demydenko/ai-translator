import React from "react";
import { clsx } from "clsx";
import { NavLink } from "react-router-dom";

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            clsx(
              "text-2xl font-bold text-slate-900 tracking-tight border-b-4",
              isActive ? "border-blue-600" : "border-transparent",
            )
          }
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
    </header>
  );
};
