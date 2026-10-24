"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import {
  asTheme,
  persistTheme,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
}

function subscribe(onChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    applyTheme(asTheme(event.newValue));
    onChange();
  };
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", handleStorage);
  };
}

function getSnapshot(): Theme {
  return asTheme(document.documentElement.getAttribute("data-theme"));
}

function getServerSnapshot(): Theme {
  return "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const dark = theme === "dark";
  const label = dark ? "Switch to light theme" : "Switch to dark theme";

  function toggleTheme() {
    const next = getSnapshot() === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      persistTheme(window.localStorage, next);
    } catch {
      // Storage access itself can be blocked. The current-page choice still works.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={label}
      aria-pressed={dark}
      title={label}
      onClick={toggleTheme}
    >
      {dark ? (
        <Sun size={19} strokeWidth={1.8} aria-hidden="true" />
      ) : (
        <Moon size={19} strokeWidth={1.8} aria-hidden="true" />
      )}
    </button>
  );
}
