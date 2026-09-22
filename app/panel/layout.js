import AuthGuard from "./AuthGuard";

export default function PanelLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
