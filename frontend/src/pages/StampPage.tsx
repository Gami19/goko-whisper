import { DividerLine } from "../components/DividerLine";
import { PageLayout } from "../components/PageLayout";
import type { PageVariant } from "../components/PageLayout";
import { StampEffect } from "../components/StampEffect";
import { WhisperReveal } from "../components/WhisperReveal";
import { GUIDE_ONLY_STAMP2, WHISPERS } from "../data/whispers";
import type { WhisperId } from "../types";

type StampPageProps =
  | { mode: "whisper"; which: WhisperId; onComplete: () => void }
  | { mode: "guide"; which: WhisperId };

export function StampPage(props: StampPageProps) {
  const content = WHISPERS[props.which];
  const variant: Extract<PageVariant, "stamp1" | "stamp2"> =
    props.which === 1 ? "stamp1" : "stamp2";
  const whisperTone = props.which === 2 ? "glow" : "primary";
  const guideHint = props.which === 1 ? content.hint : GUIDE_ONLY_STAMP2;

  return (
    <PageLayout variant={variant}>
      <p className="text-label">── {content.label} ──</p>
      {props.mode === "whisper" ? (
        <WhisperReveal text={content.text} tone={whisperTone} />
      ) : (
        <p className="text-hint">{guideHint}</p>
      )}
      {props.mode === "whisper" && (
        <>
          <DividerLine variant="dashed" />
          <StampEffect active onComplete={props.onComplete} />
        </>
      )}
    </PageLayout>
  );
}
