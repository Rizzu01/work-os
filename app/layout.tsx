import "./globals.css";
import AuthGate from "../components/auth-gate";

export const metadata = { title: "Work OS", description: "Connected work management" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AuthGate>{children}</AuthGate></body></html>;
}
