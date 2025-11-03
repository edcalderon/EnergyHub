import React, { useEffect, useRef, useState, useCallback, useMemo } from "react"; 
import Globe from "@/components/ui/globe";
import { cn } from "@/lib/utils";
import { getCelsiaLogoUrl, getInternalUrl, createImageWithFallback, debugUrls } from "@/lib/url-utils";
import Link from "next/link";
import { 
  Zap, 
  Leaf, 
  DollarSign, 
  MapPin, 
  BarChart3, 
  Smartphone,
  Shield,
  CheckCircle,
  ChevronDown
} from "lucide-react";
import { StartJourneyForm } from "@/components/ui/start-journey-form";
import { useUser } from "@/contexts/user-context";
import { useRouter } from "next/navigation";

// Reusable ScrollGlobe component following shadcn/ui patterns
interface ScrollGlobeProps {
  sections: {
    id: string;
    badge?: string;
    title: string;
    subtitle?: string;
    description: string;
    align?: 'left' | 'center' | 'right';
    features?: { title: string; description: string; icon?: React.ReactNode }[];
    actions?: { label: string; variant: 'primary' | 'secondary'; href?: string; onClick?: () => void }[];
  }[];
  globeConfig?: {
    positions: {
      top: string;
      left: string;
      scale: number;
    }[];
  };
  className?: string;
  onStartJourneyClick?: () => void;
}

const defaultGlobeConfig = {
  positions: [
    { top: "50%", left: "75%", scale: 1.4 },  // Hero: Right side, balanced
    { top: "25%", left: "50%", scale: 0.9 },  // Innovation: Top side, subtle
    { top: "15%", left: "90%", scale: 2 },  // Discovery: Left side, medium
    { top: "35%", left: "25%", scale: 1.2 },  // Leadership: Left side, medium
    { top: "50%", left: "50%", scale: 1.8 },  // Future: Center, large backdrop
  ]
};

// Parse percentage string to number
const parsePercent = (str: string): number => parseFloat(str.replace('%', ''));

