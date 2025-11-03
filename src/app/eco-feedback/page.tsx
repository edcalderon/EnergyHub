"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EcoFeedbackSystem from "@/components/dashboard/EcoFeedbackSystem";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EcoFeedbackPage() {
  const [showBackButton, setShowBackButton] = useState(false);
  const router = useRouter();

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
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 pt-4 md:pt-16 w-full">
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
            Mi informe de energía
          </h1>
          <p className="text-muted-foreground">
            Impacto ambiental de tu consumo energético y recomendaciones sostenibles
          </p>
        </div>

        <EcoFeedbackSystem />
      </main>
    </div>
  );
}
