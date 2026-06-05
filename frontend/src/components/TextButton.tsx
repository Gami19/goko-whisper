import type { ButtonHTMLAttributes } from "react";

type TextButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

function vibrate() {
  if ("vibrate" in navigator) {
    navigator.vibrate(10);
  }
}

export function TextButton({
  label,
  onClick,
  disabled,
  ...rest
}: TextButtonProps) {
  return (
    <button
      type="button"
      className="text-button"
      disabled={disabled}
      onClick={(e) => {
        if (!disabled) vibrate();
        onClick?.(e);
      }}
      {...rest}
    >
      ▷ {label}
    </button>
  );
}
