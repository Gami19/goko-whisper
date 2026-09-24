import { DividerLine } from "../components/DividerLine";
import { PageLayout } from "../components/PageLayout";

export function PresentPage() {
  return (
    <PageLayout variant="top">
      <h1 className="title-serif title-sm">参加特典</h1>
      <DividerLine />
      <p className="text-paper">
        ゴール達成者向けの
        <br />
        限定特典を紹介予定です。
      </p>
      <DividerLine variant="dashed" />
      <p className="text-hint">画像は準備中です</p>
    </PageLayout>
  );
}
