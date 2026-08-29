import "./globals.css";

export const metadata = { title: "Work OS", description: "Connected work management" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
