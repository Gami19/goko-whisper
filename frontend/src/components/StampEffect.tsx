import { useEffect, useState } from "react";

type StampEffectProps = {
  active: boolean;
  onComplete: () => void;
};

export function StampEffect({ active, onComplete }: StampEffectProps) {
  const [showDone, setShowDone] = useState(false);

  useEffect(() => {
    if (!active) return;

    const doneTimer = setTimeout(() => {
      setShowDone(true);
    }, 1200);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2000);

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
