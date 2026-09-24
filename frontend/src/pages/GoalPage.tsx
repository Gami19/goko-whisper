import { DividerLine } from "../components/DividerLine";
import { MemorialSilhouette } from "../components/MemorialSilhouette";
import { PageLayout } from "../components/PageLayout";
import { useApp } from "../context/AppContext";

export function GoalPage() {
  const { nickname } = useApp();
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
      <p className="text-hint goal-hint-enter">準備中</p>
    </PageLayout>
  );
}
