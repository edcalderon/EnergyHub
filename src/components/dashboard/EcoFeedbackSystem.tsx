"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Leaf, TrendingDown, TrendingUp, Download, CheckCircle, AlertTriangle, Lightbulb, Calendar, DollarSign, TreePine, Cloud, Info, Car, Zap, Home, ArrowUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { generateEcoFeedbackPDF, EcoFeedbackData } from "@/lib/pdf-generator";
import ReactECharts from 'echarts-for-react';
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast";

// Mock data for monthly consumption (last 36 months for 3 years comparison)
const monthlyConsumptionData = [
  { month: "Ene 2023", value: 4450 },
  { month: "Feb 2023", value: 4650 },
  { month: "Mar 2023", value: 3850 },
  { month: "Abr 2023", value: 4100 },
  { month: "May 2023", value: 4300 },
  { month: "Jun 2023", value: 4550 },
  { month: "Jul 2023", value: 6700 },
  { month: "Ago 2023", value: 6400 },
  { month: "Sep 2023", value: 5100 },
  { month: "Oct 2023", value: 4750 },
  { month: "Nov 2023", value: 4350 },
  { month: "Dic 2023", value: 4300 },
  { month: "Ene 2024", value: 4250 },
  { month: "Feb 2024", value: 4450 },
  { month: "Mar 2024", value: 3650 },
  { month: "Abr 2024", value: 3900 },
  { month: "May 2024", value: 4100 },
  { month: "Jun 2024", value: 4350 },
  { month: "Jul 2024", value: 6500 },
  { month: "Ago 2024", value: 6200 },
  { month: "Sep 2024", value: 4900 },
  { month: "Oct 2024", value: 4550 },
  { month: "Nov 2024", value: 4150 },
  { month: "Dic 2024", value: 4100 },
  { month: "Ene 2025", value: 3950 },
  { month: "Feb 2025", value: 4100 },
  { month: "Mar 2025", value: 3420 },
  { month: "Abr 2025", value: 3650 },
  { month: "May 2025", value: 3800 },
  { month: "Jun 2025", value: 4050 },
  { month: "Jul 2025", value: 6150 },
  { month: "Ago 2025", value: 5800 },
  { month: "Sep 2025", value: 4500 },
  { month: "Oct 2025", value: 4200 },
  { month: "Nov 2025", value: 3900 },
  { month: "Dic 2025", value: 3850 },
];

// Colors for consumption chart
const CHART_COLORS = {
  highest: '#ff7f0e', // Orange for highest consumption
  lowest: '#10b981', // Softer green (less fluorescent) for lowest consumption
  normal: '#9ca3b8', // Gray for normal consumption
};

type PeriodType = '3M' | '6M' | '1A';
type YearType = '1er' | '2do' | '3er';

// Calculate trend for a specific period
const calculatePeriodTrend = (data: typeof monthlyConsumptionData, period: PeriodType) => {
  const periodMonths = period === '3M' ? 3 : period === '6M' ? 6 : 12;
  
  if (data.length < periodMonths * 2) {
    // Not enough data for comparison
    return {
      trend: 0,
      currentAvg: 0,
      previousAvg: 0,
      periodLabel: period === '3M' ? '3 meses' : period === '6M' ? '6 meses' : '1 año',
      periodMonths
    };
  }
  
  const currentPeriod = data.slice(-periodMonths);
  const previousPeriod = data.slice(-periodMonths * 2, -periodMonths);
  
  const currentAvg = currentPeriod.reduce((sum, item) => sum + item.value, 0) / periodMonths;
  const previousAvg = previousPeriod.reduce((sum, item) => sum + item.value, 0) / periodMonths;
  
  const trend = previousAvg > 0 ? ((currentAvg - previousAvg) / previousAvg) * 100 : 0;
  
  return {
    trend,
    currentAvg,
    previousAvg,
    periodLabel: period === '3M' ? '3 meses' : period === '6M' ? '6 meses' : '1 año',
    periodMonths
  };
};

// Calculate year-over-year variation for a specific year offset
const calculateYoYVariation = (data: typeof monthlyConsumptionData, yearOffset: YearType) => {
  const currentMonth = data[data.length - 1];
  const currentMonthName = currentMonth.month.split(' ')[0];
  
  // Calculate the index offset: 1er = 12 months, 2do = 24 months, 3er = 36 months
  const monthsOffset = yearOffset === '1er' ? 12 : yearOffset === '2do' ? 24 : 36;
  
  if (data.length < monthsOffset + 1) {
    return {
      sameMonthYear: null,
      yoyVariation: 0,
      yearLabel: yearOffset === '1er' ? '1er año' : yearOffset === '2do' ? '2do año' : '3er año'
    };
  }
  
  const sameMonthIndex = data.length - monthsOffset - 1;
  if (sameMonthIndex >= 0) {
    const candidateMonth = data[sameMonthIndex];
    // Verify it's the same month name
    if (candidateMonth.month.startsWith(currentMonthName)) {
      const yoyVariation = candidateMonth.value > 0 
        ? ((currentMonth.value - candidateMonth.value) / candidateMonth.value) * 100 
        : 0;
      
      return {
        sameMonthYear: candidateMonth,
        yoyVariation,
        yearLabel: yearOffset === '1er' ? '1er año' : yearOffset === '2do' ? '2do año' : '3er año'
      };
    }
  }
  
  return {
    sameMonthYear: null,
    yoyVariation: 0,
    yearLabel: yearOffset === '1er' ? '1er año' : yearOffset === '2do' ? '2do año' : '3er año'
  };
};

// Calculate all consumption metrics
const calculateMetrics = (data: typeof monthlyConsumptionData, selectedPeriod: PeriodType = '3M', selectedYear: YearType = '1er') => {
  const currentMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];
  
  // Calculate YoY variation based on selected year
  const yoyData = calculateYoYVariation(data, selectedYear);
  
  // Calculate average of last 12 months (only current year data)
  const last12Months = data.slice(-12);
  const avgLast12Months = last12Months.reduce((sum, item) => sum + item.value, 0) / last12Months.length;
  
  // Find max and min from all available data
  const maxMonth = data.reduce((max, item) => item.value > max.value ? item : max, data[0]);
  const minMonth = data.reduce((min, item) => item.value < min.value ? item : min, data[0]);
  
  const vsPreviousMonth = previousMonth 
    ? ((currentMonth.value - previousMonth.value) / previousMonth.value) * 100 
    : 0;
  
  // Calculate period trend based on selected period
  const periodTrend = calculatePeriodTrend(data, selectedPeriod);
  
  // Calculate accumulated savings for current year
  const currentYearMonths = data.slice(-12);
  const previousYearMonths = data.length >= 24 ? data.slice(-24, -12) : null;
  const avgHistorical3Years = data.length >= 36 
    ? data.slice(-36).reduce((sum, item) => sum + item.value, 0) / 36 
    : avgLast12Months;
  
  const currentYearTotal = currentYearMonths.reduce((sum, item) => sum + item.value, 0);
  const previousYearTotal = previousYearMonths 
    ? previousYearMonths.reduce((sum, item) => sum + item.value, 0) 
    : currentYearTotal;
  
  const accumulatedSavings = previousYearTotal > 0 
    ? ((previousYearTotal - currentYearTotal) / previousYearTotal) * 100 
    : 0;
  
  const vsHistoricalAverage = avgHistorical3Years > 0
    ? ((avgHistorical3Years - (currentYearTotal / currentYearMonths.length)) / avgHistorical3Years) * 100
    : 0;
  
  return {
    currentMonth: currentMonth.value,
    currentMonthName: currentMonth.month,
    avgLast12Months,
    maxMonth,
    minMonth,
    vsPreviousMonth,
    periodTrend,
    yoyVariation: yoyData.yoyVariation,
    sameMonthLastYear: yoyData.sameMonthYear,
    yoyYearLabel: yoyData.yearLabel,
    accumulatedSavings,
    accumulatedSavingsKWh: previousYearTotal - currentYearTotal,
    vsHistoricalAverage,
    currentYearTotal,
    previousYearTotal
  };
};

// Mock data for hourly consumption distribution (24 hours average)
const hourlyConsumptionData = [
  // Horas de tarifa baja (valle): 00:00 a 05:00 horas
  { hour: 0, value: 120, zone: 'fuera_pico' },
  { hour: 1, value: 100, zone: 'fuera_pico' },
  { hour: 2, value: 95, zone: 'fuera_pico' },
  { hour: 3, value: 90, zone: 'fuera_pico' },
  { hour: 4, value: 110, zone: 'fuera_pico' },
  { hour: 5, value: 130, zone: 'fuera_pico' },
  // Horas de P baja (valle): 06:00 a 18:00 horas
  { hour: 6, value: 180, zone: 'valle' },
  { hour: 7, value: 250, zone: 'valle' },
  { hour: 8, value: 320, zone: 'valle' },
  { hour: 9, value: 380, zone: 'valle' },
  { hour: 10, value: 420, zone: 'valle' },
  { hour: 11, value: 450, zone: 'valle' },
  { hour: 12, value: 480, zone: 'valle' },
  { hour: 13, value: 460, zone: 'valle' },
  { hour: 14, value: 440, zone: 'valle' },
  { hour: 15, value: 420, zone: 'valle' },
  { hour: 16, value: 400, zone: 'valle' },
  { hour: 17, value: 450, zone: 'valle' },
  { hour: 18, value: 500, zone: 'valle' },
  // Horas de P alta (pico): 19:00 a 23:00 horas
  { hour: 19, value: 480, zone: 'pico' },
  { hour: 20, value: 350, zone: 'pico' },
  { hour: 21, value: 280, zone: 'pico' },
  { hour: 22, value: 200, zone: 'pico' },
  { hour: 23, value: 150, zone: 'pico' },
];

