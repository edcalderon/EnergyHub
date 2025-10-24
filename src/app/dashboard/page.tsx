"use client";

import EnergyConsumptionPanel from "@/components/dashboard/EnergyConsumptionPanel";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, DollarSign, MapPin, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background w-full">
      <main className="container mx-auto px-4 py-8 pt-4 md:pt-16 w-full max-w-full">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dashboard de Gestión Energética
          </h1>
          <p className="text-muted-foreground">
            Monitorea tu consumo, recibe alertas inteligentes y optimiza tu gasto energético en tiempo real
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            <EnergyConsumptionPanel />

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/tarifas">
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <DollarSign className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="font-semibold text-foreground">Tarifas</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Consulta desglose de costos y planes alternativos
                  </p>
                  <Button variant="ghost" size="sm" className="w-full">
                    Ver Tarifas <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Card>
              </Link>

              <Link href="/eco-feedback">
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Leaf className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="font-semibold text-foreground">Eco-Feedback</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Impacto ambiental y prácticas sostenibles
                  </p>
                  <Button variant="ghost" size="sm" className="w-full">
                    Ver Impacto <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Card>
              </Link>

              <Link href="/mapa-cortes">
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <MapPin className="h-5 w-5 text-red-500" />
                    </div>
                    <h3 className="font-semibold text-foreground">Mapa de Cortes</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Visualiza áreas afectadas en tiempo real
                  </p>
                  <Button variant="ghost" size="sm" className="w-full">
                    Ver Mapa <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
