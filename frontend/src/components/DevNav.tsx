import { useApp } from "../context/AppContext";
import type { Screen } from "../types";

const SCREENS: { id: Screen; label: string }[] = [
  { id: "top", label: "top" },
  { id: "stamp1", label: "stamp1" },
  { id: "stamp2", label: "stamp2" },
  { id: "goal", label: "goal" },
];

export function DevNav() {
  const { screen, goToScreen } = useApp();

  if (!import.meta.env.DEV) return null;

  return (
    <nav className="dev-nav" aria-label="開発用ナビゲーション">
      {SCREENS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={screen === id ? "dev-nav__btn dev-nav__btn--active" : "dev-nav__btn"}
          onClick={() => goToScreen(id)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
