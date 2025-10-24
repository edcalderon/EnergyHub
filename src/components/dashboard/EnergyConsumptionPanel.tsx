import { Activity, TrendingDown, TrendingUp, Zap, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EnergyConsumptionPanel() {
  // Mock data for energy consumption
  const mockData = {
    currentConsumption: 1247,
    previousConsumption: 1156,
    projectedCost: 13680000,
    dailyConsumption: [45, 38, 52, 48, 65, 72, 68, 55, 62, 58, 70, 75, 82, 78, 85, 80, 72, 68, 75, 70, 65, 58, 52, 48],
    weeklyConsumption: [
      { day: "Lun", value: 85, cost: 125000 },
      { day: "Mar", value: 78, cost: 115000 },
      { day: "Mié", value: 92, cost: 135000 },
      { day: "Jue", value: 88, cost: 130000 },
      { day: "Vie", value: 75, cost: 110000 },
      { day: "Sáb", value: 45, cost: 66000 },
      { day: "Dom", value: 38, cost: 56000 }
    ],
    monthlyConsumption: [
      { month: "Jul", value: 72, cost: 1050000 },
      { month: "Ago", value: 85, cost: 1250000 },
      { month: "Sep", value: 68, cost: 1000000 },
      { month: "Oct", value: 78, cost: 1150000 },
      { month: "Nov", value: 82, cost: 1200000 },
      { month: "Dic", value: 95, cost: 1400000 }
    ],
    peakHours: [18, 19, 20, 21],
    offPeakHours: [1, 2, 3, 4, 5, 6],
    efficiency: 87.5,
    savings: 156000
  };

  const percentageChange = ((mockData.currentConsumption - mockData.previousConsumption) / mockData.previousConsumption) * 100;

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Consumo Actual</p>
                <p className="text-3xl font-bold text-foreground">{mockData.currentConsumption}</p>
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
                <p className="text-sm text-muted-foreground mb-1">Eficiencia</p>
                <p className="text-3xl font-bold text-foreground">{mockData.efficiency}%</p>
                <p className="text-xs text-muted-foreground mt-1">Promedio del sistema</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ahorro Mensual</p>
                <p className="text-3xl font-bold text-foreground">${mockData.savings.toLocaleString('es-CO')}</p>
                <p className="text-xs text-muted-foreground mt-1">COP ahorrados</p>
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
              {/* Enhanced bar chart with peak hours highlighting */}
              <div className="h-48 sm:h-64 flex items-end justify-between gap-1 sm:gap-2">
                {mockData.dailyConsumption.map((value, index) => {
                  const isPeakHour = mockData.peakHours.includes(index);
                  const isOffPeakHour = mockData.offPeakHours.includes(index);
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-t transition-all cursor-pointer ${
                          isPeakHour 
                            ? 'bg-gradient-to-t from-red-500 to-red-400 hover:from-red-600 hover:to-red-500' 
                            : isOffPeakHour 
                            ? 'bg-gradient-to-t from-green-500 to-green-400 hover:from-green-600 hover:to-green-500'
                            : 'bg-gradient-to-t from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500'
                        }`}
                        style={{ height: `${value}%` }}
                        title={`${value} kWh - ${index}:00`}
                      />
                      {index % 4 === 0 && <span className="text-xs text-muted-foreground">{index}h</span>}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Horas Pico</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Horas Valle</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Horas Normales</span>
                </div>
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
                {mockData.weeklyConsumption.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer"
                      style={{ height: `${item.value}%` }}
                      title={`${item.value} kWh - $${item.cost.toLocaleString('es-CO')} COP`}
                    />
                    <span className="text-xs text-muted-foreground font-medium">{item.day}</span>
                    <span className="text-xs text-muted-foreground">${item.cost.toLocaleString('es-CO')}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground">Total Semanal</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {mockData.weeklyConsumption.reduce((sum, item) => sum + item.value, 0)} kWh
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground">Costo Total</p>
                  <p className="text-2xl font-bold text-green-500">
                    ${mockData.weeklyConsumption.reduce((sum, item) => sum + item.cost, 0).toLocaleString('es-CO')} COP
                  </p>
                </div>
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
                {mockData.monthlyConsumption.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer"
                      style={{ height: `${item.value}%` }}
                      title={`${item.value} kWh - $${item.cost.toLocaleString('es-CO')} COP`}
                    />
                    <span className="text-xs text-muted-foreground font-medium">{item.month}</span>
                    <span className="text-xs text-muted-foreground">${(item.cost / 1000000).toFixed(1)}M</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm font-medium text-foreground">Promedio Mensual</p>
                  <p className="text-xl font-bold text-blue-500">
                    {Math.round(mockData.monthlyConsumption.reduce((sum, item) => sum + item.value, 0) / mockData.monthlyConsumption.length)} kWh
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm font-medium text-foreground">Costo Promedio</p>
                  <p className="text-xl font-bold text-green-500">
                    ${Math.round(mockData.monthlyConsumption.reduce((sum, item) => sum + item.cost, 0) / mockData.monthlyConsumption.length).toLocaleString('es-CO')} COP
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm font-medium text-foreground">Tendencia</p>
                  <p className="text-xl font-bold text-orange-500">
                    <TrendingUp className="h-5 w-5 inline mr-1" />
                    +12.5%
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}