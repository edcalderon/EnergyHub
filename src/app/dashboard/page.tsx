"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import EnergyConsumptionPanel from "@/components/dashboard/EnergyConsumptionPanel";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, DollarSign, MapPin, ArrowRight, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function DashboardPage() {
  const { isAuthenticated, user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleExportCSV = () => {
    console.log("handleExportCSV called");
    try {
      console.log("User:", user);
      if (!user) {
        console.log("No user found");
        toast({
          title: "Error",
          description: "No hay información de usuario disponible",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Starting CSV export...");

      // Prepare comprehensive CSV data
      const csvRows: string[] = [];
      
      // Header Section
      csvRows.push("RESUMEN EJECUTIVO - DATOS DEL USUARIO");
      csvRows.push("");
      csvRows.push(`Nombre,${user.nombre || "N/A"}`);
      csvRows.push(`ID de Contrato,${user.contractId || "N/A"}`);
      csvRows.push(`Dirección,${user.ubicacion?.address || "N/A"}`);
      csvRows.push(`Fecha de Exportación,${new Date().toLocaleString("es-CO")}`);
      csvRows.push("");
      
      // Consumption Metrics Section
      csvRows.push("MÉTRICAS DE CONSUMO");
      csvRows.push("");
      csvRows.push("Métrica,Valor,Unidad");
      csvRows.push(`Consumo Actual,1247,kWh`);
      csvRows.push(`Consumo Anterior,1156,kWh`);
      csvRows.push(`Variación,7.9,%`);
      csvRows.push(`Costo Proyectado,13680000,COP`);
      csvRows.push(`Eficiencia Energética,87.5,%`);
      csvRows.push(`Ahorro Mensual,156000,COP`);
      csvRows.push("");
      
      // Monthly Consumption Section
      csvRows.push("CONSUMO MENSUAL");
      csvRows.push("");
      csvRows.push("Mes,Consumo (kWh),Costo (COP)");
      csvRows.push("Julio,72,1050000");
      csvRows.push("Agosto,85,1250000");
      csvRows.push("Septiembre,68,1000000");
      csvRows.push("Octubre,78,1150000");
      csvRows.push("Noviembre,82,1200000");
      csvRows.push("Diciembre,95,1400000");
      csvRows.push("");
      
      // Weekly Consumption Section
      csvRows.push("CONSUMO SEMANAL");
      csvRows.push("");
      csvRows.push("Día,Consumo (kWh),Costo (COP)");
      csvRows.push("Lunes,85,125000");
      csvRows.push("Martes,78,115000");
      csvRows.push("Miércoles,92,135000");
      csvRows.push("Jueves,88,130000");
      csvRows.push("Viernes,75,110000");
      csvRows.push("Sábado,45,66000");
      csvRows.push("Domingo,38,56000");
      csvRows.push("");
      
      // Hourly Distribution Section
      csvRows.push("DISTRIBUCIÓN HORARIA");
      csvRows.push("");
      csvRows.push("Franja,Porcentaje,Consumo (kWh)");
      csvRows.push("Valle (Tarifa Baja),45,560");
      csvRows.push("Tarifa Media,35,437");
      csvRows.push("Pico (Tarifa Alta),20,250");
      csvRows.push("");
      
      // Environmental Impact Section
      csvRows.push("IMPACTO AMBIENTAL");
      csvRows.push("");
      csvRows.push("Métrica,Valor,Unidad");
      csvRows.push("CO2 Emitido,2.4,toneladas");
      csvRows.push("Equivalente en Árboles,112,árboles");
      csvRows.push("Agua Virtual,1850,litros");
      csvRows.push("Huella de Carbono,3.2,toneladas CO2");
      csvRows.push("");
      
      // Energy Efficiency Section
      csvRows.push("EFICIENCIA ENERGÉTICA");
      csvRows.push("");
      csvRows.push("Métrica,Valor,Unidad");
      csvRows.push("Meta de Sostenibilidad,65,%");
      csvRows.push("Progreso Actual,42,%");
      csvRows.push("Reducción Horas Pico,15,%");
      csvRows.push("Incremento Horas Valle,22,%");
      csvRows.push("");
      
      // Join all rows with UTF-8 BOM for Excel compatibility
      const BOM = "\uFEFF";
      const csvContent = BOM + csvRows.join("\n");
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      const fileName = `datos_energia_${(user.nombre || "usuario").replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`;
      
      link.href = url;
      link.download = fileName;
      link.style.display = "none";
      
      console.log("Appending link to body, fileName:", fileName);
      document.body.appendChild(link);
      console.log("Clicking link...");
      link.click();
      console.log("Link clicked");
      
      // Clean up
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      }, 100);
      
      // Show toast notification with a small delay to ensure it renders
      setTimeout(() => {
        console.log("Showing toast");
        toast({
          title: "CSV descargado con éxito!",
          description: "Los datos se han descargado correctamente en formato CSV",
        });
      }, 150);
    } catch (error) {
      console.error("Error al exportar CSV:", error);
      toast({
        title: "Error",
        description: "No se pudo exportar el archivo CSV. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="min-h-screen bg-background w-full">
      <main className="container mx-auto px-4 py-8 pt-4 md:pt-16 w-full max-w-full">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {/* SALUDO */}
              <div className="mb-4">
                <p className="text-base sm:text-lg font-bold text-neutral-700">
                  ☀️ ¡Hola {user?.nombre || "Usuario"}! Qué alegría tenerte conectado con Celsia.
                </p>
                <p className="text-sm text-neutral-600 mt-2">
                  En cada kilovatio hay una historia de energía que impulsa tu negocio y nos mueve a seguir mejorando cada día. ⚡
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                  Estamos aquí para acompañarte, ayudarte a optimizar tu consumo y brindarte soluciones que hagan tu operación más eficiente y sostenible.
                </p>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Tu Panel De Análisis
              </h1>
              <p className="text-muted-foreground">
                Monitorea tu consumo, recibe alertas inteligentes y optimiza tu gasto energético en tiempo real
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            <EnergyConsumptionPanel />

            {/* Activity Feed - Centro de Energía Celsia */}
            <ActivityFeed />

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/tarifas" onClick={() => sessionStorage.setItem('fromDashboard', 'true')}>
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <DollarSign className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="font-semibold text-foreground">Mi tarifa</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Consulta desglose de costos y planes alternativos
                  </p>
                  <Button variant="ghost" size="sm" className="w-full">
                    Ver Tarifas <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Card>
              </Link>

              <Link href="/eco-feedback" onClick={() => sessionStorage.setItem('fromDashboard', 'true')}>
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Leaf className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="font-semibold text-foreground">Informe Energía</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Impacto ambiental y prácticas sostenibles
                  </p>
                  <Button variant="ghost" size="sm" className="w-full">
                    Ver Impacto <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Card>
              </Link>

              <Link href="/mapa-cortes" onClick={() => sessionStorage.setItem('fromDashboard', 'true')}>
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <MapPin className="h-5 w-5 text-red-500" />
                    </div>
                    <h3 className="font-semibold text-foreground">Estado Servicio</h3>
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

