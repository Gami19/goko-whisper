import { useApp } from "../context/AppContext";
import type { Tab } from "../types";
import { BottomNavIcon } from "./BottomNavIcons";

const TABS: { id: Tab; label: string }[] = [
  { id: "home", label: "ホーム" },
  { id: "food", label: "食品" },
  { id: "present", label: "プレゼント" },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="bottom-nav" aria-label="メインナビゲーション">
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={
            activeTab === id
              ? "bottom-nav__btn bottom-nav__btn--active"
              : "bottom-nav__btn"
          }
          aria-current={activeTab === id ? "page" : undefined}
          onClick={() => setActiveTab(id)}
        >
          <span className="bottom-nav__icon">
            <BottomNavIcon tab={id} />
          </span>
          <span className="bottom-nav__label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
