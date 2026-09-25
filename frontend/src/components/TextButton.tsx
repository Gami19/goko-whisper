import type { ButtonHTMLAttributes } from "react";

type TextButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: "sans" | "serif";
  vibrateMs?: number;
};

function vibrate(ms: number) {
  if ("vibrate" in navigator) {
    navigator.vibrate(ms);
  }
}

export function TextButton({
  label,
  variant = "sans",
  vibrateMs = 10,
  onClick,
  disabled,
  ...rest
}: TextButtonProps) {
  const className = [
    "text-button",
    variant === "serif" ? "text-button--serif" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      onClick={(e) => {
        if (!disabled) vibrate(vibrateMs);
        onClick?.(e);
      }}
      {...rest}
    >
      ▷ {label}
    </button>
  );
}
