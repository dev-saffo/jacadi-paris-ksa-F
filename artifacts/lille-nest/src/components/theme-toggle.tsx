import { useRef, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

type ThemeViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const transitionInProgress = useRef(false);

  const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    if (transitionInProgress.current) return;

    const systemPrefersDark =
      theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const currentTheme =
      resolvedTheme ?? (systemPrefersDark ? "dark" : theme ?? "light");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    const transitionDocument = document as ThemeViewTransitionDocument;
    const startViewTransition = transitionDocument.startViewTransition;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!startViewTransition || prefersReducedMotion) {
      setTheme(nextTheme);
      return;
    }

    const buttonBounds = event.currentTarget.getBoundingClientRect();
    const originX = buttonBounds.left + buttonBounds.width / 2;
    const originY = buttonBounds.top + buttonBounds.height / 2;
    const revealRadius =
      Math.hypot(
        Math.max(originX, window.innerWidth - originX),
        Math.max(originY, window.innerHeight - originY),
      ) + 16;
    const root = document.documentElement;

    root.style.setProperty("--theme-switch-x", `${originX}px`);
    root.style.setProperty("--theme-switch-y", `${originY}px`);
    root.style.setProperty("--theme-switch-radius", `${revealRadius}px`);
    transitionInProgress.current = true;

    const finishTransition = () => {
      root.style.removeProperty("--theme-switch-x");
      root.style.removeProperty("--theme-switch-y");
      root.style.removeProperty("--theme-switch-radius");
      transitionInProgress.current = false;
    };

    try {
      const transition = startViewTransition.call(document, () => {
        flushSync(() => setTheme(nextTheme));
      });
      void transition.finished.then(finishTransition, finishTransition);
    } catch {
      finishTransition();
      setTheme(nextTheme);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9"
      onClick={toggleTheme}
      aria-label="Toggle light and dark theme"
      aria-pressed={resolvedTheme === "dark"}
      data-testid="button-theme-toggle"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform duration-300 ease-out dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform duration-300 ease-out dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
