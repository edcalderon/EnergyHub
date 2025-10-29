"use client";

import "./globals.css";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import NotificationDropdown from "@/components/ui/notification-dropdown";
import { useState } from "react";
import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Zap, LayoutDashboard, Leaf, DollarSign, MapPin } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isNotificationsPage = pathname === "/notifications";
  const isLandingPage = pathname === "/";

  const sidebarLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className={cn("text-foreground", sidebarOpen ? "h-5 w-5" : "h-7 w-7")} />,
    },
    {
      label: "Tarifas",
      href: "/tarifas",
      icon: <DollarSign className={cn("text-foreground", sidebarOpen ? "h-5 w-5" : "h-7 w-7")} />,
    },
    {
      label: "Eco-Feedback",
      href: "/eco-feedback",
      icon: <Leaf className={cn("text-foreground", sidebarOpen ? "h-5 w-5" : "h-7 w-7")} />,
    },
    {
      label: "Mapa de Cortes",
      href: "/mapa-cortes",
      icon: <MapPin className={cn("text-foreground", sidebarOpen ? "h-5 w-5" : "h-7 w-7")} />,
    },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Centro de Energía Celsia - Gestión Energética Inteligente</title>
        <meta name="description" content="El Centro de Energía Celsia es una plataforma de monitoreo y análisis que permite conocer tu consumo, recibir alertas y tomar decisiones sostenibles para mejorar la eficiencia y reducir costos." />
        <meta name="keywords" content="energía, sostenibilidad, monitoreo energético, Celsia, Valle del Cauca, gestión energética" />
        <meta name="author" content="Celsia" />
        <meta property="og:title" content="Centro de Energía Celsia - Gestión Energética Inteligente" />
        <meta property="og:description" content="Plataforma digital de monitoreo y análisis para eficiencia energética y ahorro." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Centro de Energía Celsia" />
        <meta name="twitter:description" content="Gestión Energética Inteligente - Monitoreo en tiempo real" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    localStorage.setItem('theme', 'light');
                  }
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={cn(inter.className, "min-h-screen bg-background")}>
        <ThemeProvider defaultTheme="light">
          <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Mobile Header - Hide on landing page */}
            {!isLandingPage && (
              <div className="md:hidden">
                <div className="sticky top-0 h-16 px-4 py-3 flex flex-row items-center justify-between bg-white/90 backdrop-blur-sm border-b border-orange-100 w-full shadow-sm z-50 celsia:bg-white/90 celsia:border-orange-200">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow-md hover:from-orange-600 hover:to-amber-600 transition-colors">
                    <Zap className="h-4 w-4 text-white" fill="currentColor" />
                  </div>
                  <span className="text-gray-900 font-semibold text-sm celsia:text-orange-900 hover:text-orange-700 transition-colors">Centro de Energía Celsia</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThemeSwitcher />
                  <Link href="/profile" className="p-2 rounded-full hover:bg-orange-50 transition-colors group">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-medium text-xs shadow-sm group-hover:from-orange-600 group-hover:to-amber-600 transition-colors">
                      U
                    </div>
                  </Link>
                  <NotificationDropdown open={false} animate={false} />
                  <Menu
                    className="text-gray-600 cursor-pointer hover:bg-orange-50 rounded-full p-2 h-10 w-10 flex items-center justify-center transition-colors celsia:text-orange-700 celsia:hover:bg-orange-100"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  />
                </div>
              </div>

              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ x: "-100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "-100%", opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                    className="fixed h-full w-full inset-0 bg-white p-6 pt-24 pb-8 z-40 flex flex-col celsia:bg-gradient-to-br celsia:from-orange-50 celsia:via-amber-50 celsia:to-white"
                  >
                    <div className="absolute right-4 top-6 z-[60] text-foreground cursor-pointer hover:bg-accent rounded-full p-2 transition-colors">
                      <X className="h-5 w-5" onClick={() => setSidebarOpen(false)} />
                    </div>
                    <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto py-4">
                        <div className="flex flex-col gap-1 px-4">
                          {sidebarLinks.map((link, idx) => (
                            <SidebarLink
                              key={idx}
                              link={link}
                              open={sidebarOpen}
                              animate={true}
                              forceShowText={true}
                              onClick={() => setSidebarOpen(false)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto mb-4 px-2">
                      <div className="border-t border-border pt-4">
                        <ThemeSwitcher open={sidebarOpen} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            )}

            {/* Desktop Sidebar - Hide on landing page */}
            {!isLandingPage && (
            <div className="hidden md:block">
              <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
                <SidebarBody open={sidebarOpen} setOpen={setSidebarOpen} animate={true} className="justify-between gap-10 bg-white/80 backdrop-blur-sm border-r border-orange-100">
                  {/* Logo Section */}
                  <div className="mb-8">
                    <Link href="/" className={cn(
                      "flex items-center group",
                      sidebarOpen ? "gap-2" : "justify-center"
                    )}>
                      <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow-md flex-shrink-0 group-hover:shadow-lg transition-all">
                        <Zap className={cn("text-white", sidebarOpen ? "h-5 w-5" : "h-6 w-6")} fill="currentColor" />
                      </div>
                      {sidebarOpen && (
                        <div className="flex flex-col">
                          <h2 className="text-lg font-semibold text-foreground">Centro de Energía Celsia</h2>
                          <p className="text-sm text-muted-foreground">Gestión Energética Inteligente</p>
                        </div>
                      )}
                    </Link>
                  </div>

                  <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="flex flex-col gap-1">
                      {sidebarLinks.map((link, idx) => (
                        <SidebarLink
                          key={idx}
                          link={link}
                          open={sidebarOpen}
                          animate={true}
                          onClick={() => setSidebarOpen(false)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Bottom Section with User */}
                  <div className={cn(
                    "mt-auto flex flex-col gap-2 px-1 py-2 w-full",
                    sidebarOpen ? "items-start" : "items-center"
                    )}>
                    <div className="w-full px-2 py-1">
                      <ThemeSwitcher open={sidebarOpen} />
                    </div>
                    <SidebarLink
                      link={{
                        label: "Usuario",
                        href: "/profile",
                        icon: (
                          <div className={cn(
                            "rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium flex-shrink-0",
                            sidebarOpen ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"
                          )}>
                            U
                          </div>
                        ),
                      }}
                      open={sidebarOpen}
                      animate={true}
                      onClick={() => setSidebarOpen(false)}
                    />
                  </div>
                </SidebarBody>
              </Sidebar>
            </div>
            )}

            {/* Main Content */}
            <div className={cn(
              "flex-1 w-full min-h-screen bg-background relative z-20",
              isLandingPage ? "pt-0" : "pt-16 md:pt-0 md:overflow-y-auto md:h-screen"
            )}>
              {/* Desktop Floating Notification - Hidden on mobile, landing page, and notifications page */}
              {!pathname.includes("/notifications") && pathname !== "/" && (
                <div className={cn(
                  "fixed z-50 transition-all duration-300 hidden md:block",
                  sidebarOpen ? "top-4 right-4" : "top-4 right-4"
                )}>
                  <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg shadow-lg p-1">
                    <NotificationDropdown open={false} animate={false} />
                  </div>
                </div>
              )}
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
