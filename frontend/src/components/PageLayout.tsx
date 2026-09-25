import type { ReactNode } from "react";

type PageVariant = "top" | "stamp1" | "stamp2" | "goal";

type PageLayoutProps = {
  variant?: PageVariant;
  children: ReactNode;
};

export function PageLayout({ variant = "top", children }: PageLayoutProps) {
  return (
    <main className={`page-layout page-layout--${variant}`}>{children}</main>
  );
}

export type { PageVariant };
