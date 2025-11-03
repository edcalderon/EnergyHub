import "./globals.css";
import { Inter } from "next/font/google";
import { AppWrapper } from "@/components/app-wrapper";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Centro de Energía Celsia - Gestión Energética Inteligente</title>
        <meta name="description" content="El Centro de Energía Celsia es una plataforma de monitoreo y análisis que permite detectar patrones de consumo, recibir alertas y tomar decisiones sostenibles para mejorar la eficiencia y reducir costos." />
        <meta name="keywords" content="energía, sostenibilidad, monitoreo energético, Celsia, Valle del Cauca, gestión energética" />
        <meta name="author" content="Celsia" />
        <meta property="og:title" content="Centro de Energía Celsia - Gestión Energética Inteligente" />
        <meta property="og:description" content="Plataforma digital de monitoreo y análisis para eficiencia energética y ahorro." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Centro de Energía Celsia" />
        <meta name="twitter:description" content="Gestión Energética Inteligente - Monitoreo en tiempo real" />
        {/* Preload critical earth image for globe component - optimize loading */}
        <link rel="preload" as="image" href="/images/earth-image.png" fetchPriority="high" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (typeof window !== 'undefined') {
                    const isLandingPage = window.location.pathname === '/';
                    const defaultTheme = 'light'; // Light mode is now default
                    const storedTheme = localStorage.getItem('energyhub-theme');
                    const theme = storedTheme || defaultTheme;
                    document.documentElement.classList.remove('dark', 'light', 'celsia');
                    document.documentElement.classList.add(theme);
                    if (theme === 'celsia') {
                      document.documentElement.setAttribute('data-theme', 'celsia');
                    } else {
                      document.documentElement.removeAttribute('data-theme');
                    }
                  }
                } catch (e) {
                  console.error('Theme initialization error:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={cn(inter.className, "min-h-screen bg-background")}>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