// Calculate hourly distribution percentages
const calculateHourlyDistribution = (period: DistributionPeriodType = 'mes') => {
  // For different periods, we can scale the data or use different aggregation
  // For now, we'll use multipliers to simulate different time periods
  let multiplier = 1;
  if (period === 'trimestre') {
    multiplier = 3; // 3 months
  } else if (period === 'año') {
    multiplier = 12; // 12 months
  }
  
  const baseData = hourlyConsumptionData.map(item => ({
    ...item,
    value: item.value * multiplier
  }));
  
  const total = baseData.reduce((sum, item) => sum + item.value, 0);
  const pico = baseData.filter(item => item.zone === 'pico').reduce((sum, item) => sum + item.value, 0);
  const fueraPico = baseData.filter(item => item.zone === 'fuera_pico').reduce((sum, item) => sum + item.value, 0);
  const valle = baseData.filter(item => item.zone === 'valle').reduce((sum, item) => sum + item.value, 0);
  
  return {
    pico: { value: pico, percentage: (pico / total) * 100, kWh: pico },
    fueraPico: { value: fueraPico, percentage: (fueraPico / total) * 100, kWh: fueraPico },
    valle: { value: valle, percentage: (valle / total) * 100, kWh: valle },
    total,
    hourlyData: baseData,
    periodLabel: period === 'mes' ? 'Mes' : period === 'trimestre' ? 'Trimestre' : 'Año'
  };
};

// Generate EcoFeedback messages based on metrics
const generateEcoFeedbackMessages = (metrics: ReturnType<typeof calculateMetrics>, hourlyDist: ReturnType<typeof calculateHourlyDistribution>) => {
  const messages: Array<{ 
    type: 'success' | 'warning' | 'info'; 
    category: 'ahorro' | 'operativo' | 'alerta';
    icon: React.ReactNode; 
    message: string; 
    bgColor: string;
    borderColor: string;
    title: string;
  }> = [];
  
  // ✅ Ahorro y eficiencia: Mensajes que destacan reducciones de consumo
  if (metrics.vsPreviousMonth < -2) {
    messages.push({
      type: 'success',
      category: 'ahorro',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      title: 'Excelente gestión',
      message: `Redujiste tu consumo un ${Math.abs(Math.round(metrics.vsPreviousMonth))}% respecto al mes anterior. Mantén las prácticas actuales.`,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300'
    });
  }
  
  if (metrics.accumulatedSavings > 2) {
    messages.push({
      type: 'success',
      category: 'ahorro',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      title: 'Ahorro acumulado destacable',
      message: `Has reducido tu consumo en ${Math.round(metrics.accumulatedSavings)}%. ¡Felicitaciones por tu avance hacia una operación más eficiente!`,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300'
    });
  }
  
  if (metrics.periodTrend.trend < -2) {
    messages.push({
      type: 'success',
      category: 'ahorro',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      title: 'Tendencia positiva',
      message: `Tu consumo promedio de los últimos ${metrics.periodTrend.periodLabel} bajó ${Math.abs(Math.round(metrics.periodTrend.trend))}%. ¡Excelente gestión energética!`,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300'
    });
  }
  
  if (hourlyDist.valle.percentage > 40) {
    messages.push({
      type: 'success',
      category: 'ahorro',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      title: 'Optimización horaria',
      message: `Excelente gestión. El ${Math.round(hourlyDist.valle.percentage)}% de tu consumo ocurre en horas de bajo costo.`,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300'
    });
  }
  
  // 💡 Consejos operativos: Recomendaciones para optimizar horarios o equipos
  if (hourlyDist.pico.percentage > 60) {
    messages.push({
      type: 'info',
      category: 'operativo',
      icon: <Lightbulb className="h-5 w-5 text-yellow-600" />,
      title: 'Oportunidad de mejora',
      message: `El ${Math.round(hourlyDist.pico.percentage)}% de tu consumo ocurre en horario pico. Reprograma procesos hacia horas valle.`,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300'
    });
  } else if (hourlyDist.pico.percentage < 50 && hourlyDist.valle.percentage < 40) {
    messages.push({
      type: 'info',
      category: 'operativo',
      icon: <Lightbulb className="h-5 w-5 text-yellow-600" />,
      title: 'Distribución equilibrada',
      message: `Tu consumo presenta un equilibrio horario adecuado. Mantén las rutinas actuales.`,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300'
    });
  }
  
  if (Math.abs(metrics.accumulatedSavings) <= 2 && metrics.accumulatedSavings >= 0) {
    messages.push({
      type: 'info',
      category: 'operativo',
      icon: <Lightbulb className="h-5 w-5 text-yellow-600" />,
      title: 'Mantenimiento de eficiencia',
      message: `Tu consumo se mantiene estable (±2%). Revisa horarios o turnos para encontrar nuevas oportunidades de ahorro.`,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300'
    });
  }
  
  if (metrics.periodTrend.trend < -2) {
    const periodText = metrics.periodTrend.periodMonths === 3 ? 'trimestre' : metrics.periodTrend.periodMonths === 6 ? 'semestre' : 'año';
    messages.push({
      type: 'info',
      category: 'operativo',
      icon: <Lightbulb className="h-5 w-5 text-yellow-600" />,
      title: 'Continuidad de buenas prácticas',
      message: `Mantén las buenas prácticas implementadas este ${periodText} para conservar la tendencia de ahorro.`,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300'
    });
  }
  
  // ⚠️ Alertas preventivas: Avisos sobre incrementos inusuales de consumo
  if (metrics.vsPreviousMonth > 2) {
    messages.push({
      type: 'warning',
      category: 'alerta',
      icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
      title: 'Alerta de aumento',
      message: `Tu consumo aumentó un ${Math.round(metrics.vsPreviousMonth)}% frente al mes anterior. Revisa equipos o hábitos de uso.`,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300'
    });
  }
  
  if (metrics.accumulatedSavings < -2) {
    messages.push({
      type: 'warning',
      category: 'alerta',
      icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
      title: 'Incremento acumulado',
      message: `Tu consumo acumulado subió ${Math.abs(Math.round(metrics.accumulatedSavings))}% frente al año anterior. Verifica equipos críticos o procesos de alta demanda.`,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300'
    });
  }
  
  if (metrics.periodTrend.trend > 5) {
    messages.push({
      type: 'warning',
      category: 'alerta',
      icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
      title: 'Tendencia creciente',
      message: `Tu consumo promedio de los últimos ${metrics.periodTrend.periodLabel} subió ${Math.round(metrics.periodTrend.trend)}%. Considera revisar procesos o equipos para identificar causas.`,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300'
    });
  }
  
  // Ordenar mensajes: alertas primero, luego consejos, luego éxitos
  return messages.sort((a, b) => {
    const order = { 'alerta': 0, 'operativo': 1, 'ahorro': 2 };
    return order[a.category] - order[b.category];
  });
};

type DistributionPeriodType = 'mes' | 'trimestre' | 'año';

