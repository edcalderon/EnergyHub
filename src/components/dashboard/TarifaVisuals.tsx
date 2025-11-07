"use client";

import ReactECharts from "echarts-for-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const months = [
  "mar-25",
  "abr-25",
  "may-25",
  "jun-25",
  "jul-25",
  "ago-25",
  "sept-25",
  "oct-25",
  "nov-25",
  "dic-25",
];

const seriesData = {
  G: [373.75, 375.78, 382.52, 381.50, 381.34, 396.42, 397.59, 397.41, 394.07, 400.22],
  T: [52.32, 52.61, 53.55, 53.41, 53.39, 55.50, 55.66, 55.64, 55.17, 56.03],
  D: [175.84, 176.79, 179.96, 179.48, 179.41, 186.50, 187.05, 186.97, 185.40, 188.29],
  C: [171.54, 172.47, 175.57, 175.10, 175.03, 181.95, 182.48, 182.40, 180.87, 183.69],
  Perdidas: [69.82, 70.19, 71.45, 71.26, 71.23, 74.05, 74.27, 74.23, 73.61, 74.76],
  Otros: [22.15, 22.27, 22.67, 22.61, 22.60, 23.49, 23.56, 23.55, 23.36, 23.72],
};

// Tariff totals for each month
const tariffTotals = [865.42, 870.12, 885.73, 883.36, 883.00, 917.91, 920.63, 920.20, 912.47, 926.71];

const colors = {
  G: "#1f77b4",
  T: "#ff7f0e",
  D: "#2ca02c",
  C: "#17becf",
  Perdidas: "#9467bd",
  Otros: "#8c564b",
};

const componentNames: Record<string, string> = {
  G: "Generación",
  T: "Transmisión",
  D: "Distribución",
  C: "Comercialización",
  Perdidas: "Pérdidas",
  Otros: "Otros",
};

const componentNotes: Record<string, string> = {
  G: "Indexado parcialmente al IPP y variación del precio de bolsa",
  T: "Ajuste regulado anual, pero se refleja mensualmente",
  D: "Indexado al IPP, leve variación mensual",
  C: "Estable, depende de costos operativos",
  Perdidas: "Variación técnica reconocida",
  Otros: "Restricciones, CREG, SIC, contribuciones",
};

export function TarifaLineChart() {
  const option = {
    tooltip: { trigger: "axis" },
    legend: { data: Object.keys(seriesData) },
    grid: { left: 40, right: 20, top: 40, bottom: 40 },
    xAxis: { type: "category", data: months },
    yAxis: { type: "value", name: "$ / kWh" },
    series: Object.entries(seriesData).map(([name, data]) => ({
      name,
      type: "line",
      smooth: true,
      symbol: "circle",
      lineStyle: { width: 2, color: (colors as any)[name] },
      itemStyle: { color: (colors as any)[name] },
      data,
    })),
  } as any;

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Evolución Componentes de la Tarifa</h3>
      <ReactECharts option={option} style={{ height: 320 }} />
    </Card>
  );
}

export function TarifaPie() {
  const lastIdx = months.length - 1;
  const parts = Object.entries(seriesData).map(([name, arr]) => ({ name, value: arr[lastIdx] }));
  const total = parts.reduce((s, p) => s + p.value, 0);

  const option = {
    tooltip: { trigger: "item", formatter: "{b}: {c} ($ {d}%)" },
    legend: { 
      show: false
    },
    series: [
      {
        name: "Composición",
        type: "pie",
        radius: ["50%", "75%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: "#fff", borderWidth: 2 },
        label: { 
          show: true, 
          position: "outside",
          formatter: "{b}\n{d}%",
          fontSize: 11,
          fontWeight: "bold",
          distance: 25,
          alignTo: "labelLine",
          edgeDistance: 5,
          bleedMargin: 10,
          minShowLabelAngle: 15,
          rich: {
            name: {
              fontSize: 11,
              fontWeight: "bold",
              lineHeight: 16
            },
            percent: {
              fontSize: 10,
              fontWeight: "normal"
            }
          }
        },
        labelLine: {
          show: true,
          length: 20,
          length2: 15,
          smooth: 0.3,
          lineStyle: {
            width: 1.5,
            type: "solid"
          }
        },
        emphasis: { 
          label: { 
            show: true, 
            fontSize: 13, 
            fontWeight: "bold",
            distance: 30
          },
          labelLine: {
            length: 25,
            length2: 18
          }
        },
        data: parts.map((p) => ({ 
          value: p.value, 
          name: componentNames[p.name] || p.name, 
          itemStyle: { color: (colors as any)[p.name] } 
        })),
      },
    ],
    graphic: [
      {
        type: "text",
        left: "center",
        top: "45%",
        style: {
          text: `CU estimado\n$ ${(total).toFixed(2)} / kWh`,
          textAlign: "center",
          fill: "#64748b",
          fontSize: 14,
          fontWeight: 600,
        },
      },
    ],
  } as any;

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Composición estimada</h3>
      <ReactECharts option={option} style={{ height: 320 }} />
      <p className="text-xs text-muted-foreground text-center">
        Valores de ejemplo para UI. Conectar a API en producción.
      </p>
    </Card>
  );
}

