"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/contexts/user-context";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import NotificationDropdown from "@/components/ui/notification-dropdown";
import { useState } from "react";
import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Zap, Lock, Unlock } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { UserMenu } from "@/components/user-menu";
import { getAssetUrl } from "@/lib/url-utils";
import Image from "next/image";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarLocked, setSidebarLocked] = useState(false);
  const pathname = usePathname();
  const isNotificationsPage = pathname === "/notifications";
  const isLandingPage = pathname === "/";

  const sidebarLinks = [
    {
      label: "Panel de energía",
      href: "/dashboard",
      icon: (
        <div className="relative group/icon flex items-center justify-center">
          <Image
            src={getAssetUrl("/Iconos/sidebar/dashboard.png")}
            alt="Dashboard"
            width={36}
            height={36}
            className={cn(
              "object-contain relative z-10 transition-transform duration-300",
              (sidebarOpen || sidebarLocked) ? "h-7 w-7" : "h-9 w-9"
            )}
          />
        </div>
      ),
    },
    {
      label: "Mi tarifa",
      href: "/tarifas",
      icon: (
        <div className="relative group/icon flex items-center justify-center">
          <Image
            src={getAssetUrl("/Iconos/sidebar/tarifas.png")}
            alt="Tarifas"
            width={36}
            height={36}
            className={cn(
              "object-contain relative z-10 transition-transform duration-300",
              (sidebarOpen || sidebarLocked) ? "h-7 w-7" : "h-9 w-9"
            )}
          />
        </div>
      ),
    },
    {
      label: "Mi informe de energía",
      href: "/eco-feedback",
      icon: (
        <div className="relative group/icon flex items-center justify-center">
          <Image
            src={getAssetUrl("/Iconos/sidebar/eco-feed.png")}
            alt="Eco Feedback"
            width={36}
            height={36}
            className={cn(
              "object-contain relative z-10 transition-transform duration-300",
              (sidebarOpen || sidebarLocked) ? "h-7 w-7" : "h-9 w-9"
            )}
          />
        </div>
      ),
    },
    {
      label: "Estado de Mi servicio",
      href: "/mapa-cortes",
      icon: (
        <div className="relative group/icon flex items-center justify-center">
          <Image
            src={getAssetUrl("/Iconos/sidebar/map.png")}
            alt="Mapa"
            width={36}
            height={36}
            className={cn(
              "object-contain relative z-10 transition-transform duration-300",
              (sidebarOpen || sidebarLocked) ? "h-7 w-7" : "h-9 w-9"
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <ThemeProvider defaultTheme={isLandingPage ? "celsia" : "light"}>
      <UserProvider>
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
                  <UserMenu mobile={true} />
                  <NotificationDropdown open={false} animate={false} />
                  <Menu
                    className="text-gray-600 cursor-pointer hover:bg-orange-50 rounded-full p-2 h-10 w-10 flex items-center justify-center transition-colors celsia:text-orange-700 celsia:hover:bg-orange-100"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  />
                </div>
              </div>

              <AnimatePresence>
                {(sidebarOpen || sidebarLocked) && (
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
                      <X className="h-5 w-5" onClick={() => !sidebarLocked && setSidebarOpen(false)} />
                    </div>
                    <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto py-4">
                        <div className="flex flex-col gap-1 px-4">
                          {sidebarLinks.map((link, idx) => (
                            <SidebarLink
                              key={idx}
                              link={link}
                              open={sidebarOpen || sidebarLocked}
                              animate={true}
                              forceShowText={true}
                              onClick={() => !sidebarLocked && setSidebarOpen(false)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto mb-4 px-2">
                      <div className="border-t border-border pt-4 flex flex-col gap-2">
                        <ThemeSwitcher open={sidebarOpen} />
                        <button
                          onClick={() => setSidebarLocked(!sidebarLocked)}
                          className="text-foreground cursor-pointer hover:bg-orange-100 rounded-lg p-2 transition-colors celsia:hover:bg-orange-200 flex items-center gap-2 w-full"
                          title={sidebarLocked ? "Desbloquear sidebar" : "Bloquear sidebar"}
                        >
                          {sidebarLocked ? (
                            <>
                              <Lock className="h-4 w-4 text-orange-600" />
                              <span className="text-sm">Bloqueado</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="h-4 w-4" />
                              <span className="text-sm">Bloquear</span>
                            </>
                          )}
                        </button>
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
              <Sidebar 
                open={sidebarOpen} 
                setOpen={sidebarLocked ? undefined : setSidebarOpen}
              >
                <SidebarBody 
                  open={sidebarOpen} 
                  setOpen={sidebarLocked ? undefined : setSidebarOpen} 
                  animate={true} 
                  className="justify-between gap-10 bg-white/80 backdrop-blur-sm border-r border-orange-100 relative"
                >
                  {/* Logo Section */}
                  <div className="mb-8">
                    <Link href="/" className={cn(
                      "flex items-center group",
                      (sidebarOpen || sidebarLocked) ? "gap-2" : "justify-center"
                    )}>
                      <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow-md flex-shrink-0 group-hover:shadow-lg transition-all">
                        <Zap className={cn("text-white", (sidebarOpen || sidebarLocked) ? "h-5 w-5" : "h-6 w-6")} fill="currentColor" />
                      </div>
                      {(sidebarOpen || sidebarLocked) && (
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
                          open={sidebarOpen || sidebarLocked}
                          animate={true}
                          onClick={() => !sidebarLocked && setSidebarOpen(false)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Bottom Section with User */}
                  <div className={cn(
                    "mt-auto flex flex-col gap-2 px-1 py-2 w-full",
                    (sidebarOpen || sidebarLocked) ? "items-start" : "items-center"
                  )}>
                    <div className="w-full px-2 py-1 flex flex-col gap-2">
                      <ThemeSwitcher open={sidebarOpen || sidebarLocked} />
                      
                      {/* Lock Button with 3 States */}
                      <button
                        onClick={(e) => {
                          // Prevent sidebar expansion when clicking lock button in collapsed state
                          if (!sidebarOpen && !sidebarLocked) {
                            e.stopPropagation();
                            e.preventDefault();
                          }
                          
                          if (sidebarLocked) {
                            // Estado 2: Desbloquear barra
                            setSidebarLocked(false);
                          } else if (sidebarOpen) {
                            // Estado 1: Bloquear barra (cuando está expandida)
                            setSidebarLocked(true);
                          } else {
                            // Estado 3: Comprimir y bloquear (cuando está comprimida)
                            setSidebarLocked(true);
                            setSidebarOpen(false);
                          }
                        }}
                        onMouseEnter={(e) => {
                          // Prevent sidebar expansion when hovering lock button in collapsed state
                          if (!sidebarOpen && !sidebarLocked) {
                            e.stopPropagation();
                          }
                        }}
                        className={cn(
                          "text-muted-foreground hover:text-orange-600 cursor-pointer hover:bg-orange-100 rounded-full transition-colors celsia:hover:bg-orange-200 flex items-center justify-center gap-2",
                          sidebarOpen || sidebarLocked ? "h-9 w-full px-3" : "h-10 w-10"
                        )}
                        title={
                          sidebarLocked 
                            ? "Desbloquear barra" 
                            : sidebarOpen 
                            ? "Bloquear barra" 
                            : "Comprimir y bloquear"
                        }
                      >
                        {sidebarLocked ? (
                          <Lock className={cn(
                            "text-orange-600 transition-colors",
                            sidebarOpen || sidebarLocked ? "h-4 w-4" : "h-5 w-5"
                          )} />
                        ) : (
                          <Unlock className={cn(
                            "transition-colors",
                            sidebarOpen || sidebarLocked ? "h-4 w-4" : "h-5 w-5"
                          )} />
                        )}
                        {(sidebarOpen || sidebarLocked) && (
                          <span className="text-sm whitespace-nowrap">
                            {sidebarLocked 
                              ? "Desbloquear barra" 
                              : sidebarOpen 
                              ? "Bloquear barra" 
                              : "Comprimir y bloquear"}
                          </span>
                        )}
                      </button>
                    </div>
                    <div className="w-full">
                      <UserMenu sidebarOpen={sidebarOpen || sidebarLocked} />
                    </div>
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
      </UserProvider>
    </ThemeProvider>
  );
}

