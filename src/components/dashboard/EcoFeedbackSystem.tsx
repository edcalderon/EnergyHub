import { Leaf, TreePine, Droplets, Wind, Target, TrendingDown, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { generateEcoFeedbackPDF, EcoFeedbackData } from "@/lib/pdf-generator";

interface EcoMetric {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  color: string;
  bgColor: string;
}

const ecoMetrics: EcoMetric[] = [
  {
    icon: <Leaf className="h-5 w-5" />,
    label: "CO₂ Emitido",
    value: "2.4",
    unit: "toneladas/mes",
    color: "text-green-600",
    bgColor: "bg-green-500/10",
  },
  {
    icon: <TreePine className="h-5 w-5" />,
    label: "Árboles Equivalentes",
    value: "112",
    unit: "árboles necesarios",
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: <Droplets className="h-5 w-5" />,
    label: "Agua Virtual",
    value: "1,850",
    unit: "litros/mes",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: <Wind className="h-5 w-5" />,
    label: "Huella de Carbono",
    value: "3.2",
    unit: "kg CO₂/kWh",
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
  },
];

interface Suggestion {
  title: string;
  description: string;
  impact: string;
  difficulty: "Fácil" | "Media" | "Difícil";
}

const suggestions: Suggestion[] = [
  {
    title: "Instalar Iluminación LED",
    description: "Reemplazar luminarias tradicionales por tecnología LED de alta eficiencia",
    impact: "Reducción del 40% en consumo de iluminación",
    difficulty: "Fácil",
  },
  {
    title: "Optimizar Climatización",
    description: "Ajustar termostatos y programar horarios de operación según ocupación",
    impact: "Ahorro de hasta $1,400,000 COP/mes",
    difficulty: "Fácil",
  },
  {
    title: "Energía Solar Fotovoltaica",
    description: "Instalar paneles solares para autoconsumo y reducir dependencia de la red",
    impact: "Reducción del 60% en factura eléctrica",
    difficulty: "Difícil",
  },
];

export default function EcoFeedbackSystem() {
  const sustainabilityGoal = 65;
  const currentProgress = 42;
  const monthlySavings = 156000; // COP
  const energyEfficiency = 87.5;
  const peakHoursReduction = 15;
  const offPeakHoursIncrease = 22;

  const handleDownloadPDF = () => {
    const ecoData: EcoFeedbackData = {
      co2Emitted: 2.4,
      treesEquivalent: 112,
      virtualWater: 1850,
      carbonFootprint: 3.2,
      sustainabilityGoal,
      currentProgress,
      monthlySavings,
      energyEfficiency,
      peakHoursReduction,
      offPeakHoursIncrease,
      recommendations: suggestions
    };
    
    generateEcoFeedbackPDF(ecoData);
  };

  return (
    <Card className="bg-card border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Leaf className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Sistema de Eco-Feedback</h2>
              <p className="text-sm text-muted-foreground">Impacto ambiental y prácticas sostenibles</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1 bg-green-500/10 text-green-700 border-green-500/20">
              <TrendingDown className="h-3 w-3" />
              -12% este mes
            </Badge>
            <Button 
              onClick={handleDownloadPDF}
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Environmental Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ecoMetrics.map((metric, index) => (
            <Card key={index} className={`p-4 ${metric.bgColor} border-0`}>
              <div className="space-y-2">
                <div className={`${metric.color}`}>{metric.icon}</div>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.unit}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Energy Behavior Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-blue-500/10 border-blue-500/20">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-foreground">Eficiencia Energética</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{energyEfficiency}%</p>
              <p className="text-xs text-muted-foreground">Índice de eficiencia actual</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-orange-500/10 border-orange-500/20">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-foreground">Reducción Horas Pico</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{peakHoursReduction}%</p>
              <p className="text-xs text-muted-foreground">Menos consumo en horas pico</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-green-500/10 border-green-500/20">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-foreground">Aumento Horas Valle</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{offPeakHoursIncrease}%</p>
              <p className="text-xs text-muted-foreground">Más consumo en horas valle</p>
            </div>
          </Card>
        </div>

        {/* Sustainability Goal */}
        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-600/5 border-green-500/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-foreground">Meta de Sostenibilidad 2024</h3>
              </div>
              <Badge variant="secondary">{currentProgress}% completado</Badge>
            </div>
            <Progress value={currentProgress} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Reducir emisiones en {sustainabilityGoal}%</span>
              <span className="font-semibold text-green-600">Faltan {sustainabilityGoal - currentProgress}%</span>
            </div>
          </div>
        </Card>

        {/* Savings Summary */}
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-600/5 border-blue-500/20">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-foreground">Ahorros Alcanzados</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Ahorro mensual</p>
                <p className="text-2xl font-bold text-foreground">${monthlySavings.toLocaleString('es-CO')} COP</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reducción de emisiones</p>
                <p className="text-2xl font-bold text-green-600">-12% este mes</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Sustainable Practices Suggestions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Leaf className="h-4 w-4 text-green-600" />
            Sugerencias de Prácticas Sostenibles
          </h3>

          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-all">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">{suggestion.title}</h4>
                        <Badge
                          variant={
                            suggestion.difficulty === "Fácil"
                              ? "secondary"
                              : suggestion.difficulty === "Media"
                              ? "default"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {suggestion.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">{suggestion.impact}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Más Detalles
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="p-4 bg-blue-500/5 border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground mb-1">¿Listo para actuar?</h4>
              <p className="text-sm text-muted-foreground">
                Implementa estas prácticas y reduce tu huella de carbono hasta un 45%
              </p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">Comenzar Ahora</Button>
          </div>
        </Card>
      </div>
    </Card>
  );
}