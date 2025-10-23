"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EcoFeedbackSystem from "@/components/dashboard/EcoFeedbackSystem";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EcoFeedbackPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Sistema de Eco-Feedback
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