export function TarifaEvolutionTabs() {
  const lastIdx = months.length - 1;
  // Use actual tariff totals from data
  const totalValues = tariffTotals;

  const componentOption = {
    tooltip: { trigger: "axis" },
    legend: { data: Object.keys(seriesData) },
    grid: { left: 40, right: 20, top: 40, bottom: 40 },
    xAxis: { type: "category", data: months },
    yAxis: { type: "value", name: "$ / kWh" },
    series: Object.entries(seriesData).map(([name, data]) => ({
      name,
      type: "line",
      smooth: true,
      symbol: "circle",
      symbolSize: 6,
      lineStyle: { width: 2, color: (colors as any)[name] },
      itemStyle: { color: (colors as any)[name] },
      data,
    })),
  } as any;

  const tariffOption = {
    tooltip: { trigger: "axis" },
    legend: { data: ["Tarifa"] },
    grid: { left: 40, right: 20, top: 40, bottom: 40 },
    xAxis: { type: "category", data: months },
    yAxis: { 
      type: "value", 
      name: "$ / kWh",
      min: 800,
      max: 1000,
      interval: 20
    },
    series: [{
      name: "Tarifa",
      type: "line",
      smooth: true,
      symbol: "circle",
      symbolSize: 8,
      lineStyle: { width: 3, color: "#ff7f0e" },
      itemStyle: { color: "#ff7f0e" },
      data: totalValues,
    }],
  } as any;

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Evolución de la Tarifa</h3>
      <Tabs defaultValue="tarifa" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tarifa">Evolución de la Tarifa</TabsTrigger>
          <TabsTrigger value="componentes">Evolución por Componentes</TabsTrigger>
        </TabsList>
        <TabsContent value="tarifa" className="mt-4">
          <ReactECharts option={tariffOption} style={{ height: 320 }} />
        </TabsContent>
        <TabsContent value="componentes" className="mt-4">
          <ReactECharts option={componentOption} style={{ height: 320 }} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export function TarifaVigenteTabla() {
  const dec = {
    G: 400.22,
    T: 56.03,
    D: 188.29,
    C: 183.69,
    Perdidas: 74.76,
    Otros: 23.72,
  };
  const total = 926.71; // Tarifa total de dic-25
  
  // Use actual percentages from data
  const percentages: Record<string, number> = {
    G: 43.19,
    T: 6.05,
    D: 20.32,
    C: 19.82,
    Perdidas: 8.07,
    Otros: 2.56,
  };

  // Growth vs previous month data
  const growthData: Record<string, number> = {
    G: 1.5,
    T: 0.3,
    D: 0.6,
    C: 0.4,
    Perdidas: 0.5,
    Otros: 0.8,
  };
  const totalGrowth = 1.6;

  const rows = Object.entries(dec).map(([k, v]) => ({
    k,
    v,
    p: percentages[k] || (v / total) * 100,
    growth: growthData[k] || 0,
  }));

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 text-lg">Tarifa vigente — dic-25</h3>
      <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary/10 text-primary text-xs mr-1">i</span>
        Pasa el cursor sobre cada fila para ver más detalles
      </div>
      <TooltipProvider delayDuration={50}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-center text-muted-foreground border-b">
                <th className="py-3 px-2 font-medium text-left w-1/4">Componente</th>
                <th className="py-3 px-2 font-medium w-1/4">Valor ($/kWh)</th>
                <th className="py-3 px-2 font-medium w-1/4">Participación</th>
                <th className="py-3 px-2 font-medium w-1/4">Crecimiento vs mes anterior</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <Tooltip key={r.k}>
                  <TooltipTrigger asChild>
                    <tr className="border-b cursor-help hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <span 
                            className="inline-block w-3 h-3 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: (colors as any)[r.k as keyof typeof colors] }} 
                          />
                          <span className="truncate">{componentNames[r.k] || r.k}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">$ {r.v.toFixed(2)}</td>
                      <td className="py-3 px-2 text-center">{r.p.toFixed(2)}%</td>
                      <td className="py-3 px-2 text-center">
                        <span className={`${r.growth > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                          {r.growth > 0 ? '↑' : '↓'} {Math.abs(r.growth).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  </TooltipTrigger>
                  {componentNotes[r.k] && (
                    <TooltipContent 
                      side="top" 
                      align="start"
                      className="max-w-xs bg-foreground text-background p-3 text-sm rounded-lg shadow-lg border border-border/50"
                      sideOffset={5}
                    >
                      <div className="font-semibold mb-1.5 text-background">{componentNames[r.k] || r.k}</div>
                      <p className="text-background/90">{componentNotes[r.k]}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
              <Tooltip>
                <TooltipTrigger asChild>
                  <tr className="border-t-2 border-primary/20 font-semibold bg-muted/20 hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-full bg-primary/80" />
                        <span>Tarifa Total</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center font-bold">$ {total.toFixed(2)}</td>
                    <td className="py-3 px-2 text-center">100.00%</td>
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-flex items-center justify-center min-w-[60px] px-2 py-1 rounded-full text-xs ${
                        totalGrowth > 0 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/80 dark:text-red-100' 
                          : 'bg-green-100 text-green-700 dark:bg-green-900/80 dark:text-green-100'
                      }`}>
                        {totalGrowth > 0 ? '↑' : '↓'} {Math.abs(totalGrowth).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  align="start"
                  className="max-w-xs bg-foreground text-background p-3 text-sm rounded-lg shadow-lg border border-border/50"
                  sideOffset={5}
                >
                  <div className="font-semibold mb-1.5 text-background">Tarifa Total</div>
                  <p className="text-background/90">Resultado ponderado de todos los componentes de la tarifa</p>
                </TooltipContent>
              </Tooltip>
            </tbody>
          </table>
        </div>
      </TooltipProvider>
    </Card>
  );
}