export default function EcoFeedbackSystem() {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('3M');
  const [selectedYear, setSelectedYear] = useState<YearType>('1er');
  const [showComparison, setShowComparison] = useState(false); // Default to false - only show current year
  const [viewingYear, setViewingYear] = useState<'actual' | 'comparacion'>('actual'); // Qué año se está visualizando en los cards
  const [distributionPeriod, setDistributionPeriod] = useState<DistributionPeriodType>('mes');
  const [savingsChartType, setSavingsChartType] = useState<'gauge' | 'bar'>('gauge');
  const [savingsDisplayType, setSavingsDisplayType] = useState<'percentage' | 'kwh'>('percentage');
  const [highlightMode, setHighlightMode] = useState<'both' | 'highest' | 'lowest'>('both');
  const [savingsViewType, setSavingsViewType] = useState<'gauge' | 'horizontal' | 'vertical' | 'circular'>('gauge');
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [clickedCardIndex, setClickedCardIndex] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const isUserInteractingRef = React.useRef(false);
  const lastScrollTopRef = React.useRef(0);
  const lastInteractionTimeRef = React.useRef(0);
  const scrollDirectionRef = React.useRef<'down' | 'up'>('down'); // Track scroll direction
  const isAutoScrollingRef = React.useRef(false); // Track if we're currently auto-scrolling
  
  // Format number helper function
  const formatNumber = (num: number) => {
    return num.toLocaleString('es-CO', { maximumFractionDigits: 0 });
  };
  
  const handleYearChange = (year: YearType) => {
    // Check if there's enough data for 3rd year (36 months)
    if (year === '3er' && monthlyConsumptionData.length < 37) {
      toast({
        title: "No hay datos disponibles",
        description: "No hay datos suficientes para el 3er año. Se requiere al menos 36 meses de historial.",
        variant: "default",
      });
      return;
    }
    setSelectedYear(year);
    // Don't automatically show comparison - user needs to click on legend or toggle
    // setShowComparison(true);
  };
  
  // Get comparison year data based on selectedYear (moved before metrics calculation)
  const getComparisonYearData = () => {
    const monthsOffset = selectedYear === '1er' ? 12 : selectedYear === '2do' ? 24 : 36;
    if (monthlyConsumptionData.length < monthsOffset + 12) {
      return null;
    }
    return monthlyConsumptionData.slice(-monthsOffset - 12, -monthsOffset);
  };
  
  const comparisonYearData = getComparisonYearData();
  
  const metrics = useMemo(() => calculateMetrics(monthlyConsumptionData, selectedPeriod, selectedYear), [selectedPeriod, selectedYear]);
  
  // Calcular métricas para el año de comparación
  const comparisonMetrics = useMemo(() => {
    if (!comparisonYearData || comparisonYearData.length === 0) {
      return null;
    }
    // Calcular métricas directamente usando los datos del año de comparación
    const comparisonMonth = comparisonYearData[comparisonYearData.length - 1];
    const comparisonPreviousMonth = comparisonYearData.length > 1 ? comparisonYearData[comparisonYearData.length - 2] : null;
    
    const avgComparisonYear = comparisonYearData.reduce((sum, item) => sum + item.value, 0) / comparisonYearData.length;
    
    const maxMonth = comparisonYearData.reduce((max, item) => item.value > max.value ? item : max, comparisonYearData[0]);
    const minMonth = comparisonYearData.reduce((min, item) => item.value < min.value ? item : min, comparisonYearData[0]);
    
    const vsPreviousMonth = comparisonPreviousMonth 
      ? ((comparisonMonth.value - comparisonPreviousMonth.value) / comparisonPreviousMonth.value) * 100 
      : 0;
    
    // Para el period trend, usar los datos de comparación
    const periodTrend = calculatePeriodTrend(comparisonYearData, selectedPeriod);
    
    return {
      currentMonth: comparisonMonth.value,
      currentMonthName: comparisonMonth.month,
      avgLast12Months: avgComparisonYear,
      maxMonth,
      minMonth,
      vsPreviousMonth,
      periodTrend,
      yoyVariation: 0, // No aplicable para año de comparación
      sameMonthLastYear: null,
      yoyYearLabel: metrics.yoyYearLabel,
      accumulatedSavings: 0,
      accumulatedSavingsKWh: 0,
      vsHistoricalAverage: 0,
      currentYearTotal: comparisonYearData.reduce((sum, item) => sum + item.value, 0),
      previousYearTotal: 0
    };
  }, [comparisonYearData, selectedPeriod, metrics.yoyYearLabel]);
  
  // Métricas a mostrar según el año seleccionado
  const displayMetrics = viewingYear === 'comparacion' && comparisonMetrics ? comparisonMetrics : metrics;
  
  const hourlyDistribution = useMemo(() => calculateHourlyDistribution(distributionPeriod), [distributionPeriod]);
  
  const ecoFeedbackMessages = useMemo(() => generateEcoFeedbackMessages(metrics, hourlyDistribution), [metrics, hourlyDistribution]);
  
  // Environmental impact equivalents
  const environmentalImpacts = useMemo(() => {
    const co2Tons = (Math.abs(metrics.accumulatedSavingsKWh) * 0.408) / 1000;
    const trees = Math.round(Math.abs(metrics.accumulatedSavingsKWh) * 0.022);
    const cars = Math.round(co2Tons / 4.6); // 1 ton CO2 ≈ 4.6 months of car driving
    const homes = Math.round(Math.abs(metrics.accumulatedSavingsKWh) / 10000); // Average home uses ~10,000 kWh/year
    const phones = Math.round(Math.abs(metrics.accumulatedSavingsKWh) * 1000); // 1 kWh ≈ 1000 phone charges
    const ledBulbs = Math.round(Math.abs(metrics.accumulatedSavingsKWh) / 0.01); // 1 kWh ≈ 100 hours of LED bulb
    
    return [
      {
        icon: <Leaf className="h-5 w-5 text-green-600" />,
        text: `Tu ahorro evitó ${co2Tons.toFixed(1)} t CO₂ ≈ ${trees} árboles.`,
        color: 'text-green-600'
      },
      {
        icon: <Car className="h-5 w-5 text-blue-600" />,
        text: `Equivale a ${formatNumber(cars)} meses sin conducir un auto promedio.`,
        color: 'text-blue-600'
      },
      {
        icon: <Home className="h-5 w-5 text-purple-600" />,
        text: `Equivale al consumo energético de ${formatNumber(homes)} hogares durante un mes.`,
        color: 'text-purple-600'
      },
      {
        icon: <Zap className="h-5 w-5 text-yellow-600" />,
        text: `Equivale a cargar ${formatNumber(phones)} teléfonos móviles.`,
        color: 'text-yellow-600'
      },
      {
        icon: <Lightbulb className="h-5 w-5 text-orange-600" />,
        text: `Equivale a ${formatNumber(ledBulbs)} horas de iluminación LED.`,
        color: 'text-orange-600'
      },
      {
        icon: <TreePine className="h-5 w-5 text-emerald-600" />,
        text: `Equivale a plantar ${formatNumber(trees)} árboles que crecen durante 10 años.`,
        color: 'text-emerald-600'
      },
      {
        icon: <Cloud className="h-5 w-5 text-sky-600" />,
        text: `Equivale a eliminar ${formatNumber(Math.round(co2Tons * 100))} kg de CO₂ de la atmósfera.`,
        color: 'text-sky-600'
      },
      {
        icon: <Leaf className="h-5 w-5 text-green-600" />,
        text: `Equivale a ${formatNumber(Math.round(co2Tons * 2.2))} kg de carbono almacenado.`,
        color: 'text-green-600'
      }
    ];
  }, [metrics.accumulatedSavingsKWh, formatNumber]);
  
  // Initialize scroll position - only manual scroll, no auto-scroll
  useEffect(() => {
    if (!scrollContainerRef.current || environmentalImpacts.length === 0) return;
    
    const cardHeight = 92; // Height of each card including gap
    const totalHeight = cardHeight * environmentalImpacts.length;
    const startOffset = totalHeight; // Start in the middle (duplicated section)
    
    // Initialize scroll position to the middle (start of duplicated section)
    if (scrollContainerRef.current.scrollTop === 0 || scrollContainerRef.current.scrollTop < totalHeight) {
      scrollContainerRef.current.scrollTop = startOffset;
      lastScrollTopRef.current = startOffset;
    }
    
    // Clear any existing auto-scroll interval
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
    
    // Disable auto-scroll completely - only manual scroll
    isAutoScrollingRef.current = false;
    isUserInteractingRef.current = false;
    
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, [environmentalImpacts.length]);
  
  // Handle manual scroll - make it circular (no auto-scroll interference)
  const handleScroll = () => {
    if (!scrollContainerRef.current || environmentalImpacts.length === 0) return;
    
    const currentScrollTop = scrollContainerRef.current.scrollTop;
    
    // Show/hide back to top button based on scroll position
    const cardHeight = 92;
    const totalHeight = cardHeight * environmentalImpacts.length;
    const minScroll = totalHeight;
    // Show button when scrolled down more than 100px from the start of middle section
    setShowBackToTop(currentScrollTop > minScroll + 100);
    
    const maxScroll = totalHeight * 2;
    
    // Handle circular scroll boundaries - only jump when reaching absolute boundaries
    // Allow normal scrolling in between boundaries
    // If scrolled to or past the end of duplicated section, jump to start of middle section
    if (currentScrollTop >= maxScroll - 1) {
      // Use requestAnimationFrame to avoid interrupting user scroll
      requestAnimationFrame(() => {
        if (scrollContainerRef.current && scrollContainerRef.current.scrollTop >= maxScroll - 1) {
          scrollContainerRef.current.scrollTop = totalHeight;
          lastScrollTopRef.current = totalHeight;
        }
      });
    }
    // Only jump if we're at the very top (0 or less) to allow normal scroll up within the middle section
    else if (currentScrollTop <= 0) {
      // Jump to end of middle section only when at the absolute top
      requestAnimationFrame(() => {
        if (scrollContainerRef.current && scrollContainerRef.current.scrollTop <= 0) {
          scrollContainerRef.current.scrollTop = maxScroll - cardHeight;
          lastScrollTopRef.current = maxScroll - cardHeight;
        }
      });
    } else {
      // Update last scroll position for normal scrolling
      lastScrollTopRef.current = currentScrollTop;
    }
  };
  
  // Scroll to top of the section (start of original cards in middle section)
  const scrollToTop = () => {
    if (!scrollContainerRef.current || environmentalImpacts.length === 0) return;
    
    const cardHeight = 92;
    const totalHeight = cardHeight * environmentalImpacts.length;
    // Scroll to the middle section (where original cards start) - this is the "top" for the user
    const middlePosition = totalHeight;
    
    // Scroll to middle section (start of original cards)
    scrollContainerRef.current.scrollTo({
      top: middlePosition,
      behavior: 'smooth'
    });
    
    // Update last scroll position after animation
    setTimeout(() => {
      if (scrollContainerRef.current) {
        lastScrollTopRef.current = scrollContainerRef.current.scrollTop;
      }
    }, 100);
  };
  
  // Scroll to specific card index (anchor point)
  const scrollToCard = (cardIndex: number, section: 'start' | 'middle' | 'end' = 'middle') => {
    if (!scrollContainerRef.current || environmentalImpacts.length === 0) return;
    
    const cardHeight = 92;
    const totalHeight = cardHeight * environmentalImpacts.length;
    let targetScroll = 0;
    
    if (section === 'middle') {
      targetScroll = totalHeight + (cardIndex * cardHeight);
    } else if (section === 'start') {
      targetScroll = cardIndex * cardHeight;
    } else {
      targetScroll = totalHeight * 2 + (cardIndex * cardHeight);
    }
    
    scrollContainerRef.current.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
    
    // Update last scroll position
    lastScrollTopRef.current = targetScroll;
  };
  
  // Calculate savings trend for last 6 months
  const savingsTrendData = useMemo(() => {
    const last6Months = monthlyConsumptionData.slice(-6);
    const previous6Months = monthlyConsumptionData.slice(-12, -6);
    
    return last6Months.map((currentMonth, index) => {
      const previousMonth = previous6Months[index];
      if (!previousMonth) return { month: currentMonth.month, savings: 0 };
      
      const savings = previousMonth.value > 0 
        ? ((previousMonth.value - currentMonth.value) / previousMonth.value) * 100 
        : 0;
      
      return {
        month: currentMonth.month.split(' ')[0], // Solo el mes
        savings: Math.round(savings)
      };
    });
  }, []);
  
  // Calculate variation vs previous quarter (3 months)
  const savingsVsQuarter = useMemo(() => {
    const last3MonthsAvg = savingsTrendData.slice(-3).reduce((sum, item) => sum + item.savings, 0) / 3;
    const previous3MonthsAvg = savingsTrendData.slice(0, 3).reduce((sum, item) => sum + item.savings, 0) / 3;
    
    return previous3MonthsAvg !== 0 
      ? ((last3MonthsAvg - previous3MonthsAvg) / Math.abs(previous3MonthsAvg)) * 100 
      : 0;
  }, [savingsTrendData]);
  
  // Progress meter chart option for savings vs monthly goal
  const monthlyGoal = 4000; // KPI mensual
  const currentSavings = Math.abs(metrics.accumulatedSavingsKWh);
  const progress = Math.min((currentSavings / monthlyGoal) * 100, 100);

  // Gauge chart option
  const gaugeChartOption = useMemo(() => {
    return {
      series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: monthlyGoal,
        splitNumber: 5,
        radius: '85%',
        axisLine: {
          lineStyle: {
            width: 15,
            color: [
              [progress / 100, '#22c55e'],
              [1, '#e5e7eb']
            ]
          }
        },
        pointer: {
          itemStyle: {
            color: '#22c55e'
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        detail: {
          show: false
        },
        data: [{
          value: currentSavings
        }]
      }]
    };
  }, [currentSavings, progress, monthlyGoal]);

  // Horizontal bar chart option
  const horizontalBarOption = useMemo(() => {
    return {
      grid: {
        left: '10%',
        right: '10%',
        top: '10%',
        bottom: '10%'
      },
      xAxis: {
        type: 'value',
        max: monthlyGoal,
        axisLabel: {
          formatter: '{value} kWh'
        }
      },
      yAxis: {
        type: 'category',
        data: ['Ahorro acumulado'],
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      series: [{
        type: 'bar',
        data: [currentSavings],
        itemStyle: {
          color: '#22c55e',
          borderRadius: [0, 4, 4, 0]
        },
        label: {
          show: true,
          position: 'right',
          formatter: `${formatNumber(currentSavings)} kWh`,
          fontSize: 14,
          fontWeight: 'bold'
        }
      }]
    };
  }, [currentSavings, monthlyGoal]);

  // Vertical bar chart option
  const verticalBarOption = useMemo(() => {
    return {
      grid: {
        left: '15%',
        right: '15%',
        top: '15%',
        bottom: '15%'
      },
      xAxis: {
        type: 'category',
        data: ['Meta'],
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        max: monthlyGoal,
        axisLabel: {
          formatter: '{value} kWh'
        }
      },
      series: [{
        type: 'bar',
        data: [currentSavings],
        itemStyle: {
          color: '#22c55e',
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          formatter: `${formatNumber(currentSavings)} kWh`,
          fontSize: 14,
          fontWeight: 'bold'
        }
      }]
    };
  }, [currentSavings, monthlyGoal]);

  // Circular/pie chart option
  const circularChartOption = useMemo(() => {
    const remaining = Math.max(0, monthlyGoal - currentSavings);
    return {
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          fontSize: 12
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        data: [
          { value: currentSavings, name: 'Ahorro', itemStyle: { color: '#22c55e' } },
          { value: remaining, name: 'Restante', itemStyle: { color: '#e5e7eb' } }
        ]
      }]
    };
  }, [currentSavings, monthlyGoal]);

  // Savings chart option based on chart type and display type
  const savingsChartOption = useMemo(() => {
    const displayValue = savingsDisplayType === 'percentage' 
      ? metrics.accumulatedSavings 
      : Math.abs(metrics.accumulatedSavingsKWh);
    
    const maxValue = savingsDisplayType === 'percentage' ? 50 : Math.max(Math.abs(metrics.accumulatedSavingsKWh) * 1.5, 1000);
    const minValue = savingsDisplayType === 'percentage' ? -50 : 0;
    
    if (savingsChartType === 'gauge') {
      return {
        series: [{
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: minValue,
          max: maxValue,
          splitNumber: 5,
          radius: '90%',
          axisLine: {
            lineStyle: {
              width: 20,
              color: [
                [0.3, '#ef4444'],
                [0.5, '#f59e0b'],
                [0.7, '#eab308'],
                [1, '#22c55e']
              ]
            }
          },
          pointer: {
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -20,
            splitNumber: 5,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          splitLine: {
            distance: -30,
            length: 14,
            lineStyle: {
              width: 3,
              color: '#999'
            }
          },
          axisLabel: {
            distance: -40,
            color: '#999',
            fontSize: 12
          },
          title: {
            offsetCenter: [0, '-20%'],
            fontSize: 20
          },
          detail: {
            valueAnimation: true,
            offsetCenter: [0, '0%'],
            fontSize: 30,
            fontWeight: 'bold',
            formatter: function(value: number) {
              if (savingsDisplayType === 'percentage') {
                return Math.round(value) + '%';
              } else {
                return formatNumber(Math.round(value)) + ' kWh';
              }
            },
            color: 'inherit'
          },
          data: [{
            value: displayValue,
            name: savingsDisplayType === 'percentage' ? 'Ahorro Acumulado' : 'Ahorro (kWh)'
          }]
        }]
      };
    } else {
      // Bar chart
      const color = metrics.accumulatedSavings > 0 ? '#22c55e' : metrics.accumulatedSavings < 0 ? '#ef4444' : '#94a3b8';
      return {
        tooltip: {
          trigger: 'axis',
          backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
          borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
          textStyle: {
            color: theme === 'dark' ? '#f9fafb' : '#111827'
          },
          formatter: function(params: any) {
            const data = params[0];
            if (savingsDisplayType === 'percentage') {
              return `Ahorro: ${Math.round(data.value)}%`;
            } else {
              return `Ahorro: ${formatNumber(Math.round(data.value))} kWh`;
            }
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: savingsDisplayType === 'percentage' ? '%' : 'kWh',
          nameLocation: 'middle',
          nameGap: 30,
          nameTextStyle: {
            color: theme === 'dark' ? '#9ca3af' : '#6b7280',
            fontSize: 12
          },
          axisLabel: {
            color: theme === 'dark' ? '#9ca3af' : '#6b7280'
          },
          axisLine: {
            lineStyle: {
              color: theme === 'dark' ? '#374151' : '#e5e7eb'
            }
          },
          splitLine: {
            lineStyle: {
              color: theme === 'dark' ? '#374151' : '#f3f4f6'
            }
          }
        },
        yAxis: {
          type: 'category',
          data: [savingsDisplayType === 'percentage' ? 'Ahorro %' : 'Ahorro (kWh)'],
          axisLabel: {
            color: theme === 'dark' ? '#9ca3af' : '#6b7280'
          },
          axisLine: {
            lineStyle: {
              color: theme === 'dark' ? '#374151' : '#e5e7eb'
            }
          }
        },
        series: [{
          name: 'Ahorro',
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            borderRadius: [4, 4, 0, 0]
          },
          data: [{
            value: displayValue,
            itemStyle: {
              color: color,
              borderRadius: [4, 4, 0, 0]
            }
          }],
          label: {
            show: true,
            position: 'right',
            formatter: function(params: any) {
              if (savingsDisplayType === 'percentage') {
                return Math.round(params.value) + '%';
              } else {
                return formatNumber(Math.round(params.value)) + ' kWh';
              }
            },
            color: theme === 'dark' ? '#f9fafb' : '#111827',
            fontSize: 14,
            fontWeight: 'bold'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
    }
  }, [savingsChartType, savingsDisplayType, metrics, theme]);
  
  // Hourly bars chart option
  const hourlyBarsOption = useMemo(() => {
    const hourlyData = hourlyDistribution.hourlyData;
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        textStyle: {
          color: theme === 'dark' ? '#f9fafb' : '#111827'
        },
        formatter: function(params: any) {
          const data = params[0];
          const hour = parseInt(data.axisValue.split(':')[0]);
          const hourData = hourlyData.find((h: any) => h.hour === hour);
          const zoneName = hourData?.zone === 'valle' ? 'Valle: tarifa más baja' : hourData?.zone === 'fuera_pico' ? 'Tarifa media' : 'Pico: tarifa más alta';
          return `${data.axisValue}<br/>Consumo: ${data.value} kWh<br/>Franja: ${zoneName}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: hourlyData.map(item => `${item.hour}:00`),
        axisLabel: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          fontSize: 10,
          rotate: 45
        },
        axisLine: {
          lineStyle: {
            color: theme === 'dark' ? '#374151' : '#e5e7eb'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: 'kWh',
        nameTextStyle: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280'
        },
        axisLabel: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280'
        },
        axisLine: {
          lineStyle: {
            color: theme === 'dark' ? '#374151' : '#e5e7eb'
          }
        },
        splitLine: {
          lineStyle: {
            color: theme === 'dark' ? '#374151' : '#f3f4f6'
          }
        }
      },
      series: [{
        name: 'Consumo',
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0]
        },
        data: hourlyData.map(item => ({
          value: item.value,
          itemStyle: {
            color: item.zone === 'valle' ? '#9ca3b8' : item.zone === 'fuera_pico' ? '#10b981' : '#ff7f0e',
            borderRadius: [4, 4, 0, 0]
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
  }, [hourlyDistribution, theme]);
  
  // Get last 12 months for current year
  const last12Months = monthlyConsumptionData.slice(-12);
  // showComparison is now controlled by state, defaulting to false
  // Only show comparison if user has selected a year AND comparison data exists
  const actualShowComparison = showComparison && comparisonYearData !== null;
  
  // Find the 3 highest and 3 lowest months
  const sortedMonths = [...last12Months].sort((a, b) => b.value - a.value);
  const highest3 = sortedMonths.slice(0, 3).map(m => m.value);
  const lowest3 = sortedMonths.slice(-3).map(m => m.value);
  
  // Prepare chart data for current year with color coding (memoized)
  const currentYearData = useMemo(() => {
    return last12Months.map((item) => {
      const isHighest = highest3.includes(item.value);
      const isLowest = lowest3.includes(item.value);
      
      let color = CHART_COLORS.normal;
      if (highlightMode === 'both' || highlightMode === 'highest') {
        if (isHighest) color = CHART_COLORS.highest;
      }
      if (highlightMode === 'both' || highlightMode === 'lowest') {
        if (isLowest) color = CHART_COLORS.lowest;
      }
      
      return {
        value: item.value,
        itemStyle: {
          color: color
        }
      };
    });
  }, [last12Months, highlightMode, highest3, lowest3]);
  
  // Prepare chart data for comparison year
  const comparisonData = comparisonYearData 
    ? comparisonYearData.map((item) => ({
        value: item.value,
        itemStyle: {
          color: '#d1d5db' // Gris muy claro para el año de comparación
        }
      }))
    : [];
  
  // Chart configuration (memoized)
  const chartOption = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
      borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
      textStyle: {
        color: theme === 'dark' ? '#f9fafb' : '#111827'
      },
      formatter: function(params: any) {
        if (Array.isArray(params)) {
          const currentData = params.find((p: any) => p.seriesName === 'Año Actual');
          const comparisonData = params.find((p: any) => p.seriesName === 'Año Comparación');
          const month = currentData?.axisValue || comparisonData?.axisValue || '';
          
          let tooltipContent = `${month}<br/>`;
          
          if (currentData) {
            const variation = comparisonData && comparisonData.value > 0
              ? ((currentData.value - comparisonData.value) / comparisonData.value * 100).toFixed(1)
              : null;
            tooltipContent += `<span style="color: ${currentData.color}">●</span> Año Actual: ${currentData.value.toLocaleString('es-CO')} kWh`;
            if (variation !== null) {
              const sign = parseFloat(variation) >= 0 ? '+' : '';
              tooltipContent += ` <span style="color: ${parseFloat(variation) < 0 ? '#22c55e' : '#ef4444'}">(${sign}${variation}%)</span>`;
            }
          }
          
          if (comparisonData) {
            tooltipContent += `<br/><span style="color: ${comparisonData.color}">●</span> ${metrics.yoyYearLabel}: ${comparisonData.value.toLocaleString('es-CO')} kWh`;
          }
          
          return tooltipContent;
        }
        return '';
      }
    },
    legend: {
      data: comparisonYearData ? ['Año Actual', 'Año Comparación'] : ['Año Actual'],
      top: 10,
      selected: {
        'Año Actual': true,
        'Año Comparación': false // Siempre aparece en la leyenda pero no está marcado inicialmente
      },
      textStyle: {
        color: theme === 'dark' ? '#9ca3af' : '#6b7280'
      },
      selectedMode: true,
      selector: comparisonYearData ? [
        {
          type: 'all',
          title: 'Todo'
        },
        {
          type: 'inverse',
          title: 'Invertir'
        }
      ] : undefined
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: comparisonYearData ? '18%' : '10%', // Ajustar espacio superior si hay datos de comparación disponibles
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: last12Months.map(item => item.month.split(' ')[0]), // Show only month name
      axisLabel: {
        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
        rotate: 45,
        fontSize: 11
      },
      axisLine: {
        lineStyle: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'kWh',
      nameTextStyle: {
        color: theme === 'dark' ? '#9ca3af' : '#6b7280'
      },
      axisLabel: {
        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
        formatter: '{value}'
      },
      axisLine: {
        lineStyle: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb'
        }
      },
      splitLine: {
        lineStyle: {
          color: theme === 'dark' ? '#374151' : '#f3f4f6'
        }
      }
    },
    series: [
      {
        name: 'Año Actual',
        data: currentYearData,
        type: 'bar',
        barWidth: comparisonYearData ? '35%' : '60%', // Ajustar ancho basado en si hay datos de comparación disponibles
        itemStyle: {
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      },
      // Siempre incluir la serie de comparación si hay datos disponibles, pero controlada por la leyenda
      ...(comparisonYearData ? [{
        name: 'Año Comparación',
        data: comparisonData,
        type: 'bar',
        barWidth: '35%',
        barGap: '20%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }] : [])
    ]
  }), [currentYearData, comparisonData, last12Months, comparisonYearData, theme, metrics.yoyYearLabel]);
  
  // Handler para cuando se hace clic en la leyenda del gráfico
  const handleLegendSelect = (params: any) => {
    if (params && params.selected) {
      const isComparisonSelected = params.selected['Año Comparación'];
      const isActualSelected = params.selected['Año Actual'];
      
      // Si se selecciona el año de comparación, cambiar a ver ese año en los cards
      if (isComparisonSelected && comparisonYearData) {
        setViewingYear('comparacion');
        setShowComparison(true);
      } else if (isActualSelected && !isComparisonSelected) {
        // Si solo está seleccionado el año actual, mostrar ese año
        setViewingYear('actual');
      }
    }
  };
  
  // Agregar el evento al chartOption
  const chartOptionWithEvents = useMemo(() => ({
    ...chartOption,
    legend: {
      ...chartOption.legend,
      // Esto se manejará con el evento onEvents del componente ReactECharts
    }
  }), [chartOption]);

  const handleDownloadPDF = () => {
    const ecoData: EcoFeedbackData = {
      co2Emitted: 2.4,
      treesEquivalent: 112,
      virtualWater: 1850,
      carbonFootprint: 3.2,
      sustainabilityGoal: 65,
      currentProgress: 42,
      monthlySavings: 156000,
      energyEfficiency: 87.5,
      peakHoursReduction: 15,
      offPeakHoursIncrease: 22,
      recommendations: []
    };
    
    generateEcoFeedbackPDF(ecoData);
  };

  return (
    <Card className="bg-card border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Leaf className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Resumen Ejecutivo y EcoFeedback</h2>
              <p className="text-sm text-muted-foreground">
                Panorama claro y amigable de tu comportamiento energético
              </p>
            </div>
          </div>
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

      <div className="p-6 space-y-6">
        {/* Status and Indicators */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Estado:</span>
            <span className="text-sm text-muted-foreground">Tendencia de consumo a la baja.</span>
          </div>
        </div>

        {/* Monthly Consumption Chart */}
        <Card className="p-6">
          <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-foreground">
                Consumo mensual por categoría
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Identifica meses de alto consumo y ahorro frente al promedio anual.
            </p>
            
            {/* Legend */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.lowest }}></div>
                <span className="text-xs text-muted-foreground">Ahorro</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.normal }}></div>
                <span className="text-xs text-muted-foreground">Normal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.highest }}></div>
                <span className="text-xs text-muted-foreground">Alto</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Chart - Left side, takes more space */}
            <div className="flex-1 min-w-0">
              <div className="bg-muted/30 rounded-lg p-4 relative">
                <ReactECharts 
                  option={chartOption} 
                  style={{ height: '350px', width: '100%' }}
                  onEvents={{
                    legendselectchanged: handleLegendSelect
                  }}
                />
                
                {/* Dropdown controls positioned at bottom of chart */}
                <div className="absolute bottom-4 right-4 flex items-center gap-3 z-10">
                  <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded border">
                    <span className="text-xs font-medium text-foreground">Año Actual</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded border">
                    <Switch
                      checked={showComparison}
                      onCheckedChange={(checked) => {
                        setShowComparison(checked);
                        if (checked && comparisonYearData) {
                          setViewingYear('comparacion');
                        } else {
                          setViewingYear('actual');
                        }
                      }}
                      disabled={!comparisonYearData}
                    />
                    <span className="text-xs font-medium text-foreground">Año de Comparación</span>
                  </div>
                  {showComparison && comparisonYearData && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 text-xs bg-background/80 backdrop-blur-sm">
                          {selectedYear === '1er' ? '1er año' : selectedYear === '2do' ? '2do año' : '3er año'}
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuRadioGroup value={selectedYear} onValueChange={(value) => {
                          handleYearChange(value as YearType);
                          // Si estamos viendo el año de comparación, mantener esa vista
                          if (viewingYear === 'comparacion') {
                            setViewingYear('comparacion');
                          }
                        }}>
                          <DropdownMenuRadioItem value="1er" disabled={false}>
                            1er año
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="2do" disabled={false}>
                            2do año
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="3er" disabled={monthlyConsumptionData.length < 37}>
                            3er año
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 text-xs bg-background/80 backdrop-blur-sm">
                        Resaltar: {highlightMode === 'both' ? 'Ambos' : highlightMode === 'highest' ? '3 más altos' : '3 más bajos'}
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuRadioGroup value={highlightMode} onValueChange={(value) => setHighlightMode(value as 'both' | 'highest' | 'lowest')}>
                        <DropdownMenuRadioItem value="both">
                          Ambos
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="highest">
                          3 más altos
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="lowest">
                          3 más bajos
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {/* Average and explanation */}
              <div className="mt-4 px-2">
                <p className="text-sm font-medium text-foreground">
                  Promedio anual: {formatNumber(Math.round(displayMetrics.avgLast12Months))} kWh
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Los tres meses con mayor consumo se muestran en naranja y los de menor consumo en verde.
                </p>
              </div>
              
              {/* EcoFeedback Message - Debajo del promedio anual */}
              {metrics.yoyVariation < 0 && metrics.sameMonthLastYear && (
                <Card className="mt-4 p-4 bg-green-50 border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-green-100 flex-shrink-0">
                      <Leaf className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-800 mb-1">
                        Este mes consumiste {formatNumber(metrics.currentMonth)} kWh, un {Math.abs(Math.round(metrics.yoyVariation))}% menos que el mismo mes del año pasado.
                      </p>
                      <p className="text-sm font-semibold text-green-800">
                        ¡Has reducido tu consumo en {Math.abs(Math.round(metrics.accumulatedSavings || metrics.yoyVariation))}% y mejorado tu eficiencia!
                      </p>
                    </div>
                  </div>
                </Card>
              )}
              
              {/* Variación anual (YoY) - Debajo del card verde de ecofeedback - Solo cuando está seleccionado año de comparación */}
              {actualShowComparison && metrics.sameMonthLastYear && (
                <Card className={`mt-4 p-4 ${metrics.yoyVariation < 0 ? 'bg-green-50 border-green-200' : metrics.yoyVariation > 0 ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 mb-1">Variación anual (YoY)</p>
                        <p className="text-xs text-gray-600">
                          Compara el consumo del mes actual ({metrics.currentMonthName}) con el mismo mes del {metrics.yoyYearLabel} ({metrics.sameMonthLastYear.month})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {metrics.yoyVariation < 0 ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                          <TrendingDown className="h-5 w-5 text-green-600" />
                        </div>
                      ) : metrics.yoyVariation > 0 ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100">
                          <TrendingUp className="h-5 w-5 text-orange-600" />
                        </div>
                      ) : null}
                      <div>
                        <span className={`text-2xl font-bold ${metrics.yoyVariation < 0 ? 'text-green-600' : metrics.yoyVariation > 0 ? 'text-orange-600' : 'text-gray-600'}`}>
                          {metrics.yoyVariation < 0 ? '↓' : metrics.yoyVariation > 0 ? '↑' : ''}{Math.abs(Math.round(metrics.yoyVariation))}%
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 pt-2 border-t border-gray-200">
                      <span className="font-medium">{metrics.currentMonthName}:</span> {formatNumber(metrics.currentMonth)} kWh • 
                      <span className="font-medium ml-1">{metrics.sameMonthLastYear.month}:</span> {formatNumber(metrics.sameMonthLastYear.value)} kWh
                    </div>
                  </div>
                </Card>
              )}
            </div>
            
            {/* Right side: Cards in two columns */}
            <div className="flex flex-col gap-4 xl:w-[420px] xl:flex-shrink-0">
              {/* Indicador de año visualizado */}
              {comparisonYearData && (
                <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      onClick={() => setViewingYear('actual')}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                        viewingYear === 'actual'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-background text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      Año Actual
                    </button>
                    <button
                      onClick={() => {
                        setViewingYear('comparacion');
                        setShowComparison(true);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                        viewingYear === 'comparacion'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-background text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      Año de Comparación
                    </button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {viewingYear === 'actual' ? 'Viendo datos actuales' : `Viendo ${metrics.yoyYearLabel}`}
                  </span>
                </div>
              )}
              
              {/* Green Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Vs el mes anterior */}
                <Card className="p-5 bg-green-50 border-green-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 mb-1">Vs el mes anterior</p>
                        <p className="text-xs text-gray-600">Comparativo mensual</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                        <TrendingDown className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-green-600">{Math.abs(Math.round(displayMetrics.vsPreviousMonth))}%</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Evolución reciente */}
                <Card className="p-5 bg-green-50 border-green-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">Evolución reciente</p>
                      </div>
                      <div className="flex gap-1 ml-2 flex-shrink-0">
                        <button
                          onClick={() => setSelectedPeriod('3M')}
                          className={`px-1.5 py-0.5 text-[10px] font-medium rounded transition-all ${
                            selectedPeriod === '3M'
                              ? 'bg-orange-500 text-white shadow-sm'
                              : 'bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          3M
                        </button>
                        <button
                          onClick={() => setSelectedPeriod('6M')}
                          className={`px-1.5 py-0.5 text-[10px] font-medium rounded transition-all ${
                            selectedPeriod === '6M'
                              ? 'bg-orange-500 text-white shadow-sm'
                              : 'bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          6M
                        </button>
                        <button
                          onClick={() => setSelectedPeriod('1A')}
                          className={`px-1.5 py-0.5 text-[10px] font-medium rounded transition-all ${
                            selectedPeriod === '1A'
                              ? 'bg-orange-500 text-white shadow-sm'
                              : 'bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          1A
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Consumo promedio de los últimos {selectedPeriod === '3M' ? '3 meses' : selectedPeriod === '6M' ? '6 meses' : '12 meses'} bajó
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                        <TrendingDown className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-green-600">{Math.abs(Math.round(displayMetrics.periodTrend.trend))}%</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Indicators Cards - Two columns, better spacing */}
              <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                {/* Consumo mes actual */}
                <Card className="p-3 bg-orange-50 border-orange-100">
                  <p className="text-[10px] font-semibold text-orange-600 mb-1 uppercase tracking-wide">Consumo del mes</p>
                  <p className="text-xl font-bold text-orange-600">{formatNumber(displayMetrics.currentMonth)} kWh</p>
                  <p className="text-[10px] text-muted-foreground mt-1">↓ 6% vs dic. pasado</p>
                </Card>
                
                {/* Promedio últimos 12 meses */}
                <Card className="p-3 bg-orange-50 border-orange-100">
                  <p className="text-[10px] font-semibold text-orange-600 mb-1 uppercase tracking-wide">Promedio 12 meses</p>
                  <p className="text-xl font-bold text-orange-600">{formatNumber(displayMetrics.avgLast12Months)} kWh/mes</p>
                  <p className="text-[10px] text-muted-foreground mt-1">tendencia 3M a la baja</p>
                </Card>
                
                {/* Mayor consumo histórico */}
                <Card className="p-3 bg-orange-50 border-orange-100">
                  <p className="text-[10px] font-semibold text-orange-600 mb-1 uppercase tracking-wide">Mayor consumo histórico</p>
                  <p className="text-xl font-bold text-orange-600">{formatNumber(displayMetrics.maxMonth.value)} kWh</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{displayMetrics.maxMonth.month}</p>
                </Card>
                
                {/* Menor consumo histórico */}
                <Card className="p-3 bg-orange-50 border-orange-100">
                  <p className="text-[10px] font-semibold text-orange-600 mb-1 uppercase tracking-wide">Menor consumo histórico</p>
                  <p className="text-xl font-bold text-orange-600">{formatNumber(displayMetrics.minMonth.value)} kWh</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{displayMetrics.minMonth.month}</p>
                </Card>
                
                {/* Uso en horas pico */}
                <Card className="p-3 bg-orange-50 border-orange-100">
                  <p className="text-[10px] font-semibold text-orange-600 mb-1 uppercase tracking-wide">Uso en horas pico</p>
                  <p className="text-xl font-bold text-orange-600">72%</p>
                  <p className="text-[10px] text-muted-foreground mt-1">mueve procesos a horas valle</p>
                </Card>
                
                {/* Impacto ambiental */}
                <Card className="p-3 bg-orange-50 border-orange-100">
                  <p className="text-[10px] font-semibold text-orange-600 mb-1 uppercase tracking-wide">Impacto ambiental</p>
                  <p className="text-xl font-bold text-orange-600">1,5 t CO₂ evitadas</p>
                  <p className="text-[10px] text-muted-foreground mt-1">≈ 82 árboles</p>
                </Card>
                
                {/* Acción 1 */}
                <Card className="p-3 bg-orange-50 border-orange-100">
                  <p className="text-[10px] font-semibold text-orange-600 mb-1.5 uppercase tracking-wide">Acción 1</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Reprograma procesos al horario valle. Tu uso pico es 72%.</p>
                </Card>
                
                {/* Acción 2 */}
                <Card className="p-3 bg-orange-50 border-orange-100">
                  <p className="text-[10px] font-semibold text-orange-600 mb-1.5 uppercase tracking-wide">Acción 2</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Mantén las buenas prácticas del trimestre para sostener la tendencia.</p>
                </Card>
                
                {/* Acción 3 */}
                <Card className="p-3 bg-orange-50 border-orange-100">
                  <p className="text-[10px] font-semibold text-orange-600 mb-1.5 uppercase tracking-wide">Acción 3</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Activa alerta si la tarifa sube ≥ 5%.</p>
                </Card>
              </div>
            </div>
          </div>
        </Card>

        {/* Gadget 2: Ahorro Acumulado y Gadget 3: Distribución del Consumo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gadget 2: Ahorro Acumulado */}
          <Card className="p-4">
            <h3 className="text-base font-semibold text-foreground mb-4">Ahorro acumulado</h3>
            
            {/* View Type Selector Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <Card 
                className={`p-3 cursor-pointer transition-all hover:shadow-md ${savingsViewType === 'gauge' ? 'bg-orange-50 border-orange-300 border-2' : 'bg-white border hover:border-orange-200'}`}
                onClick={() => setSavingsViewType('gauge')}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="p-1.5 rounded-full bg-orange-100">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  </div>
                  <span className="text-xs font-medium text-center">Gauge</span>
                </div>
              </Card>
              
              <Card 
                className={`p-3 cursor-pointer transition-all hover:shadow-md ${savingsViewType === 'horizontal' ? 'bg-orange-50 border-orange-300 border-2' : 'bg-white border hover:border-orange-200'}`}
                onClick={() => setSavingsViewType('horizontal')}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-xs font-medium text-center">Barra Horizontal</span>
                </div>
              </Card>
              
              <Card 
                className={`p-3 cursor-pointer transition-all hover:shadow-md ${savingsViewType === 'vertical' ? 'bg-orange-50 border-orange-300 border-2' : 'bg-white border hover:border-orange-200'}`}
                onClick={() => setSavingsViewType('vertical')}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-12 bg-gray-200 rounded overflow-hidden flex items-end">
                    <div className="w-full bg-orange-500 rounded-t" style={{ height: '60%' }}></div>
                  </div>
                  <span className="text-xs font-medium text-center">Barra Vertical</span>
                </div>
              </Card>
              
              <Card 
                className={`p-3 cursor-pointer transition-all hover:shadow-md ${savingsViewType === 'circular' ? 'bg-orange-50 border-orange-300 border-2' : 'bg-white border hover:border-orange-200'}`}
                onClick={() => setSavingsViewType('circular')}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full border-4 border-orange-500"></div>
                  <span className="text-xs font-medium text-center">Circular</span>
                </div>
              </Card>
            </div>
            
            {/* Dynamic Visualization Card */}
            <Card className="p-4 mb-4 bg-white border">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-full bg-orange-100">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {savingsViewType === 'gauge' ? 'Medidor de progreso' : 
                   savingsViewType === 'horizontal' ? 'Barra de progreso horizontal' :
                   savingsViewType === 'vertical' ? 'Barra de progreso vertical' :
                   'Gráfico circular'}
                </span>
              </div>
              
              {savingsViewType === 'gauge' && (
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <ReactECharts 
                      option={gaugeChartOption}
                      style={{ height: '140px', width: '100%' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-2xl font-bold text-foreground mb-1 break-words">
                      {formatNumber(currentSavings)} kWh
                    </p>
                    <p className="text-sm text-muted-foreground break-words">
                      Meta 4.000 kWh • Progreso {Math.round(progress)}%
                    </p>
                  </div>
                </div>
              )}
              
              {savingsViewType === 'horizontal' && (
                <div className="space-y-4">
                  <div>
                    <ReactECharts 
                      option={horizontalBarOption}
                      style={{ height: '120px', width: '100%' }}
                    />
                  </div>
                  <div className="text-center px-2">
                    <p className="text-2xl font-bold text-foreground mb-1 break-words">
                      {formatNumber(currentSavings)} kWh
                    </p>
                    <p className="text-sm text-muted-foreground break-words">
                      Meta 4.000 kWh • Progreso {Math.round(progress)}%
                    </p>
                  </div>
                </div>
              )}
              
              {savingsViewType === 'vertical' && (
                <div className="space-y-4">
                  <div>
                    <ReactECharts 
                      option={verticalBarOption}
                      style={{ height: '200px', width: '100%' }}
                    />
                  </div>
                  <div className="text-center px-2">
                    <p className="text-2xl font-bold text-foreground mb-1 break-words">
                      {formatNumber(currentSavings)} kWh
                    </p>
                    <p className="text-sm text-muted-foreground break-words">
                      Meta 4.000 kWh • Progreso {Math.round(progress)}%
                    </p>
                  </div>
                </div>
              )}
              
              {savingsViewType === 'circular' && (
                <div className="space-y-4">
                  <div>
                    <ReactECharts 
                      option={circularChartOption}
                      style={{ height: '200px', width: '100%' }}
                    />
                  </div>
                  <div className="text-center px-2">
                    <p className="text-2xl font-bold text-foreground mb-1 break-words">
                      {formatNumber(currentSavings)} kWh
                    </p>
                    <p className="text-sm text-muted-foreground break-words">
                      Meta 4.000 kWh • Progreso {Math.round(progress)}%
                    </p>
                  </div>
                </div>
              )}
            </Card>
            
            {/* Environmental Impact Cards - Infinite Circular Scroll */}
            <div className="relative">
              <div 
                ref={scrollContainerRef}
                className="relative h-[280px] w-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                onScroll={handleScroll}
              >
              <div className="flex flex-col gap-3 w-full">
                {/* Duplicate cards at the beginning for seamless loop */}
                {environmentalImpacts.map((impact: { icon: React.ReactNode; text: string; color: string }, index: number) => {
                  const isHovered = hoveredCardIndex === index;
                  const isClicked = clickedCardIndex === index;
                  const isActive = isHovered || isClicked;
                  
                  const highlightColor = theme === 'dark' 
                    ? 'bg-orange-500/20 border-orange-400 shadow-lg shadow-orange-500/30' 
                    : 'bg-blue-50 border-blue-300 shadow-lg shadow-blue-200';
                  
                  return (
                    <Card 
                      key={`duplicate-start-${index}`}
                      className={`
                        p-4 border-2 flex-shrink-0 w-full cursor-pointer transition-all duration-300
                        ${isActive 
                          ? `${highlightColor} border-2 z-10 shadow-xl` 
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
                        }
                      `}
                      onMouseEnter={() => setHoveredCardIndex(index)}
                      onMouseLeave={() => setHoveredCardIndex(null)}
                      onClick={() => {
                        setClickedCardIndex(clickedCardIndex === index ? null : index);
                        scrollToCard(index, 'start');
                      }}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`${impact.color} flex-shrink-0 transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
                          {impact.icon}
                        </div>
                        <p className={`text-sm break-words flex-1 min-w-0 transition-colors duration-300 ${isActive ? 'font-semibold' : 'text-foreground'}`}>
                          {impact.text}
                        </p>
                      </div>
                    </Card>
                  );
                })}
                
                {/* Original cards (middle section) */}
                {environmentalImpacts.map((impact: { icon: React.ReactNode; text: string; color: string }, index: number) => {
                  const isHovered = hoveredCardIndex === index;
                  const isClicked = clickedCardIndex === index;
                  const isActive = isHovered || isClicked;
                  
                  const highlightColor = theme === 'dark' 
                    ? 'bg-orange-500/20 border-orange-400 shadow-lg shadow-orange-500/30' 
                    : 'bg-blue-50 border-blue-300 shadow-lg shadow-blue-200';
                  
                  return (
                    <Card 
                      key={`original-${index}`}
                      className={`
                        p-4 border-2 flex-shrink-0 w-full cursor-pointer transition-all duration-300
                        ${isActive 
                          ? `${highlightColor} border-2 z-10 shadow-xl` 
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
                        }
                      `}
                      onMouseEnter={() => setHoveredCardIndex(index)}
                      onMouseLeave={() => setHoveredCardIndex(null)}
                      onClick={() => {
                        setClickedCardIndex(clickedCardIndex === index ? null : index);
                        scrollToCard(index, 'middle');
                      }}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`${impact.color} flex-shrink-0 transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
                          {impact.icon}
                        </div>
                        <p className={`text-sm break-words flex-1 min-w-0 transition-colors duration-300 ${isActive ? 'font-semibold' : 'text-foreground'}`}>
                          {impact.text}
                        </p>
                      </div>
                    </Card>
                  );
                })}
                
                {/* Duplicate cards at the end for seamless loop */}
                {environmentalImpacts.map((impact: { icon: React.ReactNode; text: string; color: string }, index: number) => {
                  const isHovered = hoveredCardIndex === index;
                  const isClicked = clickedCardIndex === index;
                  const isActive = isHovered || isClicked;
                  
                  const highlightColor = theme === 'dark' 
                    ? 'bg-orange-500/20 border-orange-400 shadow-lg shadow-orange-500/30' 
                    : 'bg-blue-50 border-blue-300 shadow-lg shadow-blue-200';
                  
                  return (
                    <Card 
                      key={`duplicate-end-${index}`}
                      className={`
                        p-4 border-2 flex-shrink-0 w-full cursor-pointer transition-all duration-300
                        ${isActive 
                          ? `${highlightColor} border-2 z-10 shadow-xl` 
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
                        }
                      `}
                      onMouseEnter={() => setHoveredCardIndex(index)}
                      onMouseLeave={() => setHoveredCardIndex(null)}
                      onClick={() => {
                        setClickedCardIndex(clickedCardIndex === index ? null : index);
                        scrollToCard(index, 'end');
                      }}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`${impact.color} flex-shrink-0 transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
                          {impact.icon}
                        </div>
                        <p className={`text-sm break-words flex-1 min-w-0 transition-colors duration-300 ${isActive ? 'font-semibold' : 'text-foreground'}`}>
                          {impact.text}
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>
              
              </div>
              
              {/* Back to Top Button */}
              {showBackToTop && (
                <Button
                  onClick={scrollToTop}
                  size="sm"
                  className="absolute bottom-4 right-4 h-8 w-8 p-0 rounded-full shadow-lg z-30 bg-orange-500 hover:bg-orange-600 text-white border-2 border-white"
                  title="Volver arriba"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
          
          {/* Gadget 3: Distribución del Consumo por Franjas Horarias */}
          <Card className="p-4">
            <h3 className="text-base font-semibold text-foreground mb-4">Distribución de consumo por franja horaria</h3>
            
            {/* Period Selection Buttons */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-muted-foreground">Periodo:</span>
              <div className="flex gap-1">
                <Button
                  variant={distributionPeriod === 'mes' ? 'default' : 'outline'}
                  size="sm"
                  className={`h-7 px-3 text-xs ${distributionPeriod === 'mes' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setDistributionPeriod('mes')}
                >
                  Mes
                </Button>
                <Button
                  variant={distributionPeriod === 'trimestre' ? 'default' : 'outline'}
                  size="sm"
                  className={`h-7 px-3 text-xs ${distributionPeriod === 'trimestre' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setDistributionPeriod('trimestre')}
                >
                  Trimestre
                </Button>
                <Button
                  variant={distributionPeriod === 'año' ? 'default' : 'outline'}
                  size="sm"
                  className={`h-7 px-3 text-xs ${distributionPeriod === 'año' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setDistributionPeriod('año')}
                >
                  Año
                </Button>
              </div>
            </div>
            
            {/* Tabs for Bars (default) and Pie Chart */}
            <div className="mb-4">
              <Tabs defaultValue="bars" className="w-full">
                <div className="flex justify-end mb-4">
                  <TabsList>
                    <TabsTrigger value="bars">Barras Horarias</TabsTrigger>
                    <TabsTrigger value="pie">Gráfico Circular</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="bars" className="mt-0">
                  <ReactECharts
                    option={hourlyBarsOption}
                    style={{ height: '300px' }}
                  />
                </TabsContent>
                
                <TabsContent value="pie" className="mt-0">
                  <ReactECharts
                    option={{
                      tooltip: {
                        trigger: 'item',
                        formatter: '{b}: {c} kWh ({d}%)',
                        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                        textStyle: {
                          color: theme === 'dark' ? '#f9fafb' : '#111827'
                        }
                      },
                      legend: {
                        bottom: 10,
                        textStyle: {
                          color: theme === 'dark' ? '#9ca3af' : '#6b7280'
                        }
                      },
                      series: [{
                        name: 'Distribución Horaria',
                        type: 'pie',
                        radius: ['45%', '75%'],
                        center: ['50%', '50%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                          borderRadius: 8,
                          borderColor: '#fff',
                          borderWidth: 2
                        },
                        label: {
                          show: true,
                          position: 'outside',
                          formatter: '{b}\n{d}%',
                          fontSize: 12,
                          fontWeight: 'bold',
                          alignTo: 'edge',
                          edgeDistance: 10,
                          bleedMargin: 5
                        },
                        labelLine: {
                          show: true,
                          length: 15,
                          length2: 8,
                          smooth: 0.2
                        },
                        emphasis: {
                          label: {
                            show: true,
                            fontSize: 14,
                            fontWeight: 'bold'
                          },
                          itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                          }
                        },
                        data: [
                          { 
                            value: hourlyDistribution.valle.kWh, 
                            name: 'Valle: tarifa más baja', 
                            itemStyle: { color: '#9ca3b8' } // Gris para valle
                          },
                          { 
                            value: hourlyDistribution.fueraPico.kWh, 
                            name: 'Tarifa media', 
                            itemStyle: { color: '#10b981' } // Verde para tarifa media
                          },
                          { 
                            value: hourlyDistribution.pico.kWh, 
                            name: 'Pico: tarifa más alta', 
                            itemStyle: { color: '#ff7f0e' } // Naranja para pico
                          }
                        ]
                      }]
                    }}
                    style={{ height: '300px' }}
                  />
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Distribution Details */}
            <div className="space-y-2 mt-4">
              <div className="mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-muted-foreground text-center">
                  Datos correspondientes al <span className="font-semibold">{hourlyDistribution.periodLabel}</span>
                </p>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                  <span className="text-sm font-medium">Valle: tarifa más baja</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-foreground">{Math.round(hourlyDistribution.valle.percentage)}%</span>
                  <span className="text-sm text-muted-foreground ml-2">{formatNumber(hourlyDistribution.valle.kWh)} kWh</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Tarifa media</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-foreground">{Math.round(hourlyDistribution.fueraPico.percentage)}%</span>
                  <span className="text-sm text-muted-foreground ml-2">{formatNumber(hourlyDistribution.fueraPico.kWh)} kWh</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span className="text-sm font-medium">Pico: tarifa más alta</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-foreground">{Math.round(hourlyDistribution.pico.percentage)}%</span>
                  <span className="text-sm text-muted-foreground ml-2">{formatNumber(hourlyDistribution.pico.kWh)} kWh</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Gadget 6: Indicador de Sostenibilidad */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TreePine className="h-5 w-5 text-green-600" />
            Indicador de Sostenibilidad
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-green-200">
              <div className="p-3 bg-green-100 rounded-full">
                <Cloud className="h-8 w-8 text-green-600" />
            </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">CO₂ Evitado</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatNumber(Math.abs(metrics.accumulatedSavingsKWh) * 0.408)} kg
                </p>
                <p className="text-xs text-muted-foreground">Equivalente a {formatNumber(Math.abs(metrics.accumulatedSavingsKWh) * 0.408 / 1000)} toneladas</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-green-200">
              <div className="p-3 bg-emerald-100 rounded-full">
                <TreePine className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Árboles Equivalentes</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatNumber(Math.abs(metrics.accumulatedSavingsKWh) * 0.022)}
                </p>
                <p className="text-xs text-muted-foreground">Árboles necesarios para absorber el CO₂</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Resumen del Costo del Mes y Variación de Tarifa */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-orange-600" />
            Costo del mes
          </h3>
          
          {/* Main text */}
          <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-100">
            <p className="text-sm text-foreground leading-relaxed">
              Pagaste <span className="font-semibold">${formatNumber(metrics.currentMonth * 850)} COP</span>, con una tarifa promedio de <span className="font-semibold">$850/kWh</span>, que aumentó <span className="font-semibold text-orange-600">5%</span> frente al mes anterior. Aun así, mantienes una tendencia positiva de ahorro en los últimos meses (<span className="font-semibold text-green-600">–{Math.abs(Math.round(metrics.accumulatedSavings || 27))}%</span> en promedio).
            </p>
          </div>
          
          {/* Cost details cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Costo de energía reactiva penalizada */}
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
              <p className="text-xs font-semibold text-orange-600 mb-1 uppercase tracking-wide">Costo de energía reactiva penalizada</p>
              <p className="text-2xl font-bold text-orange-600">$0</p>
              <p className="text-xs text-muted-foreground mt-1">Sin penalización</p>
            </div>
            
            {/* Costo de contribución */}
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
              <p className="text-xs font-semibold text-orange-600 mb-1 uppercase tracking-wide">Costo de contribución</p>
              <p className="text-2xl font-bold text-orange-600">
                ${formatNumber(Math.round(metrics.currentMonth * 850 * 0.2))} COP
              </p>
              <p className="text-xs text-muted-foreground mt-1">20% del costo de energía</p>
            </div>
            
            {/* Valor de la tarifa */}
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
              <p className="text-xs font-semibold text-orange-600 mb-1 uppercase tracking-wide">Valor de la tarifa</p>
              <p className="text-2xl font-bold text-orange-600">$850/kWh</p>
              <p className="text-xs text-muted-foreground mt-1">Tarifa promedio</p>
            </div>
            
            {/* Costo vs año pasado */}
            {metrics.sameMonthLastYear && (() => {
              const currentCost = metrics.currentMonth * 850;
              const lastYearCost = metrics.sameMonthLastYear.value * 850;
              const costDifference = currentCost - lastYearCost;
              return (
                <div className={`p-4 rounded-lg border ${costDifference < 0 ? 'bg-green-50 border-green-100' : costDifference > 0 ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-100'}`}>
                  <p className="text-xs font-semibold text-foreground mb-1 uppercase tracking-wide">Costo vs año pasado</p>
                  <p className={`text-2xl font-bold ${costDifference < 0 ? 'text-green-600' : costDifference > 0 ? 'text-orange-600' : 'text-gray-600'}`}>
                    {costDifference < 0 ? '-' : '+'}${formatNumber(Math.abs(costDifference))} COP
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {costDifference < 0 ? 'Ahorro' : costDifference > 0 ? 'Incremento' : 'Sin cambio'} vs mismo mes año pasado
                  </p>
                </div>
              );
            })()}
            
            {/* Costo vs mes anterior */}
            {(() => {
              const currentCost = metrics.currentMonth * 850;
              const previousMonthData = monthlyConsumptionData[monthlyConsumptionData.length - 2];
              const previousMonthCost = previousMonthData ? previousMonthData.value * 850 : currentCost;
              const costDifference = currentCost - previousMonthCost;
              return (
                <div className={`p-4 rounded-lg border ${costDifference < 0 ? 'bg-green-50 border-green-100' : costDifference > 0 ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-100'}`}>
                  <p className="text-xs font-semibold text-foreground mb-1 uppercase tracking-wide">Costo vs mes anterior</p>
                  <p className={`text-2xl font-bold ${costDifference < 0 ? 'text-green-600' : costDifference > 0 ? 'text-orange-600' : 'text-gray-600'}`}>
                    {costDifference < 0 ? '-' : '+'}${formatNumber(Math.abs(costDifference))} COP
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {costDifference < 0 ? 'Ahorro' : costDifference > 0 ? 'Incremento' : 'Sin cambio'} vs mes anterior
                  </p>
                </div>
              );
            })()}
            
            {/* Incremento porcentual del IPP */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wide">Incremento porcentual del IPP</p>
              <p className="text-2xl font-bold text-blue-600">+5%</p>
              <p className="text-xs text-muted-foreground mt-1">Índice de Precios al Productor</p>
            </div>
          </div>
        </Card>

        {/* Gadget 5: Recomendaciones Inteligentes */}
        {ecoFeedbackMessages.length > 0 && (
          <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                  <h3 className="text-xl font-semibold text-foreground">
                    Recomendaciones Inteligentes
                  </h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Mensajes prácticos derivados del análisis de tu comportamiento energético para mejorar la eficiencia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ecoFeedbackMessages.map((message, index) => (
                <Card 
                  key={index} 
                  className={`p-5 ${message.bgColor} border-2 ${message.borderColor} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 p-2 rounded-lg ${
                      message.type === 'success' ? 'bg-green-100' : 
                      message.type === 'warning' ? 'bg-orange-100' : 
                      'bg-yellow-100'
                    }`}>
                      {message.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            message.category === 'ahorro' ? 'border-green-300 text-green-700 bg-green-50' :
                            message.category === 'operativo' ? 'border-yellow-300 text-yellow-700 bg-yellow-50' :
                            'border-orange-300 text-orange-700 bg-orange-50'
                          }`}
                        >
                          {message.category === 'ahorro' ? 'Ahorro y Eficiencia' :
                           message.category === 'operativo' ? 'Consejo Operativo' :
                           'Alerta Preventiva'}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-foreground mb-2 text-base">
                        {message.title}
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
}
