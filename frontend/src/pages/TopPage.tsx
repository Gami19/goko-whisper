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
        耳を澄ませ。
        <br />
        <br />
        百年の声が、まだここに
        <br />
        漂っている。
      </p>
      <DividerLine />
      <p className="text-input-label">あなたの名は</p>
      <input
        type="text"
        className="nickname-input"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setNickname(e.target.value);
        }}
        maxLength={20}
        aria-label="あなたの名"
      />
      <TextButton
        label="声を聞きに行く"
        variant="serif"
        disabled={!input.trim()}
        onClick={goToStamp1}
      />
    </PageLayout>
  );
}
