"use client";

import TariffSection from "@/components/dashboard/TariffSection";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TarifasPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 pt-4 md:pt-16 w-full">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Información Tarifaria
          </h1>
          <p className="text-muted-foreground">
            Desglose detallado de costos energéticos y planes alternativos
          </p>
        </div>

        <TariffSection />
      </main>
    </div>
  );
}
