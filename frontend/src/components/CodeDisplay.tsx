import { useEffect, useState } from "react";

type CodeDisplayProps = {
  code: string;
  delay?: number;
};

export function CodeDisplay({ code, delay = 3000 }: CodeDisplayProps) {
  const [display, setDisplay] = useState("0000");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    const digits = code.split("");
    let index = 0;

    const interval = setInterval(() => {
      if (index >= digits.length) {
        clearInterval(interval);
        return;
      }
      setDisplay((prev) => {
        const arr = prev.split("");
        arr[index] = digits[index];
        return arr.join("");
      });
      index++;
    }, 300);

    return () => clearInterval(interval);
  }, [started, code]);

  return (
    <div className={`code-box${started ? " goal-code-enter" : ""}`}>
      <p className="code-display">{display}</p>
    </div>
  );
}
