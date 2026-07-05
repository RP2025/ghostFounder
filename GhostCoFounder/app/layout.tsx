import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
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
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
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
