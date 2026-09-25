type WhisperRevealProps = {
  text: string;
  tone?: "primary" | "glow";
};

export function WhisperReveal({ text, tone = "primary" }: WhisperRevealProps) {
  const className = [
    "whisper-text",
    "whisper-reveal",
    tone === "glow" ? "whisper-reveal--glow" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="whisper-container">
      <p className={className}>{text}</p>
    </div>
  );
}
