import { useState } from "react";
import { DividerLine } from "../components/DividerLine";
import { PageLayout } from "../components/PageLayout";
import { TextButton } from "../components/TextButton";
import { useApp } from "../context/AppContext";

export function TopPage() {
  const { nickname, setNickname, goToStamp1 } = useApp();
  const [input, setInput] = useState(nickname);

  return (
    <PageLayout variant="top">
      <h1 className="title-serif title-sm">五高の囁き</h1>
      <DividerLine />
      <p className="text-paper">
        あなたは、五高の声を
        <br />
        聞いたことがありますか。
      </p>
      <DividerLine />
      <input
        type="text"
        className="nickname-input"
        placeholder="お名前を入れてください"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setNickname(e.target.value);
        }}
        maxLength={20}
        aria-label="お名前"
      />
      <TextButton
        label="旅を始める"
        disabled={!input.trim()}
        onClick={goToStamp1}
      />
    </PageLayout>
  );
}
