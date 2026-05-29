import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CurtainFooter } from "@/components/sections/CurtainFooter";
import { GlobalNav } from "@/components/layout/GlobalNav";

export const metadata: Metadata = {
  title: "Daniil Kharkovskiy — Creative Developer & Art Director",
  description:
    "Digital identity of Daniil Kharkovskiy. Creative developer, art director, and designer building premium digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SmoothScroll>
            <GlobalNav />
            <div style={{ position: "relative" }}>
              <CurtainFooter />
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  background: "var(--c-bg)",
                  minHeight: "100dvh",
                  borderBottomLeftRadius: "32px",
                  borderBottomRightRadius: "32px",
                  overflow: "clip",
                }}
              >
                {children}
              </div>
              <div style={{ height: "75dvh" }} />
            </div>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
