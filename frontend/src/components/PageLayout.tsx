import type { ReactNode } from "react";

type PageLayoutProps = {
  variant?: "top" | "stamp" | "goal";
  children: ReactNode;
};

export function PageLayout({ variant = "top", children }: PageLayoutProps) {
  return (
    <main className={`page-layout page-layout--${variant}`}>{children}</main>
  );
}
