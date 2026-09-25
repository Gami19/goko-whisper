import type { Tab } from "../types";

type NavIconProps = {
  tab: Tab;
};

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M12 4.2v2.1M12 17.7v2.1M4.2 12h2.1M17.7 12h2.1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="m12 7.2 2.1 6.3L12 12.2l-2.1 1.3L12 7.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LanternIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.8v2.2M9 5h6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M8 8.2h8l-.9 8.6H8.9L8 8.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M10 19.2h4M9.2 21.2h5.6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="9.5" r="5.2" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="m8.8 13.6-1 6.2 4.2-2.1 4.2 2.1-1-6.2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS: Record<Tab, () => React.JSX.Element> = {
  home: CompassIcon,
  food: LanternIcon,
  present: BadgeIcon,
};

export function BottomNavIcon({ tab }: NavIconProps) {
  const Icon = ICONS[tab];
  return <Icon />;
}
