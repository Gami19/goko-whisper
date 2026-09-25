import { useState } from "react";
import { DividerLine } from "../components/DividerLine";
import { PageLayout } from "../components/PageLayout";
import { TextButton } from "../components/TextButton";
import { useApp } from "../context/AppContext";

type TopPageProps = {
  mode: "top" | "askName";
};

export function TopPage({ mode }: TopPageProps) {
  const { nickname, nicknameLocked, saveNickname } = useApp();
  const [input, setInput] = useState(nickname);
  const trimmed = input.trim();

  return (
    <PageLayout variant="top">
      <h1 className="title-serif title-sm">五高の囁き</h1>
      <DividerLine />
      {mode === "askName" ? (
        <p className="text-paper">
          二つの声が揃った。
          <br />
          名を残してから、記念館へ。
        </p>
      ) : (
        <p className="text-paper">
          耳を澄ませ。
          <br />
          <br />
          百年の声が、まだここに
          <br />
          漂っている。
          <br />
          <br />
          チラシ、または模擬店の QR を読むと、
          <br />
          囁きが残ります。
        </p>
      )}
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
          onChange={(e) => setInput(e.target.value)}
          maxLength={20}
          autoComplete="nickname"
          disabled={nicknameLocked}
        />
      </div>
      {!nicknameLocked && (
        <TextButton
          label="名前を残す"
          variant="serif"
          disabled={!trimmed || trimmed.length > 20}
          onClick={() => saveNickname(input)}
        />
      )}
    </PageLayout>
  );
}
