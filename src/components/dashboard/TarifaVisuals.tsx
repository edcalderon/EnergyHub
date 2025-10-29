"use client";

import ReactECharts from "echarts-for-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const months = [
  "mar-25",
  "abr-25",
  "may-25",
  "jun-25",
  "jul-25",
  "ago-25",
  "sep-25",
  "oct-25",
  "nov-25",
  "dic-25",
];

const seriesData = {
  G: [373.75, 375.78, 382.52, 381.5, 381.34, 396.42, 397.59, 397.41, 394.07, 400.22],
  T: [52.32, 52.61, 53.55, 53.41, 53.39, 55.5, 55.66, 55.64, 55.17, 56.03],
  D: [175.84, 176.79, 179.96, 179.48, 179.41, 186.5, 187.05, 186.97, 185.4, 188.29],
  C: [171.54, 172.47, 175.57, 175.1, 175.03, 181.95, 182.48, 182.4, 180.87, 183.69],
  Perdidas: [69.82, 70.19, 71.45, 71.26, 71.23, 74.05, 74.27, 74.23, 73.61, 74.76],
  Otros: [22.15, 22.27, 22.67, 22.61, 22.6, 23.49, 23.56, 23.55, 23.36, 23.72],
};

const colors = {
  G: "#1f77b4",
  T: "#ff7f0e",
  D: "#2ca02c",
  C: "#17becf",
  Perdidas: "#9467bd",
  Otros: "#8c564b",
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
    legend: { bottom: 10 },
    series: [
      {
        name: "Composición",
        type: "pie",
        radius: ["55%", "80%"],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: "#fff", borderWidth: 2 },
        label: { 
          show: true, 
          position: "outside",
          formatter: "{b}\n{d}%",
          fontSize: 10,
          fontWeight: "bold",
          distance: 15,
          alignTo: "edge",
          edgeDistance: 10,
          bleedMargin: 5,
          minShowLabelAngle: 10
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10,
          smooth: true
        },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: "bold" } },
        data: parts.map((p) => ({ 
          value: p.value, 
          name: p.name, 
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
  const totalValues = months.map((_, index) => 
    Object.values(seriesData).reduce((sum, arr) => sum + arr[index], 0)
  );

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
      lineStyle: { width: 3, color: "#ff7f0e" },
      itemStyle: { color: "#ff7f0e" },
      data: totalValues,
    }],
  } as any;

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Evolución de la Tarifa</h3>
      <Tabs defaultValue="componentes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="componentes">Evolución por Componentes</TabsTrigger>
          <TabsTrigger value="tarifa">Evolución de la Tarifa</TabsTrigger>
        </TabsList>
        <TabsContent value="componentes" className="mt-4">
          <ReactECharts option={componentOption} style={{ height: 320 }} />
        </TabsContent>
        <TabsContent value="tarifa" className="mt-4">
          <ReactECharts option={tariffOption} style={{ height: 320 }} />
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
    Otros: 3.72,
  };
  const total = Object.values(dec).reduce((s, v) => s + v, 0);

  const rows = Object.entries(dec).map(([k, v]) => ({
    k,
    v,
    p: (v / total) * 100,
  }));

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3">Tarifa vigente — dic-25</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="py-2 pr-3">Componente</th>
              <th className="py-2 pr-3">Valor ($/kWh)</th>
              <th className="py-2">Participación</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.k} className="border-t">
                <td className="py-2 pr-3 flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: (colors as any)[r.k as keyof typeof colors] }} />
                  {r.k}
                </td>
                <td className="py-2 pr-3">$ {r.v.toFixed(2)}</td>
                <td className="py-2">{r.p.toFixed(2)}%</td>
              </tr>
            ))}
            <tr className="border-t font-semibold">
              <td className="py-2 pr-3">Tarifa</td>
              <td className="py-2 pr-3">$ {total.toFixed(2)}</td>
              <td className="py-2">100.00%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}


