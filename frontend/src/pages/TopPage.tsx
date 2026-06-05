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
      <div className="nickname-field">
        <label className="text-input-label" htmlFor="nickname">
          あなたの名は
        </label>
        <input
          id="nickname"
          type="text"
          className="nickname-input"
          placeholder="お名前を入力"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setNickname(e.target.value);
          }}
          maxLength={20}
          autoComplete="nickname"
        />
      </div>
      <TextButton
        label="声を聞きに行く"
        variant="serif"
        disabled={!input.trim()}
        onClick={goToStamp1}
      />
    </PageLayout>
  );
}
