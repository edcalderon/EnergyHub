"use client";

import TarifaExplainer from "@/components/dashboard/TarifaExplainer";
import { TarifaPie, TarifaVigenteTabla, TarifaEvolutionTabs } from "@/components/dashboard/TarifaVisuals";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            ¡Hola, {user?.nombre || "Usuario"}!
          </h1>
          <p className="text-muted-foreground mb-2">
            ¡Te saludamos con la mejor energía de Celsia!
          </p>
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
        </div>
      </main>
    </div>
  );
}
