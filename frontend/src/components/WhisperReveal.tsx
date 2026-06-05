type WhisperRevealProps = {
  text: string;
};

export function WhisperReveal({ text }: WhisperRevealProps) {
  return <p className="whisper-text whisper-reveal">{text}</p>;
}
