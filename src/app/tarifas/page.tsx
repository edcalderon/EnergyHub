"use client";

import TarifaExplainer from "@/components/dashboard/TarifaExplainer";
import { TarifaPie, TarifaVigenteTabla, TarifaEvolutionTabs } from "@/components/dashboard/TarifaVisuals";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";

export default function TarifasPage() {
  const [showBackButton, setShowBackButton] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    // Check if user came from dashboard using sessionStorage
    const fromDashboard = sessionStorage.getItem('fromDashboard');
    if (fromDashboard === 'true') {
      setShowBackButton(true);
      // Clear the flag after using it
      sessionStorage.removeItem('fromDashboard');
    }
  }, []);

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <main className="container mx-auto px-4 py-8 pt-4 md:pt-16 w-full max-w-full">
        <div className="mb-6">
          {showBackButton && (
            <Button variant="ghost" size="sm" className="mb-4" onClick={handleBackToDashboard}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          )}
          {/* SALUDO */}
          <div className="mb-4">
            <p className="text-base sm:text-lg font-bold text-neutral-700">
              ¡Hola, {user?.nombre || "Usuario"}!
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              ¡Te saludamos con la mejor energía de Celsia!
            </p>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Tarifas de Energía
          </h1>
          <p className="text-muted-foreground">
            A continuación te mostraremos los conceptos de tu Tarifa de energía
          </p>
        </div>

        {/* Explicación general y CU interactivo */}
        <div className="space-y-6">
          <TarifaExplainer />

          {/* Tarifa vigente: tabla + composición tipo torta */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TarifaVigenteTabla />
            <TarifaPie />
          </div>

          {/* Tendencia por componente */}
          <TarifaEvolutionTabs />

          {/* Información del Sector Energético */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Información del Sector Energético</h2>
            
            {/* Alertas y Noticias */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Alertas de Tarifa */}
              <Card className="p-6 border-l-4 border-l-blue-500">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Alertas de tu tarifa de energía</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Mantente informado sobre cambios en tu tarifa energética
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Tarifa actualizada para diciembre 2025</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Incremento del 0,9% en la tarifa total</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Noticias y Actualidad */}
              <Card className="p-6 border-l-4 border-l-green-500">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-100 text-green-600">
                    <span className="text-lg">📰</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Noticias y Actualidad energética</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Últimas novedades del sector energético colombiano
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Nuevas regulaciones CREG 2025</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Actualización del IPP y cargos regulados</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Información Detallada */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Como va el IPP */}
              <Card className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                    <span className="text-lg">📈</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">¿Cómo va el IPP?</h3>
                    <p className="text-sm text-muted-foreground">
                      Índice de Precios al Productor - Actualización 2025
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-3">
                      El incremento del IPP en un 3% en el G+C durante el 2025, y de los cargos regulados de Transmisión (STR) y otros (Restricciones, SIC, CREG), ha ocasionado un incremento en la tarifa total del 5% en 2025.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Variación mensual más alta:</span>
                          <span className="font-semibold text-red-600">1,38%</span>
                        </div>
                        <div className="text-xs text-muted-foreground">diciembre de 2025</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Variación acumulada:</span>
                          <span className="font-semibold text-orange-600">3.93%</span>
                        </div>
                        <div className="text-xs text-muted-foreground">últimos 12 meses</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Proyección crecimiento:</span>
                        <span className="font-semibold text-green-600">4.3%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">al cierre de año</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      <strong>Nota:</strong> Históricamente se ha utilizado el IPP en lugar del Índice de Precios al Consumidor (IPC) por considerarse un indicador que aproxima el avance en los precios de los insumos para la producción a nivel agregado y tiene un comportamiento más estable.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Como van las Restricciones */}
              <Card className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-red-100 text-red-600">
                    <span className="text-lg">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">¿Cómo van las Restricciones en Colombia?</h3>
                    <p className="text-sm text-muted-foreground">
                      Información sobre restricciones del sistema eléctrico
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-3">
                      Cuando el precio de bolsa es menor que el costo de las plantas térmicas, se genera una diferencia que debe reconocerse. Esta diferencia se remunera a través de las Restricciones del sistema, calculadas como la diferencia entre el costo térmico y el precio de bolsa.
                    </p>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong>Compromiso Celsia:</strong> Existen variables económicas, nacionales e internacionales, que están fuera del control de una empresa de energía. En Celsia mantenemos el compromiso de informarte ante cualquier cambio regulatorio que pueda impactar el costo unitario del servicio.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
