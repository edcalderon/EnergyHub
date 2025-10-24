"use client";

import "./globals.css";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import NotificationDropdown from "@/components/ui/notification-dropdown";
import { useState } from "react";
import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Zap, LayoutDashboard, Leaf, DollarSign, MapPin } from "lucide-react";
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
        <title>EnergyHub by Celsia - Gestión Energética Inteligente</title>
        <meta name="description" content="Sistema global de monitoreo energético inteligente con insights en tiempo real y prácticas sostenibles. Piloto implementado en Valle del Cauca, Colombia." />
        <meta name="keywords" content="energía, sostenibilidad, monitoreo energético, Celsia, Valle del Cauca, gestión energética" />
        <meta name="author" content="Celsia" />
        <meta property="og:title" content="EnergyHub by Celsia - Gestión Energética Inteligente" />
        <meta property="og:description" content="Sistema global de monitoreo energético inteligente con insights en tiempo real y prácticas sostenibles." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="EnergyHub by Celsia" />
        <meta name="twitter:description" content="Gestión Energética Inteligente - Monitoreo en tiempo real" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Mobile Header - Hide on landing page */}
            {!isLandingPage && (
              <div className="md:hidden">
                <div className="sticky top-0 h-16 px-4 py-3 flex flex-row items-center justify-between bg-background border-b border-border w-full shadow-sm z-50">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-foreground font-semibold text-sm">EnergyHub</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThemeSwitcher open={false} />
                  <Link href="/profile" className="p-2 rounded-full hover:bg-accent transition-colors">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-xs">
                      U
                    </div>
                  </Link>
                  <NotificationDropdown open={false} animate={false} />
                  <Menu
                    className="text-foreground cursor-pointer hover:bg-accent rounded-full p-2 h-10 w-10 flex items-center justify-center transition-colors"
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
                    className="fixed h-full w-full inset-0 bg-background p-6 pt-24 pb-8 z-40 flex flex-col"
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
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            )}

            {/* Desktop Sidebar - Hide on landing page */}
            {!isLandingPage && (
            <div className="hidden md:block">
              <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
                <SidebarBody open={sidebarOpen} setOpen={setSidebarOpen} animate={true} className="justify-between gap-10">
                  {/* Logo Section */}
                  <div className="mb-8">
                    <Link href="/" className={cn(
                      "flex items-center",
                      sidebarOpen ? "gap-2" : "justify-center"
                    )}>
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0">
                        <Zap className={cn("text-white", sidebarOpen ? "h-5 w-5" : "h-6 w-6")} />
                      </div>
                      {sidebarOpen && (
                        <div className="flex flex-col">
                          <h2 className="text-lg font-semibold text-foreground">EnergyHub</h2>
                          <p className="text-sm text-muted-foreground">Gestión Energética</p>
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
                    "mt-auto flex flex-col gap-2 px-1 py-2",
                    sidebarOpen ? "items-start" : "items-center"
                  )}>
                    <div className={cn(
                      "flex items-center",
                      sidebarOpen ? "justify-start" : "justify-center"
                    )}>
                      <ThemeSwitcher />
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
              {/* Desktop Floating Notification - Hidden on mobile and landing page */}
              {!isNotificationsPage && !isLandingPage && (
                <div className={cn(
                  "absolute z-50 transition-all duration-300 hidden md:block",
                  sidebarOpen ? "top-4 right-4" : "top-4 right-4"
                )}>
                  <NotificationDropdown open={false} animate={false} />
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
