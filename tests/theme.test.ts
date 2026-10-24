import { test } from "node:test";
import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import {
  persistTheme,
  readTheme,
  THEME_STORAGE_KEY,
  themeInitializationScript,
} from "../src/lib/theme";

test("theme defaults to light and only accepts an explicit saved dark choice", () => {
  assert.equal(readTheme(), "light");
  for (const value of [null, "", "LIGHT", "system", "dark-mode", "<script>"]) {
    assert.equal(readTheme({ getItem: () => value }), "light");
  }
  assert.equal(readTheme({ getItem: () => "dark" }), "dark");
  assert.equal(readTheme({ getItem: () => "light" }), "light");
});

test("theme storage failures do not prevent a usable default or explicit selection", () => {
  const blocked = () => { throw new Error("Storage blocked"); };
  assert.equal(readTheme({ getItem: blocked }), "light");
  assert.equal(persistTheme({ setItem: blocked }, "dark"), false);
  assert.equal(persistTheme(undefined, "dark"), false);
  const saved: Record<string, string> = {};
  assert.equal(persistTheme({ setItem: (key, value) => { saved[key] = value; } }, "dark"), true);
  assert.equal(saved[THEME_STORAGE_KEY], "dark");
});

test("pre-paint initialization honours saved choices and tolerates blocked storage access", () => {
  for (const selection of [null, "dark", "light", "invalid", "blocked"]) {
    const attributes: Record<string, string> = {};
    const style: Record<string, string> = {};
    const mockWindow = Object.defineProperty({}, "localStorage", {
      get() {
        if (selection === "blocked") throw new Error("Storage access denied");
        return { getItem: () => selection };
      },
    });
    runInNewContext(themeInitializationScript, {
      window: mockWindow,
      document: { documentElement: { setAttribute: (key: string, value: string) => { attributes[key] = value; }, style } },
    });
    const expected = selection === "dark" ? "dark" : "light";
    assert.equal(attributes["data-theme"], expected);
    assert.equal(style.colorScheme, expected);
  }
});
