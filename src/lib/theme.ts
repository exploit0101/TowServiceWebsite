export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "easytowing-theme";
export const THEME_CHANGE_EVENT = "easytowing:theme-change";

export function asTheme(value: unknown): Theme {
  return value === "dark" ? "dark" : "light";
}

export function readTheme(storage?: Pick<Storage, "getItem">): Theme {
  try {
    return asTheme(storage?.getItem(THEME_STORAGE_KEY));
  } catch {
    return "light";
  }
}

export function persistTheme(
  storage: Pick<Storage, "setItem"> | undefined,
  theme: Theme,
): boolean {
  try {
    if (!storage) return false;
    storage.setItem(THEME_STORAGE_KEY, theme);
    return true;
  } catch {
    return false;
  }
}

// Kept small and synchronous so an explicit saved choice applies before paint.
// An unavailable or invalid preference always falls back to light, irrespective
// of the visitor's operating-system theme. No cookies or third parties are used.
export const themeInitializationScript = `(function(){var theme="light";try{if(window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})==="dark")theme="dark";}catch(_){}document.documentElement.setAttribute("data-theme",theme);document.documentElement.style.colorScheme=theme;})();`;
