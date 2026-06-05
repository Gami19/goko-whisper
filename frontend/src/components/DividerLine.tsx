type DividerLineProps = {
  variant?: "solid" | "dashed" | "primary";
};

export function DividerLine({ variant = "solid" }: DividerLineProps) {
  const className = [
    "divider-line",
    variant === "dashed" ? "divider-line--dashed" : "",
    variant === "primary" ? "divider-line--primary" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <hr className={className} />;
}
