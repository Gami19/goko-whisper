import { useEffect, useState } from "react";

type CountdownTimerProps = {
  expiresAt: number;
  delay?: number;
};

type TimerState = "normal" | "warning" | "critical" | "expired";

function getTimerState(remainingMs: number): TimerState {
  if (remainingMs <= 0) return "expired";
  if (remainingMs <= 60_000) return "critical";
  if (remainingMs <= 120_000) return "warning";
  return "normal";
}

function formatTime(remainingMs: number): string {
  const totalSec = Math.max(0, Math.ceil(remainingMs / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, "0")} : ${String(sec).padStart(2, "0")}`;
}

export function CountdownTimer({ expiresAt, delay = 3500 }: CountdownTimerProps) {
  const [now, setNow] = useState(() => Date.now());
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(showTimer);
  }, [delay]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const remaining = expiresAt - now;

  if (!visible) return null;

  const state = getTimerState(remaining);
  const className = [
    "countdown-timer",
    "goal-timer-enter",
    state === "warning" ? "countdown-timer--warning" : "",
    state === "critical" ? "countdown-timer--critical" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <p className={className}>
      {state === "expired" ? "期限切れ" : formatTime(remaining)}
    </p>
  );
}
