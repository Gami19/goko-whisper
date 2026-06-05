import { useState } from "react";
import { CodeDisplay } from "../components/CodeDisplay";
import { CountdownTimer } from "../components/CountdownTimer";
import { MemorialSilhouette } from "../components/MemorialSilhouette";
import { PageLayout } from "../components/PageLayout";
import { useApp } from "../context/AppContext";

function generateCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function GoalPage() {
  const { nickname } = useApp();

  const [token] = useState(() => ({
    code: generateCode(),
    expiresAt: Date.now() + 5 * 60 * 1000,
  }));

  const displayName = nickname.trim() || "旅人";

  return (
    <PageLayout variant="goal">
      <p className="text-label">── 五高の声が届いた ──</p>
      <MemorialSilhouette />
      <p className="nickname-display goal-nickname-enter">{displayName}</p>
      <CodeDisplay code={token.code} />
      <CountdownTimer expiresAt={token.expiresAt} />
      <p className="text-hint goal-hint-enter">
        この画面を提示してください
      </p>
    </PageLayout>
  );
}
