import { DividerLine } from "../components/DividerLine";
import { PageLayout } from "../components/PageLayout";

export function FoodPage() {
  return (
    <PageLayout variant="top">
      <h1 className="title-serif title-sm">模擬店の味</h1>
      <DividerLine />
      <p className="text-paper">
        紫熊祭の模擬店で味わえる
        <br />
        料理の紹介を掲載予定です。
      </p>
      <DividerLine variant="dashed" />
      <p className="text-hint">画像は準備中です</p>
    </PageLayout>
  );
}
