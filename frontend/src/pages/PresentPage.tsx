import { DividerLine } from "../components/DividerLine";
import { PageLayout } from "../components/PageLayout";
import { TextButton } from "../components/TextButton";
import { useApp } from "../context/AppContext";

export function PresentPage() {
  const { stamp1Done, stamp2Done, setActiveTab, openPin } = useApp();
  const both = stamp1Done && stamp2Done;

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
      {both && (
        <TextButton
          label="五高記念館へ"
          variant="serif"
          onClick={() => {
            openPin("goko");
            setActiveTab("home");
          }}
        />
      )}
    </PageLayout>
  );
}