function ScrollGlobe({ sections, globeConfig = defaultGlobeConfig, className, onStartJourneyClick }: ScrollGlobeProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [globeTransform, setGlobeTransform] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [globeContrastMode, setGlobeContrastMode] = useState<'light' | 'dark' | 'auto'>('auto');
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const heroTextRef = useRef<HTMLDivElement | null>(null);
  const globeContainerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number>();
  const overlapCheckFrameId = useRef<number>();
  
  // Pre-calculate positions for performance
  const calculatedPositions = useMemo(() => {
    return globeConfig.positions.map(pos => ({
      top: parsePercent(pos.top),
      left: parsePercent(pos.left),
      scale: pos.scale
    }));
  }, [globeConfig.positions]);

  // Check if hero text overlaps with globe (separate from scroll tracking)
  const checkTextGlobeOverlap = useCallback(() => {
    if (!heroTextRef.current || !globeContainerRef.current || activeSection !== 0) {
      if (activeSection !== 0) {
        setGlobeContrastMode('auto');
      }
      return;
    }

    const textRect = heroTextRef.current.getBoundingClientRect();
    const globeRect = globeContainerRef.current.getBoundingClientRect();

    const overlap = !(
      textRect.right < globeRect.left ||
      textRect.left > globeRect.right ||
      textRect.bottom < globeRect.top ||
      textRect.top > globeRect.bottom
    );

    if (overlap) {
      setGlobeContrastMode('light');
    } else {
      setGlobeContrastMode('auto');
    }
  }, [activeSection]);

  // Improved scroll tracking
  const updateScrollPosition = useCallback(() => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);
    
    setScrollProgress(progress);

    // Simple and reliable section detection
    const viewportCenter = window.innerHeight / 2;
    let newActiveSection = 0;
    let minDistance = Infinity;

    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          newActiveSection = index;
        }
      }
    });

    // Always update active section when it changes
    if (newActiveSection !== activeSection) {
      setActiveSection(newActiveSection);
      
      // Update globe position
      const currentPos = calculatedPositions[newActiveSection];
      const transform = `translate3d(${currentPos.left}vw, ${currentPos.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${currentPos.scale}, ${currentPos.scale}, 1)`;
      
      setGlobeTransform(transform);
    }
  }, [calculatedPositions, activeSection]);

  // Mount effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Simplified scroll handler
  useEffect(() => {
    if (!isMounted) return;
    
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        animationFrameId.current = requestAnimationFrame(() => {
          updateScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollPosition(); // Initial call
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [updateScrollPosition, isMounted]);

  // Separate effect for overlap checking (doesn't interfere with scroll)
  useEffect(() => {
    if (!isMounted) return;

    let lastCheck = 0;
    const throttleMs = 150; // Check every 150ms
    
    const checkOverlap = (timestamp: number) => {
      if (timestamp - lastCheck >= throttleMs) {
        checkTextGlobeOverlap();
        lastCheck = timestamp;
      }
      overlapCheckFrameId.current = requestAnimationFrame(checkOverlap);
    };
    
    overlapCheckFrameId.current = requestAnimationFrame(checkOverlap);
    
    return () => {
      if (overlapCheckFrameId.current) {
        cancelAnimationFrame(overlapCheckFrameId.current);
      }
    };
  }, [isMounted, checkTextGlobeOverlap]);

  // Initial globe position
  useEffect(() => {
    const initialPos = calculatedPositions[0];
    const initialTransform = `translate3d(${initialPos.left}vw, ${initialPos.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${initialPos.scale}, ${initialPos.scale}, 1)`;
    setGlobeTransform(initialTransform);
  }, [calculatedPositions]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full max-w-screen overflow-x-hidden min-h-screen bg-background text-foreground",
        className
      )}
    >
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-gradient-to-r from-border/20 via-border/40 to-border/20 z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary via-blue-600 to-blue-900 will-change-transform shadow-sm transition-transform duration-150 ease-out"
          style={{ 
            transform: `scaleX(${scrollProgress})`,
            transformOrigin: 'left center',
            filter: 'drop-shadow(0 0 2px rgba(59, 130, 246, 0.3))'
          }}
        />
      </div>

      {/* Desktop Theme Switcher removed to keep default light theme */}

      {/* Enhanced Navigation */}
      <div className="hidden sm:flex fixed right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40">
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="relative group">
              <div
                className={cn(
                  "nav-label absolute right-5 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2",
                  "px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap",
                  "bg-background/95 backdrop-blur-md border border-border/60 shadow-xl z-50 transition-all duration-300 text-foreground",
                  activeSection === index ? "opacity-100 animate-fadeIn" : "opacity-0"
                )}
              >
                <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2">
                  <div className="w-1 sm:w-1.5 lg:w-2 h-1 sm:h-1.5 lg:h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs sm:text-sm lg:text-base">
                    {section.badge || `Sección ${index + 1}`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  const targetSection = sectionRefs.current[index];
                  if (targetSection) {
                    targetSection.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'center'
                    });
                    
                    // Force update active section immediately
                    setActiveSection(index);
                    
                    // Update globe position immediately
                    const currentPos = calculatedPositions[index];
                    const transform = `translate3d(${currentPos.left}vw, ${currentPos.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${currentPos.scale}, ${currentPos.scale}, 1)`;
                    setGlobeTransform(transform);
                  }
                }}
                className={cn(
                  "relative w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full border-2 transition-all duration-300 hover:scale-125",
                  "before:absolute before:inset-0 before:rounded-full before:transition-all before:duration-300",
                  activeSection === index 
                    ? "bg-primary border-primary shadow-lg before:animate-ping before:bg-primary/20" 
                    : "bg-transparent border-muted-foreground/40 hover:border-primary/60 hover:bg-primary/10"
                )}
                aria-label={`Ir a ${section.badge || `sección ${index + 1}`}`}
              />
            </div>
          ))}
        </div>
        
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 lg:w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent -translate-x-1/2 -z-10" />
      </div>

      {/* Ultra-smooth Globe with responsive scaling */}
      <div
        ref={globeContainerRef}
        className="fixed z-10 will-change-transform transition-all duration-[1400ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          transform: globeTransform,
          filter: `opacity(${activeSection === 3 ? 0.4 : 0.9})`,
        }}
      >
        <div 
          className="scale-75 sm:scale-90 lg:scale-100"
          onClick={(e) => {
            // Permite clicks en el globo pero no bloquea el scroll si no es en elementos interactivos
            const target = e.target as HTMLElement;
            if (target.closest('[data-globe-interactive]')) {
              e.stopPropagation();
            }
          }}
        >
          <Globe contrastMode={globeContrastMode} />
        </div>
      </div>

      {/* Dynamic sections - fully responsive */}
      {sections.map((section, index) => (
        <section
          key={section.id}
          ref={(el) => { sectionRefs.current[index] = el; }}
          className={cn(
            "relative min-h-screen flex flex-col justify-center px-12 sm:px-16 md:px-24 lg:px-32 xl:px-40 z-20 py-12 sm:py-16 lg:py-20",
            "w-full max-w-full overflow-visible",
            section.align === 'center' && "items-center text-center",
            section.align === 'right' && "items-end text-right",
            section.align !== 'center' && section.align !== 'right' && "items-start text-left"
          )}
        >
          <div className={cn(
            "w-full will-change-transform transition-all duration-700",
            "opacity-100 translate-y-0 overflow-visible px-2",
            index === 0 ? "max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl" : "max-w-full"
          )}>
            
            <h1 className={cn(
              "font-bold mb-6 sm:mb-8 leading-[1.1] tracking-tight break-words overflow-visible whitespace-normal",
              index === 0 
                ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl" 
                : "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
            )}> 
              {section.subtitle ? (
                <div className="space-y-2 sm:space-y-2">
                  <div className={cn(
                    "flex items-center gap-3 sm:gap-4 flex-wrap",
                    index === 0 ? "flex items-center gap-3 sm:gap-4 flex-wrap" : "block"
                  )}>
                    {index === 0 && (
                      <div className="p-2 sm:p-3 md:p-4 lg:p-5 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #f4721e, #e55a00)' }}>
                        <Zap className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 text-white" />
                      </div>
                    )}
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-foreground dark:to-foreground/80 bg-clip-text text-transparent break-words min-w-0 flex-1 py-2">
                      {section.title}
                    </div>
                  </div>
                  <div className="text-slate-700 dark:text-muted-foreground/90 text-[0.6em] sm:text-[0.7em] font-medium tracking-wider">
                    {section.subtitle}
                  </div>
                </div>
              ) : (
                <div className={cn(
                  "flex items-center gap-3 sm:gap-4",
                  index === 0 ? "flex items-center gap-3 sm:gap-4" : "block"
                )}>
                  {index === 0 && (
                    <div className="p-2 sm:p-3 md:p-4 lg:p-5 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #f4721e, #e55a00)' }}>
                      <Zap className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 text-white" />
                    </div>
                  )}
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-foreground dark:via-foreground dark:to-foreground/80 bg-clip-text text-transparent py-2">
                    {section.title}
                  </div>
                </div>
              )}
            </h1>
            
            <div className={cn(
              "text-foreground leading-relaxed mb-8 sm:mb-10 text-base sm:text-lg lg:text-xl font-semibold",
              section.align === 'center' ? "max-w-full mx-auto text-center" : "max-w-full"
            )}>
              <p 
                ref={index === 0 ? heroTextRef : null}
                className="mb-3 sm:mb-4 text-foreground"
              >
                {section.description}
              </p>
              {index === 0 && (
                <p className="text-sm sm:text-base font-bold" style={{ color: '#f4721e' }}>
                  Tu energía, tus decisiones, tu ahorro.
                </p>
              )}
              {index === 0 && (
                <div className="flex flex-col items-start gap-3 sm:gap-4 text-xs sm:text-sm text-foreground mt-4 sm:mt-6">
                  <button
                    onClick={onStartJourneyClick}
                    className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30"
                  >
                    <span className="relative z-10">Inicia Tu Viaje</span>
                    <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  <button 
                    onClick={() => {
                      const nextSection = sectionRefs.current[1];
                      if (nextSection) {
                        nextSection.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'center'
                        });
                      }
                    }}
                    className="group items-center gap-1.5 sm:gap-2 cursor-pointer hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg px-2 py-1"
                    style={{ 
                      animation: 'bounce 3s ease-in-out infinite',
                      animationDelay: '0.5s'
                    }}
                  >
                    <span className="font-semibold group-hover:text-primary transition-colors">Desliza para explorar</span> <br />
                    <ChevronDown className="h-3 w-3 mx-auto mt-2 group-hover:text-primary transition-colors" style={{ 
                      animation: 'bounce 3s ease-in-out infinite',
                      animationDelay: '0.7s'
                    }} />
                  </button>
                </div>
              )}
            </div>

            {/* Enhanced Features - Responsive grid */}
            {section.features && (
              <div className="grid gap-3 sm:gap-4 mb-8 sm:mb-10">
                {section.features.map((feature, featureIndex) => (
                  <div 
                    key={feature.title}
                    className={cn(
                      "group p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5",
                      "hover:border-primary/20 hover:-translate-y-1"
                    )}
                    style={{ animationDelay: `${featureIndex * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {feature.icon && (
                        <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                          {feature.icon}
                        </div>
                      )}
                      <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                        <h3 className="font-semibold text-foreground text-base sm:text-lg">{feature.title}</h3>
                        <p className="text-foreground leading-relaxed text-sm sm:text-base">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced Actions - Responsive buttons */}
            {section.actions && (
              <div className={cn(
                "flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4",
                section.align === 'center' && "justify-center",
                section.align === 'right' && "justify-end",
                (!section.align || section.align === 'left') && "justify-start"
              )}>
                {section.actions.map((action, actionIndex) => {
                  if (action.href) {
                    const isExternal = action.href.startsWith('http');
                    return (
                      <Link
                        key={action.label}
                        href={action.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className={cn(
                          "group relative px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base",
                          "hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto",
                          action.variant === 'primary' 
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30" 
                            : "border-2 border-border/60 bg-background/50 backdrop-blur-sm hover:bg-accent/50 hover:border-primary/30 text-foreground"
                        )}
                        style={{ animationDelay: `${actionIndex * 0.1 + 0.2}s` }}
                      >
                        <span className="relative z-10">{action.label}</span>
                        {action.variant === 'primary' && (
                          <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}
                      </Link>
                    );
                  } else {
                    return (
                      <button
                        key={action.label}
                        onClick={action.onClick}
                        className={cn(
                          "group relative px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base",
                          "hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto",
                          action.variant === 'primary' 
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30" 
                            : "border-2 border-border/60 bg-background/50 backdrop-blur-sm hover:bg-accent/50 hover:border-primary/30 text-foreground"
                        )}
                        style={{ animationDelay: `${actionIndex * 0.1 + 0.2}s` }}
                      >
                        <span className="relative z-10">{action.label}</span>
                        {action.variant === 'primary' && (
                          <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}
                      </button>
                    );
                  }
                })}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

// Theme toggle removed

// EnergyHub specific ScrollGlobe component
export default function EnergyHubLanding() {
  const [isStartJourneyOpen, setIsStartJourneyOpen] = useState(false);
  const { setUser } = useUser();
  const router = useRouter();
  
  // Debug URLs in development
  useEffect(() => {
    debugUrls('EnergyHub Landing');
  }, []);

  const handleStartJourneySubmit = (data: {
    nombre: string;
    contractId: string;
    ubicacion: {
      address: string;
      lat: number;
      lng: number;
    };
  }) => {
    // Guardar datos del usuario en el contexto
    setUser({
      nombre: data.nombre,
      contractId: data.contractId,
      ubicacion: data.ubicacion,
    });
    
    // Redirigir al dashboard
    router.push(getInternalUrl('/dashboard'));
  };

  const energySections = [
    {
      id: "hero",
      badge: "Centro de Energía Celsia",
      title: "Centro de Energía Celsia",
      subtitle: "Gestión Energética Inteligente",
      description: "El Centro de Energía Celsia es una plataforma digital de monitoreo y análisis que te permite detectar patrones de consumo, recibir alertas y tomar decisiones sostenibles para mejorar la eficiencia de tu empresa y reducir tus costos.",
      align: "left" as const
    },
    {
      id: "features",
      badge: "Características",
      title: "Energía Conectada",
      description: "Desde el Valle del Cauca hacia el mundo, nuestro sistema de monitoreo energético conecta comunidades globales. Cada conexión representa eficiencia, cada interacción impulsa la sostenibilidad hacia un futuro energético global.",
      align: "center" as const,
    },
    {
      id: "marketplace",
      badge: "Market Place",
      title: "Oferta para Pymes",
      subtitle: "Soluciones Celsia",
      description: "Explora soluciones de energía de Celsia diseñadas para pequeñas y medianas empresas.",
      align: "left" as const,
      features: [
        {
          title: "Paneles Solares",
          description: "Instalación y financiamiento de soluciones solares a medida para tu empresa",
          icon: <Zap className="h-5 w-5" />
        },
        {
          title: "Proyectos Eléctricos",
          description: "Diseño e implementación de proyectos eléctricos integrales y normativos",
          icon: <CheckCircle className="h-5 w-5" />
        },
        {
          title: "Estudios y Auditorías",
          description: "Diagnósticos energéticos y auditorías para optimizar tu consumo",
          icon: <BarChart3 className="h-5 w-5" />
        },
        {
          title: "Energía de Respaldo",
          description: "Soluciones de backup y continuidad operativa para eventos críticos",
          icon: <Shield className="h-5 w-5" />
        }
      ],
      actions: [
        { label: "Conoce nuestras soluciones", variant: "secondary" as const, href: "https://www.celsia.com/en/celsiapymes/" }
      ]
    },
    {
      id: "capabilities",
      badge: "Capacidades",
      title: "Expandiendo",
      subtitle: "Posibilidades",
      description: "A medida que expandimos nuestro sistema de monitoreo energético global desde el piloto del Valle del Cauca, emergen nuevas oportunidades de optimización. Lo que parecía complejo ayer se convierte en la base de hoy para una eficiencia energética global extraordinaria.",
      align: "left" as const,
      features: [
        { 
          title: "Monitoreo en Tiempo Real", 
          description: "Rastrea tu consumo energético con datos en vivo y gráficos interactivos",
          icon: <BarChart3 className="h-5 w-5" />
        },
        { 
          title: "Impacto Ambiental", 
          description: "Monitorea tu huella de carbono y recibe recomendaciones de sostenibilidad",
          icon: <Leaf className="h-5 w-5" />
        },
        { 
          title: "Optimización de Costos", 
          description: "Reduce tus facturas energéticas con análisis inteligente de tarifas y patrones de uso",
          icon: <DollarSign className="h-5 w-5" />
        },
        { 
          title: "Gestión de Cortes", 
          description: "Mantente informado sobre cortes de energía e interrupciones del servicio en tu área",
          icon: <MapPin className="h-5 w-5" />
        },
        { 
          title: "Acceso Móvil", 
          description: "Gestiona tu energía desde cualquier lugar con nuestra interfaz móvil responsiva",
          icon: <Smartphone className="h-5 w-5" />
        },
        { 
          title: "Plataforma Segura", 
          description: "Tus datos están protegidos con medidas de seguridad y privacidad de nivel empresarial",
          icon: <Shield className="h-5 w-5" />
        }
      ]
    },
    {
      id: "future",
      badge: "Futuro",
      title: "Mañana",
      subtitle: "Sostenible",
      description: "En este momento de transformación energética global, vemos un lienzo de potencial sostenible infinito. Cada optimización representa progreso, cada innovación construye puentes hacia nuestro futuro energético global colectivo.",
      align: "center" as const,
      actions: [
        { 
          label: "Iniciar tu Viaje", 
          variant: "primary" as const, 
          onClick: () => setIsStartJourneyOpen(true)
        }
      ]
    }
  ];

  return (
    <div className="relative">
      <ScrollGlobe 
        sections={energySections}
        className="bg-gradient-to-br from-background via-muted/20 to-background"
        onStartJourneyClick={() => setIsStartJourneyOpen(true)}
      />
      
      {/* Theme switcher removed on mobile */}

      {/* Celsia Footer */}
      <div className="fixed bottom-4 right-4 z-50 bg-background/95 backdrop-blur-md border border-border/60 rounded-lg px-4 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          <a 
            href="https://www.celsia.com/en/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img 
              {...createImageWithFallback(getCelsiaLogoUrl(), 'Celsia')}
              alt="Celsia" 
              className="h-6 w-6 object-contain"
              onLoad={() => console.log('Landing Page - Celsia logo loaded successfully')}
              onError={(e) => {
                console.error('Landing Page - Celsia logo failed to load:', e);
                console.log('Landing Page - Using text fallback');
                // Fallback to text if image fails to load
                e.currentTarget.style.display = 'none';
                const fallbackElement = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallbackElement) {
                  fallbackElement.classList.remove('hidden');
                }
              }}
            />
            <span className="text-xs font-semibold text-foreground hidden">Celsia</span>
          </a>
          <span className="text-xs font-semibold text-foreground">By Celsia</span>
        </div>
      </div>

      {/* Start Journey Form Modal */}
      <StartJourneyForm
        open={isStartJourneyOpen}
        onOpenChange={setIsStartJourneyOpen}
        onSubmit={handleStartJourneySubmit}
      />
    </div>
  );
}
