import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Sora — a premium geometric display face used across modern AI products.
const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GhostCoFounder — The co-founder that never sleeps",
  description:
    "Turn your idea into an investor-ready startup plan with your AI co-founder. Build your startup in 10 minutes.",
};

// Runs before first paint to set the theme class — prevents any flash of the
// wrong theme. Defaults to the light surface, honoring a saved preference.
const themeInitScript = `
(function () {
  try {
    var t = localStorage.getItem('gcf-theme');
    if (t !== 'dark' && t !== 'light') t = 'light';
    document.documentElement.classList.add(t);
    document.documentElement.style.colorScheme = t;
  } catch (e) {
    document.documentElement.classList.add('light');
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-body bg-void text-ink antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
