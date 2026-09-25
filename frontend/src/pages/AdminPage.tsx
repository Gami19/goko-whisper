import { useState } from "react";
import { fetchSummary, type Summary } from "../api";
import { PageLayout } from "../components/PageLayout";
import { TextButton } from "../components/TextButton";

const TOKEN_KEY = "goko-admin-token";

export function AdminPage() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem(TOKEN_KEY) ?? "",
  );
  const [summary, setSummary] = useState<Summary | null>(null);
  const [message, setMessage] = useState("");

  const load = async () => {
    sessionStorage.setItem(TOKEN_KEY, token);
    setMessage("");
    const result = await fetchSummary(token);
    if (!result.ok) {
      setSummary(null);
      setMessage(
        result.unauthorized ? "認証に失敗しました" : "通信が必要です",
      );
      return;
    }
    setSummary(result.summary);
  };

  return (
    <PageLayout variant="top">
      <h1 className="title-serif title-sm">残数</h1>
      <label className="text-input-label" htmlFor="admin-token">
        管理トークン
      </label>
      <input
        id="admin-token"
        className="nickname-input"
        type="password"
        autoComplete="off"
        value={token}
        onChange={(event) => setToken(event.target.value)}
      />
      <TextButton label="残数を見る" variant="serif" onClick={() => void load()} />
      {message && <p className="text-hint">{message}</p>}
      {summary && (
        <p className="text-paper">
          発行 {summary.issued}
          <br />
          消込 {summary.redeemed}
          <br />
          残数 {summary.remaining}
          <br />
          上限 {summary.limit}
        </p>
      )}
    </PageLayout>
  );
}
