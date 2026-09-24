import { useCallback, useState } from "react";
import { DividerLine } from "../components/DividerLine";
import { PageLayout } from "../components/PageLayout";
import type { PageVariant } from "../components/PageLayout";
import { StampEffect } from "../components/StampEffect";
import { TextButton } from "../components/TextButton";
import { WhisperReveal } from "../components/WhisperReveal";
import { useApp } from "../context/AppContext";
import type { WhisperContent } from "../types";

type StampPageProps = {
  content: WhisperContent;
  variant: Extract<PageVariant, "stamp1" | "stamp2">;
  onComplete: () => void;
};

export function StampPage({ content, variant, onComplete }: StampPageProps) {
  const { autoFlowActive } = useApp();
  const [stamping, setStamping] = useState(false);
  const [done, setDone] = useState(false);

  const handleStamp = useCallback(() => {
    if (stamping || done) return;
    setStamping(true);
  }, [stamping, done]);

  const handleEffectComplete = useCallback(() => {
    setDone(true);
    onComplete();
  }, [onComplete]);

  const whisperTone = variant === "stamp2" ? "glow" : "primary";

  return (
    <PageLayout variant={variant}>
      <p className="text-label">── {content.label} ──</p>
      <WhisperReveal text={content.text} tone={whisperTone} />
      <DividerLine variant="dashed" />
      <p className="text-hint">{content.hint}</p>
      {!autoFlowActive && !stamping && !done && (
        <TextButton label="声を刻む" variant="serif" onClick={handleStamp} />
      )}
      <StampEffect active={stamping} onComplete={handleEffectComplete} />
    </PageLayout>
  );
}
