import AuthGuard from "./AuthGuard";
import PanelShell from "./PanelShell";
export default function PanelLayout({ children }) {
  return <AuthGuard><PanelShell>{children}</PanelShell></AuthGuard>;
}
