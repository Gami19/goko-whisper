import { useEffect, useState } from "react";
import { issueToken, verifyToken } from "../api";
import { CodeDisplay } from "../components/CodeDisplay";
import { CountdownTimer } from "../components/CountdownTimer";
import { DividerLine } from "../components/DividerLine";
import { MemorialSilhouette } from "../components/MemorialSilhouette";
import { PageLayout } from "../components/PageLayout";
import { TextButton } from "../components/TextButton";
import { useApp } from "../context/AppContext";

const DISPLAY_MS = 5 * 60 * 1000;

export function GoalPage() {
  const {
    nickname,
    clientId,
    rewardCode,
    issuedAt,
    saveIssued,
    markRedeemed,
    markSoldOut,
  } = useApp();
  const [issuing, setIssuing] = useState(!rewardCode);
  const [issueError, setIssueError] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [pin, setPin] = useState("");
  const [slider, setSlider] = useState(0);
  const [verifyMessage, setVerifyMessage] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!rewardCode) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [rewardCode]);

  useEffect(() => {
    if (rewardCode) return;
    let cancelled = false;

    void (async () => {
      const result = await issueToken(nickname, clientId);
      if (cancelled) return;
      setIssuing(false);
      if (result.result === "issued") {
        saveIssued(result.code, result.issuedAt);
        return;
      }
      if (result.result === "sold_out") {
        markSoldOut();
        return;
      }
      setIssueError(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [rewardCode, nickname, clientId, saveIssued, markSoldOut]);

  const displayName = nickname.trim() || "旅人";
  const expired =
    issuedAt !== undefined && now >= issuedAt + DISPLAY_MS;
  const showCode = Boolean(rewardCode) && (!expired || revealed);

  const retryIssue = () => {
    setIssueError(false);
    setIssuing(true);
    void (async () => {
      const result = await issueToken(nickname, clientId);
      setIssuing(false);
      if (result.result === "issued") {
        saveIssued(result.code, result.issuedAt);
        return;
      }
      if (result.result === "sold_out") {
        markSoldOut();
        return;
      }
      setIssueError(true);
    })();
  };

  const finishSlide = async (position: number) => {
    if (!rewardCode || pin.length !== 4 || verifying) return;
    if (position < 85) {
      setSlider(0);
      return;
    }

    setVerifying(true);
    setVerifyMessage("");
    const result = await verifyToken(rewardCode, pin);
    setVerifying(false);

    if (result.result === "redeemed" || result.result === "already_redeemed") {
      markRedeemed();
      return;
    }
    setSlider(0);
    if (result.result === "invalid_pin") {
      setVerifyMessage("暗証番号が違います");
      return;
    }
    if (result.result === "unknown_code") {
      setVerifyMessage("このコードは見つかりません");
      return;
    }
    setVerifyMessage("通信が必要です");
  };

  return (
    <PageLayout variant="goal">
      <div className="retro-card">
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

      {issuing && <p className="text-hint">発行しています</p>}
      {issueError && (
        <>
          <p className="text-hint">通信が必要です</p>
          <TextButton label="再試行" variant="serif" onClick={retryIssue} />
        </>
      )}

      {showCode && rewardCode && (
        <>
          <CodeDisplay code={rewardCode} />
          {issuedAt !== undefined && !expired && (
            <CountdownTimer expiresAt={issuedAt + DISPLAY_MS} />
          )}
          <p className="text-hint">スタッフに提示してください</p>
          <label className="text-input-label" htmlFor="staff-pin">
            スタッフ暗証番号
          </label>
          <input
            id="staff-pin"
            className="nickname-input"
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
            value={pin}
            onChange={(event) =>
              setPin(event.target.value.replace(/\D/g, "").slice(0, 4))
            }
          />
          <label className="text-hint" htmlFor="redeem-slider">
            横に滑らせて受取完了とする
          </label>
          <div className="brass-lever">
          <input
            id="redeem-slider"
            className="brass-lever__input"
            type="range"
            min={0}
            max={100}
            value={slider}
            disabled={pin.length !== 4 || verifying}
            onChange={(event) => setSlider(Number(event.target.value))}
            onPointerUp={(event) => {
              void finishSlide(Number(event.currentTarget.value));
            }}
            onKeyUp={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              void finishSlide(Number(event.currentTarget.value));
            }}
          />
          </div>
          {verifyMessage && <p className="text-hint">{verifyMessage}</p>}
        </>
      )}

      {rewardCode && expired && !revealed && (
        <TextButton
          label="コードを再表示"
          variant="serif"
          onClick={() => setRevealed(true)}
        />
      )}
      </div>
    </PageLayout>
  );
}
