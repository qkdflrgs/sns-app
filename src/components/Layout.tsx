import { ReactNode } from "react";
import Menu from "./Menu";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      {children}
      <Menu />
    </div>
  );
}
