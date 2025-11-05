"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { useUser } from "@/contexts/user-context";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  MapPin,
  Clock,
  Phone,
  Smartphone,
  Search,
  Bell,
  BellRing,
  ShieldCheck,
  AlertTriangle,
  Wrench,
  Zap,
  Smile,
  CheckCircle,
  CheckCircle2,
  Wifi,
  ArrowLeft,
  Users,
  Construction,
  TreePine,
  Calendar,
  MessageCircle,
  AlertCircle,
  CircleDot,
  LifeBuoy,
  RefreshCw,
  Info,
  Navigation,
  Home
} from "lucide-react";
import { AlertType, MapMarker } from "@/types/map";

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic<React.ComponentProps<typeof import('@/components/ui/map-component').default>>(
  () => import('@/components/ui/map-component').then((mod) => mod.default || mod),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Cargando mapa...</div>
      </div>
    )
  }
);

// Types
type Position = [number, number];

export interface Alert {
  id: number;
  type: AlertType;
  message: string;
  location: string;
  time: string;
  position: Position;
  details?: {
    progress?: number;
    endDate?: string;
    investment?: string;
    team?: string;
    duration?: string;
    responsible?: string;
    address?: string;
    sectors?: string;
  };
};

type LocationData = {
  name: string;
  position: Position;
  alerts: Alert[];
};

// Function to generate random points near a center coordinate
const generateNearbyPoints = (
  centerLat: number, 
  centerLng: number, 
  count: number, 
  radiusKm: number = 5
): Position[] => {
  const points: Position[] = [];
  const radiusInDegrees = radiusKm / 111; // Approximate conversion: 1 degree ≈ 111 km
  
  for (let i = 0; i < count; i++) {
    // Generate random angle and distance
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radiusInDegrees;
    
    // Calculate new point
    const latOffset = distance * Math.cos(angle);
    const lngOffset = distance * Math.sin(angle) / Math.cos(centerLat * Math.PI / 180);
    
    points.push([
      centerLat + latOffset,
      centerLng + lngOffset
    ] as Position);
  }
  
  return points;
};

// Sample data for locations and alerts
const locations: Record<string, LocationData> = {
  cali: {
    name: 'Cali',
    position: [3.4516, -76.5320] as Position, // Cali coordinates
    alerts: [
      { id: 1, type: 'outage', message: 'Corte programado', location: 'Cali Norte', time: '2h 30m', position: [3.4516, -76.5320] as Position },
      { id: 2, type: 'maintenance', message: 'Mantenimiento en progreso', location: 'Cali Centro', time: '4h 15m', position: [3.4416, -76.5220] as Position },
    ]
  },
  palmira: {
    name: 'Palmira',
    position: [3.5394, -76.3039] as Position, // Palmira coordinates
    alerts: [
      { id: 3, type: 'alert', message: 'Alta demanda', location: 'Palmira Centro', time: '1h 45m', position: [3.5394, -76.3039] as Position },
      { 
        id: 4, 
        type: 'construction', 
        message: 'Nueva Línea Palmira-Santander', 
        location: 'Palmira', 
        time: 'En progreso', 
        position: [3.5294, -76.3139] as Position,
        details: {
          progress: 65,
          endDate: '15 dic 2024',
          address: 'Carrera 15 #25-40, Calle 30 #12-15'
        }
      },
      { 
        id: 5, 
        type: 'construction', 
        message: 'Ampliación Subestación Valle', 
        location: 'Cali Sur', 
        time: 'Completado', 
        position: [3.5316, -76.5120] as Position,
        details: {
          investment: '$2.5M COP',
          endDate: '20 nov 2024',
          team: '12 técnicos'
        }
      },
      { 
        id: 6, 
        type: 'cleaning', 
        message: 'Limpieza Zona Industrial', 
        location: 'Zona Industrial', 
        time: 'En ejecución', 
        position: [3.5350, -76.5050] as Position,
        details: {
          progress: 40,
          team: 'Equipo Verde-3',
          sectors: '8 sectores'
        }
      },
      { 
        id: 7, 
        type: 'protection', 
        message: 'Protección Árboles', 
        location: 'Áreas Verdes', 
        time: 'Programado', 
        position: [3.5250, -76.5050] as Position,
        details: {
          duration: '2 días',
          endDate: '5 dic 2024',
          responsible: 'Ing. M. Torres'
        }
      }
    ]
  },
  yumbo: {
    name: 'Yumbo',
    position: [3.5850, -76.4951] as Position, // Yumbo coordinates
    alerts: [
      { id: 4, type: 'outage', message: 'Falla reportada', location: 'Yumbo Industrial', time: '3h 00m', position: [3.5850, -76.4951] as Position },
    ]
  }
};



