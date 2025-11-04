"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TariffSimulator from "@/components/dashboard/TariffSimulator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useUser } from "@/contexts/user-context";

export default function SimuladorTarifasPage() {
  const [showBackButton, setShowBackButton] = useState(false);
  const router = useRouter();
  const { user } = useUser();

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

  return (
    <div className="min-h-screen bg-background w-full">
      <main className="container mx-auto px-4 py-8 pt-4 md:pt-16 w-full max-w-full">
        {showBackButton && (
          <div className="mb-4">
            <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </div>
        )}
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Simulación de Tarifas Flexibles
          </h1>
          <p className="text-muted-foreground">
            Explora diferentes escenarios tarifarios y visualiza su impacto en tus costos energéticos
          </p>
        </div>

        <TariffSimulator />
      </main>
    </div>
  );
}

