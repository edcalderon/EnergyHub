"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import {
  MapPin,
  Clock,
  Phone,
  Smartphone,
  Search,
  Bell,
  ShieldCheck,
  AlertTriangle,
  Wrench,
  Zap,
  Smile,
  CheckCircle,
  Wifi,
  ArrowLeft,
  Users,
  Construction,
  TreePine,
  Calendar,
  MessageCircle,
  AlertCircle,
  CircleDot
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



export default function MapaCortesPage() {
  const [showBackButton, setShowBackButton] = useState(false);
  const [activeLocation, setActiveLocation] = useState<keyof typeof locations>('cali');
  const [mapCenter, setMapCenter] = useState<[number, number]>(locations.cali.position);
  const [mapZoom, setMapZoom] = useState(13);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const mapRef = useRef<any>(null);

  // Function to handle card click and center map on event
  const handleCardClick = (position: [number, number], zoom = 15) => {
    setMapCenter(position);
    setMapZoom(zoom);
    if (mapRef.current) {
      mapRef.current.setView(position, zoom);
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
    const fromDashboard = sessionStorage.getItem("fromDashboard");
    if (fromDashboard === "true") {
      setShowBackButton(true);
      sessionStorage.removeItem("fromDashboard");
    }
  }, []);

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  // Handle location change
  const handleLocationChange = (locationId: keyof typeof locations) => {
    setActiveLocation(locationId);
    setMapCenter(locations[locationId].position);
    setMapZoom(13);
  };

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return 'hace unos segundos';
    if (diffInMinutes < 60) return `hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `hace ${Math.floor(diffInMinutes / 60)} h`;
    return `hace ${Math.floor(diffInMinutes / 1440)} días`;
  };

  return (
    <div className="relative font-sans text-gray-800 overflow-x-hidden bg-white dark:bg-background [data-theme='celsia']:bg-[hsl(var(--background))]">

      {showBackButton && (
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <Button variant="ghost" size="sm" className="mb-4" onClick={handleBackToDashboard}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
        </div>
      )}


      {/* Main Content */}
      <main className="w-full max-w-full px-2 sm:px-4 py-4 md:py-8 lg:pt-16">
        {/* Title Section */}
        <div className="mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            Mapa de Cortes
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Visualización en tiempo real de interrupciones programadas y no programadas
          </p>
        </div>

        {/* Map Container */}
        <div className="w-full max-w-7xl mx-auto">
          {/* Location Tabs - Only show on mobile */}
          <div className="block lg:hidden mb-4 px-2">
            <Tabs
              value={activeLocation}
              onValueChange={(value) => handleLocationChange(value as keyof typeof locations)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="cali">Cali</TabsTrigger>
                <TabsTrigger value="palmira">Palmira</TabsTrigger>
                <TabsTrigger value="yumbo">Yumbo</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] xl:grid-cols-[1.5fr_1fr] gap-4 md:gap-6">
            {/* Map Section */}
            <motion.div 
              initial={{ opacity: 0, y: 8 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }} 
              className="h-[400px] sm:h-[500px] md:h-[600px] w-full"
            >
              <Card className="h-full w-full rounded-2xl md:rounded-3xl border-orange-100/60 shadow-sm md:shadow-md overflow-hidden relative">
                <CardContent className="h-full p-0">
                  <div className="h-full w-full relative z-0">
                    <MapWithNoSSR
                      ref={mapRef as any}
                      center={mapCenter}
                      zoom={mapZoom}
                      markers={[
                        ...locations[activeLocation].alerts.map(alert => {
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
                        {
                          position: locations[activeLocation].position,
                          popup: `<div class="p-2"><strong>${locations[activeLocation].name}</strong><br>Tu ubicación principal</div>`
                        }
                      ]}
                    />
                  </div>

                  {/* Active Alerts Badge */}
                  {locations[activeLocation].alerts.length > 0 && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 sm:px-3 py-1 rounded-xl sm:rounded-2xl border text-xs sm:text-sm text-gray-700 shadow-sm flex items-center gap-1.5 z-10">
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                      <span>{locations[activeLocation].alerts.length} alerta{locations[activeLocation].alerts.length !== 1 ? 's' : ''} activa{locations[activeLocation].alerts.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}

                  {/* Last Updated */}
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2 sm:px-3 py-1 rounded-xl sm:rounded-2xl border text-xs sm:text-sm text-gray-600 flex items-center gap-1.5 shadow-sm z-10">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
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
                        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-orange-500 rounded-full mr-1 flex-shrink-0"></span>
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
                </CardContent>
              </Card>
            </motion.div>

            {/* Side Panel - Only show on desktop */}
            <div className="hidden lg:block">
              <div className="sticky top-4 space-y-4">
                {/* Location Selector for Desktop */}
                <div className="bg-white/85 backdrop-blur rounded-2xl p-4 shadow-sm border border-gray-100">
                  <h3 className="font-medium text-gray-800 mb-3">Ubicación</h3>
                  <Tabs
                    value={activeLocation}
                    onValueChange={(value) => handleLocationChange(value as keyof typeof locations)}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="cali">Cali</TabsTrigger>
                      <TabsTrigger value="palmira">Palmira</TabsTrigger>
                      <TabsTrigger value="yumbo">Yumbo</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Alerts Summary */}
                <Card className="rounded-2xl border-orange-100/60 shadow-sm">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-800 mb-3">Resumen de Alertas</h3>
                    <div className="space-y-3">
                      {Object.entries(locations).map(([id, location]) => (
                        <div 
                          key={id}
                          className={`p-3 rounded-xl cursor-pointer transition-colors ${activeLocation === id ? 'bg-orange-50 border border-orange-100' : 'bg-gray-50 hover:bg-gray-100'}`}
                          onClick={() => handleLocationChange(id as keyof typeof locations)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{location.name}</span>
                            <Badge variant={activeLocation === id ? 'default' : 'secondary'} className="px-2 py-0.5">
                              {location.alerts.length} alerta{location.alerts.length !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                          <div className="mt-1 flex items-center text-xs text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            {location.alerts.length} evento{location.alerts.length !== 1 ? 's' : ''} activo{location.alerts.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Construcción de Líneas y Limpieza */}
      <section className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 md:py-6">
        <motion.div 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Card className="w-full rounded-2xl md:rounded-3xl border-orange-100/60 shadow-sm md:shadow-md bg-white/85 backdrop-blur">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold md:font-extrabold text-orange-600 mb-4 sm:mb-6 flex items-center gap-2">
                <Construction className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base md:text-lg">Trabajos en la Red Eléctrica</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Construcción de Líneas */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 text-orange-600">
                    <Construction className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <h4 className="font-medium text-sm sm:text-base">Construcción de Líneas</h4>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div 
                      className="bg-orange-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 cursor-pointer hover:ring-2 hover:ring-orange-200 transition-all duration-200"
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
  );
}