// Tipo para estado de servicio
type EstadoServicio = "normal" | "programado" | "interrumpido";

// Demo data for service status
const demoEvento = {
  cuentaId: "C-001234567",
  razonSocial: "Industrias La Esperanza S.A.S.",
  direccion: "Parque Industrial del Sur, Bodega 14 – Cali",
  estadoServicio: "interrumpido" as EstadoServicio,
  tipoEvento: "No programado",
  causa: "Falla en transformador del circuito SDL CEN-12",
  inicio: "08:45",
  eta: "10:30",
  duracionEstimadaMin: 105,
  atendidoPor: "Cuadrilla OR-VAL-32 (2 técnicos)",
  operador: "Celsia Valle S.A. E.S.P.",
  numeroReporte: "SR-204859",
  clientesAfectados: 124,
  canalSoporte: {
    telefono: "01 8000 123 456",
    chatUrl: "#",
    correo: "soporte@celsia.com",
  },
  historial: [
    { fecha: "Ayer 16:20", duracion: 35, causa: "Árbol sobre línea" },
    { fecha: "13 Oct 10:05", duracion: 52, causa: "Mantenimiento preventivo" },
    { fecha: "25 Sep 21:15", duracion: 40, causa: "Falla por lluvias" },
  ],
};

const fmtNum = (n: number) => new Intl.NumberFormat("es-CO").format(n);
const nowStr = () => new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

