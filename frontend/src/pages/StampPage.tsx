import { useCallback, useState } from "react";
import { DividerLine } from "../components/DividerLine";
import { PageLayout } from "../components/PageLayout";
import { StampEffect } from "../components/StampEffect";
import { TextButton } from "../components/TextButton";
import { WhisperReveal } from "../components/WhisperReveal";
import type { WhisperContent } from "../types";

type StampPageProps = {
  content: WhisperContent;
  onComplete: () => void;
};

export function StampPage({ content, onComplete }: StampPageProps) {
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

  return (
    <PageLayout variant="stamp">
      <p className="text-label">── {content.label} ──</p>
      <WhisperReveal text={content.text} />
      <DividerLine variant="dashed" />
      <p className="text-hint">{content.hint}</p>
      {!stamping && !done && (
        <TextButton label="囁きを刻む" onClick={handleStamp} />
      )}
      <StampEffect active={stamping} onComplete={handleEffectComplete} />
    </PageLayout>
  );
}
