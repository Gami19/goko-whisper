import { PageLayout } from "../components/PageLayout";

export function SoldOutPage() {
  return (
    <PageLayout variant="goal">
      <div className="retro-card">
        <p className="text-paper">本日の配布は終了しました</p>
      </div>
    </PageLayout>
  );
}
