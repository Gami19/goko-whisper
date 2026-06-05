type DividerLineProps = {
  variant?: "solid" | "dashed";
};

export function DividerLine({ variant = "solid" }: DividerLineProps) {
  return (
    <hr
      className={`divider-line${variant === "dashed" ? " divider-line--dashed" : ""}`}
    />
  );
}
