"use client";

import PowerOutageMap from "@/components/dashboard/PowerOutageMap";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function MapaCortesPage() {
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
            Mapa de Cortes de Energía
          </h1>
          <p className="text-muted-foreground">
            Visualiza en tiempo real las áreas afectadas por interrupciones del servicio eléctrico
          </p>
        </div>

        <PowerOutageMap />
      </main>
    </div>
  );
}
