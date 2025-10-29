"use client";

import TariffSection from "@/components/dashboard/TariffSection";
import TarifaExplainer from "@/components/dashboard/TarifaExplainer";
import { TarifaLineChart, TarifaPie, TarifaVigenteTabla, TarifaEvolutionTabs } from "@/components/dashboard/TarifaVisuals";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TarifasPage() {
  const [showBackButton, setShowBackButton] = useState(false);
  const router = useRouter();

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
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 pt-4 md:pt-16 w-full">
        <div className="mb-6">
          {showBackButton && (
            <Button variant="ghost" size="sm" className="mb-4" onClick={handleBackToDashboard}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          )}
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Información Tarifaria
          </h1>
          <p className="text-muted-foreground">
            Desglose detallado de costos energéticos y planes alternativos
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

          {/* Sección existente (planes/alertas) al final para mantener funcionalidad previa */}
          <TariffSection />
        </div>
      </main>
    </div>
  );
}
