import { useState } from "react";
import { CodeDisplay } from "../components/CodeDisplay";
import { CountdownTimer } from "../components/CountdownTimer";
import { DividerLine } from "../components/DividerLine";
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
      <MemorialSilhouette />
      <p className="goal-closing goal-closing-enter">
        あなたは今、
        <br />
        百年前の声が聞こえた
        <br />
        場所に立っている。
      </p>
      <DividerLine variant="primary" />
      <p className="nickname-display goal-nickname-enter">{displayName}</p>
      <CodeDisplay code={token.code} />
      <CountdownTimer expiresAt={token.expiresAt} />
      <p className="text-hint goal-hint-enter">
        スタッフに提示してください
      </p>
    </PageLayout>
  );
}
