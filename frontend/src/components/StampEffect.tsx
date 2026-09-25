import { useEffect, useState } from "react";

type StampEffectProps = {
  active: boolean;
  onComplete: () => void;
};

function vibrate() {
  if ("vibrate" in navigator) {
    navigator.vibrate(300);
  }
}

const STAMP_DONE_DELAY_MS = 5000;
const STAMP_COMPLETE_AFTER_DONE_MS = 2300;

export function StampEffect({ active, onComplete }: StampEffectProps) {
  const [showDone, setShowDone] = useState(false);

  useEffect(() => {
    if (!active) return;

    vibrate();

    const doneTimer = setTimeout(() => {
      setShowDone(true);
    }, STAMP_DONE_DELAY_MS);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, STAMP_DONE_DELAY_MS + STAMP_COMPLETE_AFTER_DONE_MS);

    return () => {
      clearTimeout(doneTimer);
      clearTimeout(completeTimer);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <>
      <div className="stamp-effect-overlay">
        <div className="stamp-effect-light" />
      </div>
      {showDone && <p className="stamp-done-message">刻まれた</p>}
    </>
  );
}
