import { Activity, TrendingDown, TrendingUp, Zap, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EnergyConsumptionPanel() {
  const currentConsumption = 1247;
  const previousConsumption = 1156;
  const percentageChange = ((currentConsumption - previousConsumption) / previousConsumption) * 100;
  const projectedCost = 13680000;

  return (
    <Card className="bg-card border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Activity className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Consumo Energético</h2>
              <p className="text-sm text-muted-foreground">Análisis y proyecciones en tiempo real</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Exportar Datos
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Current Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Consumo Actual</p>
                <p className="text-3xl font-bold text-foreground">{currentConsumption}</p>
                <p className="text-xs text-muted-foreground mt-1">kWh este mes</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Variación</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-foreground">{percentageChange.toFixed(1)}%</p>
                  {percentageChange > 0 ? (
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">vs. mes anterior</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Proyección Mensual</p>
                <p className="text-3xl font-bold text-foreground">${projectedCost.toLocaleString('es-CO')} COP</p>
                <p className="text-xs text-muted-foreground mt-1">Estimado de gasto</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="daily">Diario</TabsTrigger>
            <TabsTrigger value="weekly">Semanal</TabsTrigger>
            <TabsTrigger value="monthly">Mensual</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Consumo por hora</span>
                <Badge variant="outline">Últimas 24h</Badge>
              </div>
              {/* Simulated bar chart */}
              <div className="h-48 sm:h-64 flex items-end justify-between gap-1 sm:gap-2">
                {[45, 38, 52, 48, 65, 72, 68, 55, 62, 58, 70, 75, 82, 78, 85, 80, 72, 68, 75, 70, 65, 58, 52, 48].map(
                  (value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer"
                        style={{ height: `${value}%` }}
                        title={`${value} kWh`}
                      />
                      {index % 4 === 0 && <span className="text-xs text-muted-foreground">{index}h</span>}
                    </div>
                  )
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Consumo por día</span>
                <Badge variant="outline">Esta semana</Badge>
              </div>
              <div className="h-48 sm:h-64 flex items-end justify-between gap-2 sm:gap-4">
                {[
                  { day: "Lun", value: 85 },
                  { day: "Mar", value: 78 },
                  { day: "Mié", value: 92 },
                  { day: "Jue", value: 88 },
                  { day: "Vie", value: 75 },
                  { day: "Sáb", value: 45 },
                  { day: "Dom", value: 38 },
                ].map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer"
                      style={{ height: `${item.value}%` }}
                      title={`${item.value} kWh`}
                    />
                    <span className="text-xs text-muted-foreground font-medium">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Comparativa mensual</span>
                <Badge variant="outline">Últimos 6 meses</Badge>
              </div>
              <div className="h-48 sm:h-64 flex items-end justify-between gap-2 sm:gap-4">
                {[
                  { month: "Jul", value: 72 },
                  { month: "Ago", value: 85 },
                  { month: "Sep", value: 68 },
                  { month: "Oct", value: 78 },
                  { month: "Nov", value: 82 },
                  { month: "Dic", value: 95 },
                ].map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer"
                      style={{ height: `${item.value}%` }}
                      title={`${item.value} kWh`}
                    />
                    <span className="text-xs text-muted-foreground font-medium">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}