export default function MapaCortesPage() {
  const { user } = useUser();
  const { theme } = useTheme();
  const { toast } = useToast();
  const isCelsiaMode = theme === "celsia";
  const [showBackButton, setShowBackButton] = useState(false);
  const [activeLocation, setActiveLocation] = useState<keyof typeof locations>('cali');
  
  // Initialize map center with user location if available, otherwise use default
  const initialMapCenter = useMemo(() => {
    if (user?.ubicacion?.lat && user?.ubicacion?.lng) {
      return [user.ubicacion.lat, user.ubicacion.lng] as [number, number];
    }
    return locations.cali.position;
  }, [user]);
  
  const initialZoom = useMemo(() => {
    return user?.ubicacion?.lat && user?.ubicacion?.lng ? 15 : 13;
  }, [user]);
  
  const [mapCenter, setMapCenter] = useState<[number, number]>(initialMapCenter);
  const [mapZoom, setMapZoom] = useState(initialZoom);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showMapInSupport, setShowMapInSupport] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const mapRef = useRef<any>(null);
  const supportMapRef = useRef<any>(null);

  // Determinar si es usuario demo
  const isDemoUser = useMemo(() => {
    return !user || user.nombre === "Usuario Demo" || user.nombre.toLowerCase().includes("demo");
  }, [user]);

  // Obtener datos del evento basado en el usuario
  const evento = useMemo(() => {
    if (isDemoUser) {
      // Usuario demo: usar datos demo completos
      return demoEvento;
    }
    // Si no es demo, usar datos del usuario con fallback a demo
    return {
      ...demoEvento,
      cuentaId: user?.contractId || demoEvento.cuentaId,
      razonSocial: user?.nombre || demoEvento.razonSocial,
      direccion: user?.ubicacion?.address || demoEvento.direccion,
    };
  }, [isDemoUser, user]);

  // Generate nearby outage points if user has location
  const nearbyOutages = useMemo(() => {
    if (!user?.ubicacion?.lat || !user?.ubicacion?.lng) {
      return [];
    }

    const centerLat = user.ubicacion.lat;
    const centerLng = user.ubicacion.lng;
    const nearbyPoints = generateNearbyPoints(centerLat, centerLng, 8, 8); // 8 points within 8km
    
    const outageTypes: AlertType[] = ['outage', 'maintenance', 'construction', 'alert'];
    const messages = [
      'Corte programado',
      'Mantenimiento en progreso',
      'Falla en transformador',
      'Alta demanda eléctrica',
      'Reparación de línea',
      'Actualización de infraestructura',
      'Interrupción temporal',
      'Trabajos de mejoramiento'
    ];
    const locationNames = [
      'Zona Norte',
      'Zona Sur',
      'Zona Centro',
      'Zona Industrial',
      'Sector Residencial',
      'Área Comercial',
      'Zona Periférica',
      'Sector Urbano'
    ];
    const times = ['30 min', '1h 15m', '2h 00m', '45 min', '1h 30m', '3h 00m', '1h 00m', '2h 30m'];

    return nearbyPoints.map((point, index): Alert => ({
      id: 1000 + index,
      type: outageTypes[index % outageTypes.length] as AlertType,
      message: messages[index % messages.length],
      location: locationNames[index % locationNames.length],
      time: times[index % times.length],
      position: point,
    }));
  }, [user?.ubicacion]);

  // Combine nearby outages with location alerts
  const allAlerts = useMemo(() => {
    const baseAlerts = locations[activeLocation].alerts;
    return [...nearbyOutages, ...baseAlerts];
  }, [nearbyOutages, activeLocation]);

  // Function to handle card click and center map on event
  const handleCardClick = (position: [number, number], zoom = 15) => {
    setMapCenter(position);
    setMapZoom(zoom);
    if (mapRef.current) {
      mapRef.current.setView(position, zoom);
    }
  };

  // Function to center map on user location
  const handleCenterOnUser = () => {
    if (user?.ubicacion?.lat && user?.ubicacion?.lng) {
      const userPosition: [number, number] = [user.ubicacion.lat, user.ubicacion.lng];
      setMapCenter(userPosition);
      setMapZoom(15);
      if (mapRef.current) {
        mapRef.current.setView(userPosition, 15);
      }
    }
  };
  const router = useRouter();

  // Update last updated time
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Check if we came from the dashboard
    const fromDashboard = sessionStorage.getItem("fromDashboard") === "true";
    setShowBackButton(fromDashboard);
    
    // Clean up the flag when component unmounts
    return () => {
      if (fromDashboard) {
        sessionStorage.removeItem("fromDashboard");
      }
    };
  }, []);

  const handleBackToDashboard = () => {
    // Remove the flag when going back to dashboard
    sessionStorage.removeItem("fromDashboard");
    router.push("/dashboard");
  };

  // Handle location change
  const handleLocationChange = (locationId: keyof typeof locations) => {
    setActiveLocation(locationId);
    setMapCenter(locations[locationId].position);
    setMapZoom(13);
  };

  // Update map center when user location changes
  useEffect(() => {
    if (user?.ubicacion?.lat && user?.ubicacion?.lng) {
      const userPosition: [number, number] = [user.ubicacion.lat, user.ubicacion.lng];
      setMapCenter(userPosition);
      setMapZoom(15); // Zoom in closer for user location
      if (mapRef.current) {
        mapRef.current.setView(userPosition, 15);
      }
    } else {
      // Reset to default if user doesn't have location
      setMapCenter(locations.cali.position);
      setMapZoom(13);
      if (mapRef.current) {
        mapRef.current.setView(locations.cali.position, 13);
      }
    }
  }, [user?.ubicacion]);

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return 'hace unos segundos';
    if (diffInMinutes < 60) return `hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `hace ${Math.floor(diffInMinutes / 60)} h`;
    return `hace ${Math.floor(diffInMinutes / 1440)} días`;
  };

  const colorEstado = useMemo(() => {
    switch (evento.estadoServicio) {
      case "normal":
        return { bg: "bg-emerald-50", text: "text-emerald-700", pill: "bg-emerald-600" };
      case "programado":
        return { bg: "bg-amber-50", text: "text-amber-800", pill: "bg-amber-600" };
      default:
        return { bg: "bg-red-50", text: "text-red-700", pill: "bg-red-600" };
    }
  }, [evento.estadoServicio]);

  const mensajeEstado = useMemo(() => {
    if (evento.estadoServicio === "normal") return "Tu servicio funciona con normalidad";
    if (evento.estadoServicio === "programado") return "Hay un mantenimiento programado que podría afectarte";
    return "Tu servicio se encuentra interrumpido temporalmente";
  }, [evento.estadoServicio]);

  const recomendaciones = useMemo(() => {
    if (evento.estadoServicio === "programado") {
      return [
        "Programa paradas de proceso durante la ventana de mantenimiento.",
        "Respalda información crítica y apaga equipos sensibles antes del inicio.",
        "Coordina turnos y logística de personal para minimizar tiempos muertos.",
        "Verifica autonomía de UPS y plantas de respaldo (si aplica).",
      ];
    }
    if (evento.estadoServicio === "interrumpido") {
      return [
        "Asegura cargas críticas en UPS/plantas y evita reconexiones repetidas.",
        "Evita maniobras internas en tableros hasta restablecimiento estable.",
        "Documenta impactos operativos y regístralos con el número de reporte.",
        "Mantén despejada el área de acceso para el personal técnico.",
      ];
    }
    return [
      "Realiza inspecciones rápidas de consumos anómalos post-evento.",
      "Revisa horarios de producción para no coincidir con mantenimientos futuros.",
      "Actualiza tus preferencias de alertas por correo o app.",
    ];
  }, [evento.estadoServicio]);

  return (
    <div className={cn(
      "min-h-screen w-full",
      isCelsiaMode 
        ? "bg-gradient-to-b from-orange-50/60 to-white" 
        : "bg-white"
    )}>
      <main className="container mx-auto px-4 py-8 pt-4 md:pt-16 w-full max-w-full">
        <div className="space-y-4">
        {showBackButton && (
          <div className="mb-4">
            <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </div>
        )}

        {/* SALUDO */}
        <div className="mb-4">
          <p className="text-base sm:text-lg font-bold text-neutral-700">
            ¡Hola {user?.nombre || "Usuario"}! En Celsia nos encanta tenerte aquí.
          </p>
          <p className="text-sm text-neutral-600 mt-1">
            Gracias por hacer parte de esta comunidad llena de buena energía.
          </p>
        </div>

        {/* ENCABEZADO */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
              Estado de tu servicio eléctrico
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              Información en tiempo real para tu cuenta vinculada.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn(
              isCelsiaMode ? "bg-orange-500 text-white" : "bg-gray-500 text-white"
            )}>Última actualización: {nowStr()}</Badge>
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={() => {
                setLastUpdated(new Date());
                // Center map on user location if available
                if (user?.ubicacion?.lat && user?.ubicacion?.lng) {
                  handleCenterOnUser();
                }
              }}
            >
              <RefreshCw className="h-4 w-4" /> Actualizar
            </Button>
          </div>
        </div>

        {/* BARRA DE CUENTA */}
        <Card className="border-none shadow-md rounded-2xl">
          <CardContent className="p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="flex-1 min-w-0">
              <div className="text-sm text-neutral-500">Cuenta</div>
              <div className="font-medium text-neutral-900 truncate">{evento.cuentaId} · {evento.razonSocial}</div>
              <div className="text-sm text-neutral-700">{evento.direccion}</div>
            </div>
            <Separator orientation="vertical" className="hidden lg:block h-10" />
            <div className={`rounded-xl px-3 py-2 ${colorEstado.bg} ${colorEstado.text} flex items-center gap-2`}>
              {evento.estadoServicio === "interrumpido" ? (
                <AlertTriangle className="h-4 w-4" />
              ) : evento.estadoServicio === "programado" ? (
                <Clock className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <span className="font-medium">{mensajeEstado}</span>
            </div>
          </CardContent>
        </Card>

        {/* CONTENIDO */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* COLUMNA PRINCIPAL */}
          <div className="xl:col-span-2 space-y-4">
            {/* FICHA DEL EVENTO */}
            <Card className="border-none shadow-md rounded-2xl">
              <CardContent className="p-4 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={`${colorEstado.pill} text-white`}>{evento.tipoEvento}</Badge>
                  <Badge variant="outline" className={cn(
                    isCelsiaMode ? "border-orange-300 text-orange-700" : "border-gray-300 text-gray-700"
                  )}>{fmtNum(evento.clientesAfectados)} clientes afectados</Badge>
                  <Badge variant="outline" className="border-neutral-300">Reporte #{evento.numeroReporte}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-neutral-800">
                  <div className={cn(
                    "p-3 rounded-xl bg-white shadow-sm ring-1",
                    isCelsiaMode ? "ring-orange-100" : "ring-gray-100"
                  )}>
                    <div className="text-neutral-500 text-xs">Causa</div>
                    <div className="font-medium">{evento.causa}</div>
                  </div>
                  <div className={cn(
                    "p-3 rounded-xl bg-white shadow-sm ring-1",
                    isCelsiaMode ? "ring-orange-100" : "ring-gray-100"
                  )}>
                    <div className="text-neutral-500 text-xs">Estado de atención</div>
                    <div className="font-medium">{evento.atendidoPor}</div>
                  </div>
                  <div className={cn(
                    "p-3 rounded-xl bg-white shadow-sm ring-1",
                    isCelsiaMode ? "ring-orange-100" : "ring-gray-100"
                  )}>
                    <div className="text-neutral-500 text-xs">Inicio</div>
                    <div className="font-medium">{evento.inicio}</div>
                  </div>
                  <div className={cn(
                    "p-3 rounded-xl bg-white shadow-sm ring-1",
                    isCelsiaMode ? "ring-orange-100" : "ring-gray-100"
                  )}>
                    <div className="text-neutral-500 text-xs">Restablecimiento estimado</div>
                    <div className="font-medium">{evento.eta} · {evento.duracionEstimadaMin} min</div>
                  </div>
                </div>

                {/* Progreso del evento */}
                <div className="mt-2">
                  <div className="text-xs text-neutral-500 mb-1">Progreso</div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {[
                      { label: "Diagnóstico", done: true },
                      { label: "En atención", done: true },
                      { label: "Restablecimiento", done: false },
                      { label: "Cierre", done: false },
                    ].map((s, i) => (
                      <div key={i} className={cn(
                        "rounded-xl px-2 py-2 flex items-center gap-2",
                        s.done 
                          ? (isCelsiaMode ? "bg-orange-500 text-white" : "bg-gray-500 text-white")
                          : (isCelsiaMode ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-700")
                      )}>
                        {s.done ? <ShieldCheck className="h-4 w-4" /> : <Wrench className="h-4 w-4" />}
                        <span className="truncate">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* HISTORIAL */}
            <Card className="border-none shadow-md rounded-2xl">
              <CardContent className="p-0 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={cn(
                      "text-left",
                      isCelsiaMode ? "bg-orange-100/60" : "bg-gray-100/60"
                    )}>
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3">Duración</th>
                      <th className="px-4 py-3">Causa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evento.historial.map((h, idx) => (
                      <tr key={idx} className={cn(
                        idx % 2 ? "bg-white" : (isCelsiaMode ? "bg-orange-50/30" : "bg-gray-50/30")
                      )}>
                        <td className="px-4 py-3">{h.fecha}</td>
                        <td className="px-4 py-3">{h.duracion} min</td>
                        <td className="px-4 py-3">{h.causa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* MAPA */}
            <motion.div 
              initial={{ opacity: 0, y: 8 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }} 
              className="h-[400px] sm:h-[500px] md:h-[600px] w-full"
            >
              <Card className="h-full w-full border-none shadow-md rounded-2xl overflow-hidden relative">
                <CardContent className="h-full p-0">
                  <div className="h-full w-full relative z-0">
                    <MapWithNoSSR
                      ref={mapRef as any}
                      center={mapCenter}
                      zoom={mapZoom}
                      markers={[
                        // User location marker if available
                        ...(user?.ubicacion?.lat && user?.ubicacion?.lng ? [{
                          position: [user.ubicacion.lat, user.ubicacion.lng] as [number, number],
                          popup: `<div class="p-2"><strong>Tu ubicación</strong><br>${user.ubicacion.address || 'Ubicación guardada'}</div>`
                        }] : []),
                        // All alerts (nearby + location alerts)
                        ...allAlerts.map(alert => {
                          let popupContent = `
                            <div class="p-2 max-w-[200px] sm:max-w-[250px]">
                              <h4 class="font-bold text-sm">${alert.location}</h4>
                              <p class="text-xs font-medium">${alert.message}</p>
                              <div class="mt-1 text-xs text-gray-500">${alert.time}</div>
                          `;
                          
                          if (alert.details) {
                            if (alert.details.progress !== undefined) {
                              popupContent += `<div class="mt-1 text-xs">Progreso: ${alert.details.progress}%</div>`;
                            }
                            if (alert.details.endDate) {
                              popupContent += `<div class="text-xs">${alert.type === 'construction' ? 'Fin' : 'Inicio'}: ${alert.details.endDate}</div>`;
                            }
                            if (alert.details.address) {
                              popupContent += `<div class="text-xs mt-1">${alert.details.address}</div>`;
                            }
                            if (alert.details.team) {
                              popupContent += `<div class="text-xs">Equipo: ${alert.details.team}</div>`;
                            }
                            if (alert.details.investment) {
                              popupContent += `<div class="text-xs font-medium mt-1">${alert.details.investment}</div>`;
                            }
                            if (alert.details.duration) {
                              popupContent += `<div class="text-xs">Duración: ${alert.details.duration}</div>`;
                            }
                            if (alert.details.responsible) {
                              popupContent += `<div class="text-xs">Responsable: ${alert.details.responsible}</div>`;
                            }
                            if (alert.details.sectors) {
                              popupContent += `<div class="text-xs">Sectores: ${alert.details.sectors}</div>`;
                            }
                          }
                          
                          popupContent += `</div>`;
                          
                          return {
                            position: alert.position,
                            type: alert.type,
                            popup: popupContent
                          };
                        }),
                        // Default location marker if user doesn't have location
                        ...(!user?.ubicacion?.lat || !user?.ubicacion?.lng ? [{
                          position: locations[activeLocation].position,
                          popup: `<div class="p-2"><strong>${locations[activeLocation].name}</strong><br>Ubicación de referencia</div>`
                        }] : [])
                      ]}
                    />
                  </div>

                  {/* Active Alerts Badge */}
                  {allAlerts.length > 0 && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 sm:px-3 py-1 rounded-xl sm:rounded-2xl border text-xs sm:text-sm text-gray-700 shadow-sm flex items-center gap-1.5 z-10">
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                      <span>{allAlerts.length} alerta{allAlerts.length !== 1 ? 's' : ''} activa{allAlerts.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}

                  {/* Last Updated */}
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2 sm:px-3 py-1 rounded-xl sm:rounded-2xl border text-xs sm:text-sm text-gray-600 flex items-center gap-1.5 shadow-sm z-10">
                    <Clock className={cn(
                      "w-3 h-3 sm:w-4 sm:h-4",
                      isCelsiaMode ? "text-orange-600" : "text-gray-600"
                    )} />
                    <span>Actualizado: {formatTimeAgo(lastUpdated)}</span>
                  </div>

                  {/* Map Legend - Bottom Left */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur p-2 rounded-xl sm:rounded-2xl border text-[10px] sm:text-xs text-gray-700 shadow-sm z-10">
                    <div className="grid grid-cols-2 gap-1">
                      <div className="flex items-center whitespace-nowrap">
                        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full mr-1 flex-shrink-0"></span>
                        <span>Imprevistos</span>
                      </div>
                      <div className="flex items-center whitespace-nowrap">
                        <span className={cn(
                          "w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mr-1 flex-shrink-0",
                          isCelsiaMode ? "bg-orange-500" : "bg-gray-500"
                        )}></span>
                        <span>Mantenimiento</span>
                      </div>
                      <div className="flex items-center whitespace-nowrap">
                        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-purple-500 rounded-full mr-1 flex-shrink-0"></span>
                        <span>Construcción</span>
                      </div>
                      <div className="flex items-center whitespace-nowrap">
                        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-1 flex-shrink-0"></span>
                        <span>Limpieza</span>
                      </div>
                    </div>
                  </div>

                  {/* Center on User Location Button */}
                  {user?.ubicacion?.lat && user?.ubicacion?.lng && (
                    <Button
                      onClick={handleCenterOnUser}
                      size="sm"
                      className={cn(
                        "absolute top-3 right-3 bg-white/90 backdrop-blur hover:bg-white border shadow-sm z-10",
                        "flex items-center gap-2 px-2 sm:px-3 py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm",
                        isCelsiaMode 
                          ? "text-orange-600 hover:text-orange-700 border-orange-200 hover:border-orange-300" 
                          : "text-gray-600 hover:text-gray-700 border-gray-200 hover:border-gray-300"
                      )}
                      title="Centrar en tu ubicación"
                    >
                      <Navigation className="w-4 h-4" />
                      <span className="hidden sm:inline">Mi ubicación</span>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* COLUMNA LATERAL */}
          <div className="space-y-4">
            {/* Suscripción a alertas */}
            <Card className="border-none shadow-md rounded-2xl">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Bell className={cn(
                    "h-4 w-4",
                    isCelsiaMode ? "text-orange-600" : "text-gray-600"
                  )} />
                  <div className="font-medium">Alertas personalizadas</div>
                </div>
                <div className="text-sm text-neutral-700">Recibe notificaciones cuando haya eventos en tu circuito o zona.</div>
                <div className="flex items-center justify-between text-sm">
                  <span>Correo electrónico</span>
                  <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>SMS / App</span>
                  <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
                </div>
                <Button 
                  className={cn(
                    "w-full text-white gap-2",
                    isCelsiaMode ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-500 hover:bg-gray-600"
                  )}
                  onClick={() => {
                    toast({
                      title: "Preferencias guardadas",
                      description: "Tus preferencias de alertas han sido guardadas con éxito.",
                    });
                  }}
                >
                  <BellRing className="h-4 w-4" /> Guardar preferencias
                </Button>
              </CardContent>
            </Card>

            {/* Recomendaciones operativas */}
            <Card className="border-none shadow-md rounded-2xl bg-white">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Wrench className={cn(
                    "h-4 w-4",
                    isCelsiaMode ? "text-orange-600" : "text-gray-600"
                  )} />
                  <div className="font-medium">Recomendaciones operativas</div>
                </div>
                <ul className="list-disc pl-5 text-sm text-neutral-800 space-y-1">
                  {recomendaciones.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full">Descargar checklist PDF</Button>
              </CardContent>
            </Card>

            {/* Soporte del Operador de Red */}
            <Card className="border-none shadow-md rounded-2xl">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <LifeBuoy className={cn(
                    "h-4 w-4",
                    isCelsiaMode ? "text-orange-600" : "text-gray-600"
                  )} />
                  <div className="font-medium">Soporte del Operador de Red</div>
                </div>
                <div className="text-sm text-neutral-700">{evento.operador}</div>
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    variant="outline" 
                    className="justify-start gap-2"
                    onClick={() => window.open('tel:018000123456')}
                  >
                    <Phone className="h-4 w-4" /> {evento.canalSoporte.telefono}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start gap-2"
                    onClick={() => {/* TODO: Implement chat functionality */}}
                  >
                    <Info className="h-4 w-4" /> Abrir chat
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start gap-2"
                    onClick={() => setShowMapInSupport(!showMapInSupport)}
                  >
                    <MapPin className="h-4 w-4" /> Ver en mapa (opcional)
                  </Button>
                </div>
                <div className="text-xs text-neutral-500">
                  El número de reporte <b>{evento.numeroReporte}</b> es tu referencia para seguimiento.
                </div>

                {/* Map in Support Section - White Space */}
                {showMapInSupport && (
                  <div className="mt-4 h-[300px] w-full rounded-lg overflow-hidden border border-gray-200 bg-white">
                    <MapWithNoSSR
                      ref={supportMapRef as any}
                      center={[3.5180, -76.5130] as [number, number]}
                      zoom={15}
                      markers={[
                        {
                          position: [3.5180, -76.5130] as [number, number],
                          popup: `<div class="p-2"><strong>Ubicación del Reporte</strong><br>CL 15 # 29 B - 30 AUTOPISTA CALI YUMBO<br>YUMBO - VALLE CALI, Valle del Cauca (CO-VAC)</div>`
                        }
                      ]}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Construcción de Líneas y Limpieza */}
        <section className="py-6">
        <motion.div 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Card className={cn(
            "w-full rounded-2xl md:rounded-3xl border shadow-sm md:shadow-md bg-white/85 backdrop-blur",
            isCelsiaMode ? "border-orange-100/60" : "border-gray-100/60"
          )}>
            <CardContent className="p-4 sm:p-6">
              <h3 className={cn(
                "text-lg sm:text-xl font-bold md:font-extrabold mb-4 sm:mb-6 flex items-center gap-2",
                isCelsiaMode ? "text-orange-600" : "text-gray-600"
              )}>
                <Construction className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base md:text-lg">Trabajos en la Red Eléctrica</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Construcción de Líneas */}
                <div className="space-y-3 sm:space-y-4">
                  <div className={cn(
                    "flex items-center gap-2",
                    isCelsiaMode ? "text-orange-600" : "text-gray-600"
                  )}>
                    <Construction className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <h4 className="font-medium text-sm sm:text-base">Construcción de Líneas</h4>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div 
                      className={cn(
                        "rounded-xl sm:rounded-2xl p-3 sm:p-4 cursor-pointer transition-all duration-200",
                        isCelsiaMode 
                          ? "bg-orange-50 hover:ring-2 hover:ring-orange-200" 
                          : "bg-gray-50 hover:ring-2 hover:ring-gray-200"
                      )}
                      onClick={() => handleCardClick([3.5294, -76.3139])}
                    >
                      <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                        <h5 className="font-medium text-xs sm:text-sm">Nueva Línea Palmira-Santander</h5>
                        <Badge variant="secondary" className="text-xs">En progreso</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1.5 sm:mb-2 line-clamp-2">Direcciones afectadas: Carrera 15 #25-40, Calle 30 #12-15</p>
                      <div className="flex flex-col xs:flex-row justify-between gap-1 xs:items-center text-2xs xs:text-xs text-gray-500">
                        <span>Progreso: 65%</span>
                        <span>Fin estimado: 15 dic 2024</span>
                      </div>
                    </div>
                    <div 
                      className="bg-green-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 cursor-pointer hover:ring-2 hover:ring-green-200 transition-all duration-200"
                      onClick={() => handleCardClick([3.5350, -76.5050])}
                    >
                      <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                        <h5 className="font-medium text-xs sm:text-sm">Ampliación Subestación Valle</h5>
                        <Badge variant="outline" className="text-green-600 text-xs">Completado</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1.5 sm:mb-2">Inversión: $2.5M COP</p>
                      <div className="flex flex-col xs:flex-row justify-between gap-1 xs:items-center text-2xs xs:text-xs text-gray-500">
                        <span>Finalizado: 20 nov 2024</span>
                        <span>Personal: 12 técnicos</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Limpieza y Protección */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <TreePine className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <h4 className="font-medium text-sm sm:text-base">Limpieza y Protección</h4>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div 
                      className="bg-green-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 cursor-pointer hover:ring-2 hover:ring-green-200 transition-all duration-200"
                      onClick={() => handleCardClick([3.5350, -76.5050])}
                    >
                      <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                        <h5 className="font-medium text-xs sm:text-sm">Limpieza Zona Industrial</h5>
                        <Badge variant="secondary" className="text-xs">En ejecución</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1.5 sm:mb-2">Zonas intervenidas: 8 sectores</p>
                      <div className="flex flex-col xs:flex-row justify-between gap-1 xs:items-center text-2xs xs:text-xs text-gray-500">
                        <span>Avance: 40%</span>
                        <span>Personal: Equipo Verde-3</span>
                      </div>
                    </div>
                    <div 
                      className="bg-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all duration-200"
                      onClick={() => handleCardClick([3.5250, -76.5050])}
                    >
                      <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                        <h5 className="font-medium text-xs sm:text-sm">Protección Árboles</h5>
                        <Badge variant="outline" className="text-blue-600 text-xs">Programado</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1.5 sm:mb-2">Tiempo estimado: 2 días</p>
                      <div className="flex flex-col xs:flex-row justify-between gap-1 xs:items-center text-2xs xs:text-xs text-gray-500">
                        <span>Inicio: 5 dic 2024</span>
                        <span>Responsable: Ing. M. Torres</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        </section>
        </div>
      </main>
    </div>
  );
}
