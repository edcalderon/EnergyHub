"use client";

import React, { useMemo, useState } from "react";
import { Leaf, TrendingDown, TrendingUp, Download, CheckCircle, AlertTriangle, Lightbulb, Calendar, DollarSign, TreePine, Cloud, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

// Calculate color for each bar based on percentage change
const getBarColor = (current: number, previous: number | null): string => {
  if (previous === null) return '#6b7280'; // Gray for first month
  
  const change = ((current - previous) / previous) * 100;
  
  if (change < -2) return '#22c55e'; // Green for decrease > 2%
  if (change > 2) return '#ef4444'; // Red for increase > 2%
  return '#6b7280'; // Gray for stable (±2%)
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
  { hour: 0, value: 120, zone: 'valle' },
  { hour: 1, value: 100, zone: 'valle' },
  { hour: 2, value: 95, zone: 'valle' },
  { hour: 3, value: 90, zone: 'valle' },
  { hour: 4, value: 110, zone: 'valle' },
  { hour: 5, value: 130, zone: 'valle' },
  { hour: 6, value: 180, zone: 'fuera_pico' },
  { hour: 7, value: 250, zone: 'fuera_pico' },
  { hour: 8, value: 320, zone: 'pico' },
  { hour: 9, value: 380, zone: 'pico' },
  { hour: 10, value: 420, zone: 'pico' },
  { hour: 11, value: 450, zone: 'pico' },
  { hour: 12, value: 480, zone: 'pico' },
  { hour: 13, value: 460, zone: 'pico' },
  { hour: 14, value: 440, zone: 'pico' },
  { hour: 15, value: 420, zone: 'pico' },
  { hour: 16, value: 400, zone: 'pico' },
  { hour: 17, value: 450, zone: 'pico' },
  { hour: 18, value: 500, zone: 'pico' },
  { hour: 19, value: 480, zone: 'pico' },
  { hour: 20, value: 350, zone: 'fuera_pico' },
  { hour: 21, value: 280, zone: 'fuera_pico' },
  { hour: 22, value: 200, zone: 'fuera_pico' },
  { hour: 23, value: 150, zone: 'valle' },
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
  const [distributionPeriod, setDistributionPeriod] = useState<DistributionPeriodType>('mes');
  const [savingsChartType, setSavingsChartType] = useState<'gauge' | 'bar'>('gauge');
  const [savingsDisplayType, setSavingsDisplayType] = useState<'percentage' | 'kwh'>('percentage');
  
  // Simulator parameters
  const [voltageLevel, setVoltageLevel] = useState<string>('NT2');
  const [monthlyConsumption, setMonthlyConsumption] = useState<number>(4800);
  const [ippVariation, setIppVariation] = useState<number>(-1.8);
  const [lossesVariation, setLossesVariation] = useState<number>(5.2);
  const [useSimulatedData, setUseSimulatedData] = useState<boolean>(false);
  const [hasSimulatorChanges, setHasSimulatorChanges] = useState<boolean>(false);
  
  // Track if button was clicked at least once
  const [recommendationsGenerated, setRecommendationsGenerated] = useState<boolean>(false);
  
  // Track simulator changes
  const defaultSimulatorValues = useMemo(() => ({
    voltageLevel: 'NT2',
    monthlyConsumption: 4800,
    ippVariation: -1.8,
    lossesVariation: 5.2
  }), []);
  
  // Check if simulator has changes
  React.useEffect(() => {
    const hasChanges = 
      voltageLevel !== defaultSimulatorValues.voltageLevel ||
      monthlyConsumption !== defaultSimulatorValues.monthlyConsumption ||
      ippVariation !== defaultSimulatorValues.ippVariation ||
      lossesVariation !== defaultSimulatorValues.lossesVariation;
    
    setHasSimulatorChanges(hasChanges);
    
    // Reset if values go back to default and recommendations were using simulated data
    if (!hasChanges && useSimulatedData) {
      setUseSimulatedData(false);
      setRecommendationsGenerated(false);
    }
    
    // When useSimulatedData is true and simulator parameters change,
    // simulatedMetrics will recalculate automatically because it depends on:
    // - monthlyConsumption (direct dependency)
    // - simulatedTotal (which depends on ippVariation, lossesVariation, voltageLevel)
    // - actualTotal (constant)
    // This ensures recommendations update dynamically without needing to click the button again
  }, [voltageLevel, monthlyConsumption, ippVariation, lossesVariation, defaultSimulatorValues, useSimulatedData]);
  
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
  };
  
  const metrics = useMemo(() => calculateMetrics(monthlyConsumptionData, selectedPeriod, selectedYear), [selectedPeriod, selectedYear]);
  const hourlyDistribution = useMemo(() => calculateHourlyDistribution(distributionPeriod), [distributionPeriod]);
  
  // Calculate tariff components - Actual (base values) - Must be before simulatedMetrics
  const actualTariff = useMemo(() => {
    return {
      generacion: 420,
      transmision: 85,
      distribucion: 180,
      comercializacion: 35,
      perdidas: 60,
      otros: 25
    };
  }, []);
  
  const actualTotal = useMemo(() => {
    return Object.values(actualTariff).reduce((sum, val) => sum + val, 0);
  }, [actualTariff]);
  
  // Calculate tariff components - Simulated based on parameters
  const simulatedTariff = useMemo(() => {
    // IPP variation affects Generación, Transmisión, Distribución y Otros
    const ippFactor = 1 + (ippVariation / 100);
    // Losses variation affects Pérdidas
    const lossesFactor = 1 + (lossesVariation / 100);
    // Voltage level affects Transmisión y Distribución
    const voltageFactor = voltageLevel === 'NT2' ? 1 : voltageLevel === 'NT1' ? 0.95 : 1.05;
    
    return {
      generacion: Math.round(actualTariff.generacion * ippFactor),
      transmision: Math.round(actualTariff.transmision * ippFactor * voltageFactor),
      distribucion: Math.round(actualTariff.distribucion * ippFactor * voltageFactor),
      comercializacion: actualTariff.comercializacion, // No affected
      perdidas: Math.round(actualTariff.perdidas * lossesFactor),
      otros: Math.round(actualTariff.otros * ippFactor)
    };
  }, [actualTariff, ippVariation, lossesVariation, voltageLevel]);
  
  const simulatedTotal = useMemo(() => {
    return Object.values(simulatedTariff).reduce((sum, val) => sum + val, 0);
  }, [simulatedTariff]);
  
  // Calculate total monthly cost
  const actualMonthlyCost = useMemo(() => actualTotal * monthlyConsumption, [actualTotal, monthlyConsumption]);
  const simulatedMonthlyCost = useMemo(() => simulatedTotal * monthlyConsumption, [simulatedTotal, monthlyConsumption]);
  const monthlySavings = simulatedMonthlyCost - actualMonthlyCost;
  
  // Calculate simulated metrics based on simulator parameters
  const simulatedMetrics = useMemo(() => {
    if (!useSimulatedData) return metrics;
    
    // Use simulated consumption from simulator
    const simulatedConsumption = monthlyConsumption;
    
    // Calculate impact of tariff changes on consumption behavior
    // If tariff increases, consumption might decrease due to efficiency efforts
    // If tariff decreases, consumption might stay similar
    const tariffChangePercent = actualTotal > 0 
      ? ((simulatedTotal - actualTotal) / actualTotal) * 100 
      : 0;
    
    // Adjust consumption based on tariff changes (simplified model)
    // A 10% tariff increase might lead to 5% consumption reduction (elasticity effect)
    const consumptionAdjustmentFactor = 1 - (tariffChangePercent * 0.5 / 100);
    const adjustedConsumption = Math.max(0, simulatedConsumption * consumptionAdjustmentFactor);
    
    // Create simulated monthly data with adjusted consumption
    const simulatedMonthlyData = monthlyConsumptionData.map((month, index) => {
      if (index === monthlyConsumptionData.length - 1) {
        // Current month uses simulated and adjusted consumption
        return {
          ...month,
          value: Math.round(adjustedConsumption)
        };
      }
      return month;
    });
    
    return calculateMetrics(simulatedMonthlyData, selectedPeriod, selectedYear);
  }, [useSimulatedData, monthlyConsumption, simulatedTotal, actualTotal, selectedPeriod, selectedYear, metrics]);
  
  // Use simulated metrics if enabled, otherwise use actual metrics
  const activeMetrics = useSimulatedData ? simulatedMetrics : metrics;
  
  const ecoFeedbackMessages = useMemo(() => generateEcoFeedbackMessages(activeMetrics, hourlyDistribution), [activeMetrics, hourlyDistribution]);
  
  const handleGenerateRecommendations = () => {
    setUseSimulatedData(true);
    setRecommendationsGenerated(true);
    toast({
      title: "Recomendaciones generadas",
      description: "Las recomendaciones se han actualizado según los datos del simulador. Se actualizarán automáticamente cuando cambies los parámetros.",
      variant: "default",
    });
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
          data: [{
            value: displayValue,
            itemStyle: {
              color: color
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
          const zoneName = hourData?.zone === 'valle' ? 'Valle' : hourData?.zone === 'fuera_pico' ? 'Fuera de Pico' : 'Pico';
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
        data: hourlyData.map(item => ({
          value: item.value,
          itemStyle: {
            color: item.zone === 'valle' ? '#22c55e' : item.zone === 'fuera_pico' ? '#eab308' : '#ef4444'
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
  
  // Get comparison year data based on selectedYear
  const getComparisonYearData = () => {
    const monthsOffset = selectedYear === '1er' ? 12 : selectedYear === '2do' ? 24 : 36;
    if (monthlyConsumptionData.length < monthsOffset + 12) {
      return null;
    }
    return monthlyConsumptionData.slice(-monthsOffset - 12, -monthsOffset);
  };
  
  const comparisonYearData = getComparisonYearData();
  const showComparison = comparisonYearData !== null;
  
  // Prepare chart data for current year
  const currentYearData = last12Months.map((item, index) => {
    const previousValue = index > 0 ? last12Months[index - 1].value : null;
    return {
      value: item.value,
      itemStyle: {
        color: getBarColor(item.value, previousValue)
      }
    };
  });
  
  // Prepare chart data for comparison year
  const comparisonData = comparisonYearData 
    ? comparisonYearData.map((item) => ({
        value: item.value,
        itemStyle: {
          color: '#94a3b8' // Gray color for comparison year
        }
      }))
    : [];
  
  // Chart configuration
  const chartOption = {
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
      data: showComparison ? ['Año Actual', 'Año Comparación'] : ['Año Actual'],
      top: 10,
      textStyle: {
        color: theme === 'dark' ? '#9ca3af' : '#6b7280'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: showComparison ? '18%' : '10%',
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
        barWidth: showComparison ? '35%' : '60%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      },
      ...(showComparison ? [{
        name: 'Año Comparación',
        data: comparisonData,
        type: 'bar',
        barWidth: '35%',
        barGap: '20%',
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
  };

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

  const formatNumber = (num: number) => {
    return num.toLocaleString('es-CO', { maximumFractionDigits: 0 });
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
        {/* Monthly Consumption Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Indicadores complementarios del gráfico de consumo
            </h3>
            {/* YoY Comparison Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Comparar con:</span>
              <div className="flex gap-1">
                <Button
                  variant={selectedYear === '1er' ? 'default' : 'outline'}
                  size="sm"
                  className={`h-7 px-3 text-xs ${selectedYear === '1er' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => handleYearChange('1er')}
                >
                  1er año
                </Button>
                <Button
                  variant={selectedYear === '2do' ? 'default' : 'outline'}
                  size="sm"
                  className={`h-7 px-3 text-xs ${selectedYear === '2do' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => handleYearChange('2do')}
                >
                  2do año
                </Button>
                <Button
                  variant={selectedYear === '3er' ? 'default' : 'outline'}
                  size="sm"
                  className={`h-7 px-3 text-xs ${selectedYear === '3er' ? 'bg-primary text-primary-foreground' : ''} ${monthlyConsumptionData.length < 37 ? 'opacity-50' : ''}`}
                  onClick={() => handleYearChange('3er')}
                >
                  3er año
                </Button>
              </div>
            </div>
          </div>
          
          {/* Chart */}
          <div className="mb-6">
            <ReactECharts option={chartOption} style={{ height: '400px' }} />
          </div>
          
          {/* Indicators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Consumo mes actual */}
            <Card className="p-4 bg-orange-50 border-orange-100">
              <p className="text-xs text-muted-foreground mb-1">Consumo mes actual</p>
              <p className="text-2xl font-bold text-orange-600">{formatNumber(metrics.currentMonth)} kWh</p>
            </Card>
            
            {/* Promedio últimos 12 meses */}
            <Card className="p-4 bg-orange-50 border-orange-100">
              <p className="text-xs text-muted-foreground mb-1">Promedio de consumo de los últimos 12 meses</p>
              <p className="text-2xl font-bold text-orange-600">{formatNumber(metrics.avgLast12Months)} kWh/mes</p>
            </Card>
            
            {/* Mes con mayor demanda */}
            <Card className="p-4 bg-orange-50 border-orange-100">
              <p className="text-xs text-muted-foreground mb-1">Mes con mayor demanda</p>
              <p className="text-sm font-medium text-gray-700 mb-1">{metrics.maxMonth.month}</p>
              <p className="text-2xl font-bold text-orange-600">{formatNumber(metrics.maxMonth.value)} kWh</p>
            </Card>
            
            {/* Mes con menor demanda */}
            <Card className="p-4 bg-orange-50 border-orange-100">
              <p className="text-xs text-muted-foreground mb-1">Mes con menor demanda</p>
              <p className="text-sm font-medium text-gray-700 mb-1">{metrics.minMonth.month}</p>
              <p className="text-2xl font-bold text-orange-600">{formatNumber(metrics.minMonth.value)} kWh</p>
            </Card>
            
            {/* Vs el mes anterior */}
            <Card className={`p-4 ${metrics.vsPreviousMonth < 0 ? 'bg-green-50 border-green-100' : metrics.vsPreviousMonth > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
              <p className="text-xs text-muted-foreground mb-1">Vs el mes anterior</p>
              <p className="text-xs text-muted-foreground mb-1">Comparativo mensual</p>
              <div className="flex items-center gap-2">
                {metrics.vsPreviousMonth < 0 ? (
                  <TrendingDown className="h-5 w-5 text-green-600" />
                ) : metrics.vsPreviousMonth > 0 ? (
                  <TrendingUp className="h-5 w-5 text-red-600" />
                ) : null}
                <p className={`text-2xl font-bold ${metrics.vsPreviousMonth < 0 ? 'text-green-600' : metrics.vsPreviousMonth > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {metrics.vsPreviousMonth < 0 ? '↓' : metrics.vsPreviousMonth > 0 ? '↑' : ''}{Math.abs(Math.round(metrics.vsPreviousMonth))}%
                </p>
              </div>
            </Card>
            
            {/* Evolución reciente - Dinámico con botones */}
            <Card className={`p-4 ${metrics.periodTrend.trend < 0 ? 'bg-green-50 border-green-100' : metrics.periodTrend.trend > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Evolución reciente</p>
                <div className="flex gap-1">
                  <Button
                    variant={selectedPeriod === '3M' ? 'default' : 'outline'}
                    size="sm"
                    className={`h-6 px-2 text-xs ${selectedPeriod === '3M' ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={() => setSelectedPeriod('3M')}
                  >
                    3M
                  </Button>
                  <Button
                    variant={selectedPeriod === '6M' ? 'default' : 'outline'}
                    size="sm"
                    className={`h-6 px-2 text-xs ${selectedPeriod === '6M' ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={() => setSelectedPeriod('6M')}
                  >
                    6M
                  </Button>
                  <Button
                    variant={selectedPeriod === '1A' ? 'default' : 'outline'}
                    size="sm"
                    className={`h-6 px-2 text-xs ${selectedPeriod === '1A' ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={() => setSelectedPeriod('1A')}
                  >
                    1A
                  </Button>
                </div>
        </div>
              <p className="text-xs text-muted-foreground mb-1">
                {metrics.periodTrend.trend < 0 
                  ? `Consumo promedio de los últimos ${metrics.periodTrend.periodLabel} bajó` 
                  : metrics.periodTrend.trend > 0 
                  ? `Consumo promedio de los últimos ${metrics.periodTrend.periodLabel} subió` 
                  : `Consumo promedio de los últimos ${metrics.periodTrend.periodLabel} estable`}
              </p>
              <div className="flex items-center gap-2">
                {metrics.periodTrend.trend < 0 ? (
                  <TrendingDown className="h-5 w-5 text-green-600" />
                ) : metrics.periodTrend.trend > 0 ? (
                  <TrendingUp className="h-5 w-5 text-red-600" />
                ) : null}
                <p className={`text-2xl font-bold ${metrics.periodTrend.trend < 0 ? 'text-green-600' : metrics.periodTrend.trend > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {metrics.periodTrend.trend < 0 ? '↓' : metrics.periodTrend.trend > 0 ? '↑' : ''}{Math.abs(Math.round(metrics.periodTrend.trend))}%
                </p>
              </div>
            </Card>
            
            </div>
          
          {/* Variación anual (YoY) - Ocupa toda la fila */}
          {showComparison && metrics.sameMonthLastYear && (
            <Card className={`p-4 mt-4 ${metrics.yoyVariation < 0 ? 'bg-green-50 border-green-100' : metrics.yoyVariation > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
              <p className="text-xs text-muted-foreground mb-1">Variación anual (YoY)</p>
              <p className="text-xs text-muted-foreground mb-1">
                Compara el consumo del mes actual ({metrics.currentMonthName}) con el mismo mes del {metrics.yoyYearLabel} ({metrics.sameMonthLastYear.month})
              </p>
              <div className="flex items-center gap-2">
                {metrics.yoyVariation < 0 ? (
                  <TrendingDown className="h-5 w-5 text-green-600" />
                ) : metrics.yoyVariation > 0 ? (
                  <TrendingUp className="h-5 w-5 text-red-600" />
                ) : null}
                <p className={`text-2xl font-bold ${metrics.yoyVariation < 0 ? 'text-green-600' : metrics.yoyVariation > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {metrics.yoyVariation < 0 ? '↓' : metrics.yoyVariation > 0 ? '↑' : ''}{Math.abs(Math.round(metrics.yoyVariation))}%
                </p>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                <span className="font-medium">{metrics.currentMonthName}:</span> {formatNumber(metrics.currentMonth)} kWh • 
                <span className="font-medium ml-1">{metrics.sameMonthLastYear.month}:</span> {formatNumber(metrics.sameMonthLastYear.value)} kWh
              </div>
            </Card>
          )}
        </Card>

        {/* Gadget 2: Ahorro Acumulado y Gadget 3: Distribución del Consumo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gadget 2: Ahorro Acumulado */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Ahorro Acumulado</h3>
              {/* Switches for Chart Type and Display Type */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="chart-type" className="text-xs text-muted-foreground cursor-pointer">
                    {savingsChartType === 'gauge' ? 'Velocímetro' : 'Barra'}
                  </Label>
                  <Switch
                    id="chart-type"
                    checked={savingsChartType === 'bar'}
                    onCheckedChange={(checked) => setSavingsChartType(checked ? 'bar' : 'gauge')}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="display-type" className="text-xs text-muted-foreground cursor-pointer">
                    {savingsDisplayType === 'percentage' ? '%' : 'kWh'}
                  </Label>
                  <Switch
                    id="display-type"
                    checked={savingsDisplayType === 'kwh'}
                    onCheckedChange={(checked) => setSavingsDisplayType(checked ? 'kwh' : 'percentage')}
                  />
                </div>
              </div>
            </div>
            
            {/* Chart for Accumulated Savings */}
            <div className="mb-4">
              <ReactECharts 
                option={savingsChartOption}
                style={{ height: '300px' }}
              />
            </div>
            
            {/* Savings Details */}
            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-muted-foreground">Ahorro vs año anterior:</span>
                <span className={`text-lg font-bold ${metrics.accumulatedSavings > 0 ? 'text-green-600' : metrics.accumulatedSavings < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {metrics.accumulatedSavings > 0 ? '↓' : metrics.accumulatedSavings < 0 ? '↑' : ''}{Math.abs(Math.round(metrics.accumulatedSavings))}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-muted-foreground">Ahorro en kWh:</span>
                <span className="text-lg font-bold text-orange-600">
                  {formatNumber(Math.abs(metrics.accumulatedSavingsKWh))} kWh
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-muted-foreground">Vs promedio histórico (3 años):</span>
                <span className={`text-sm font-medium ${metrics.vsHistoricalAverage > 0 ? 'text-green-600' : metrics.vsHistoricalAverage < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {metrics.vsHistoricalAverage > 0 ? '↓' : metrics.vsHistoricalAverage < 0 ? '↑' : ''}{Math.abs(Math.round(metrics.vsHistoricalAverage))}%
                </span>
              </div>
            </div>
            
            {/* Methodology Note */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-800">
                  <strong>Metodología:</strong> El ahorro acumulado se calcula comparando el consumo total registrado en el año actual con el consumo del mismo periodo del año anterior.
                </p>
              </div>
            </div>
          </Card>
          
          {/* Gadget 3: Distribución del Consumo por Franjas Horarias */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Distribución del Consumo</h3>
              {/* Period Selection Buttons */}
              <div className="flex items-center gap-2">
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
            </div>
            
            {/* Tabs for Pie Chart and Hourly Bars */}
            <div className="mb-4">
              <Tabs defaultValue="pie" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="pie">Gráfico Circular</TabsTrigger>
                  <TabsTrigger value="bars">Barras Horarias</TabsTrigger>
                </TabsList>
                
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
                          fontSize: 11,
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
                            fontSize: 13,
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
                            name: 'Valle', 
                            itemStyle: { color: '#22c55e' } 
                          },
                          { 
                            value: hourlyDistribution.fueraPico.kWh, 
                            name: 'Fuera de Pico', 
                            itemStyle: { color: '#eab308' } 
                          },
                          { 
                            value: hourlyDistribution.pico.kWh, 
                            name: 'Pico', 
                            itemStyle: { color: '#ef4444' } 
                          }
                        ]
                      }]
                    }}
                    style={{ height: '300px' }}
                  />
                </TabsContent>
                
                <TabsContent value="bars" className="mt-0">
                  <ReactECharts
                    option={hourlyBarsOption}
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
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Franja Valle</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-green-700">{Math.round(hourlyDistribution.valle.percentage)}%</span>
                  <span className="text-xs text-muted-foreground ml-2">{formatNumber(hourlyDistribution.valle.kWh)} kWh</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span className="text-sm font-medium">Franja Fuera de Pico</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-yellow-700">{Math.round(hourlyDistribution.fueraPico.percentage)}%</span>
                  <span className="text-xs text-muted-foreground ml-2">{formatNumber(hourlyDistribution.fueraPico.kWh)} kWh</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium">Franja Pico</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-red-700">{Math.round(hourlyDistribution.pico.percentage)}%</span>
                  <span className="text-xs text-muted-foreground ml-2">{formatNumber(hourlyDistribution.pico.kWh)} kWh</span>
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
            Resumen del Costo del Mes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
              <p className="text-xs text-muted-foreground mb-1">Costo del mes actual</p>
              <p className="text-2xl font-bold text-orange-600">
                ${formatNumber(metrics.currentMonth * 850)} COP
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatNumber(metrics.currentMonth)} kWh × $850/kWh
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-muted-foreground mb-1">Variación de tarifa</p>
              <p className="text-xl font-bold text-blue-600">+5%</p>
              <p className="text-xs text-muted-foreground mt-1">vs. mes anterior</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-xs text-muted-foreground mb-1">Ahorro potencial</p>
              <p className="text-xl font-bold text-green-600">
                ${formatNumber(Math.abs(metrics.accumulatedSavingsKWh) * 850)} COP
              </p>
              <p className="text-xs text-muted-foreground mt-1">vs. año anterior</p>
            </div>
          </div>
          
          {/* Tendencia de Ahorro (6 meses) */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-semibold text-foreground">Tendencia de ahorro (6 meses)</h4>
              {savingsVsQuarter !== 0 && (
                <div className={`flex items-center gap-1 ${savingsVsQuarter > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {savingsVsQuarter > 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-sm font-bold">
                    {Math.abs(Math.round(savingsVsQuarter))}% vs trimestre anterior
                  </span>
                </div>
              )}
            </div>
            <ReactECharts
              option={{
                tooltip: {
                  trigger: 'axis',
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                  textStyle: {
                    color: theme === 'dark' ? '#f9fafb' : '#111827'
                  },
                  formatter: function(params: any) {
                    const data = params[0];
                    return `${data.axisValue}<br/>Ahorro: ${data.value > 0 ? '+' : ''}${data.value}%`;
                  }
                },
                grid: {
                  left: '10%',
                  right: '10%',
                  bottom: '15%',
                  top: '15%',
                  containLabel: true
                },
                xAxis: {
                  type: 'category',
                  data: savingsTrendData.map(item => item.month),
                  axisLabel: {
                    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
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
                  name: '%',
                  nameLocation: 'middle',
                  nameGap: 40,
                  nameTextStyle: {
                    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                    fontSize: 12
                  },
                  axisLabel: {
                    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                    formatter: '{value}%'
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
                  name: 'Ahorro',
                  type: 'bar',
                  barWidth: '50%',
                  data: savingsTrendData.map((item, index) => ({
                    value: item.savings,
                    itemStyle: {
                      color: index === savingsTrendData.length - 1 
                        ? '#f97316' // Naranja más oscuro para el último mes
                        : '#fb923c' // Naranja más claro para los anteriores
                    }
                  })),
                  label: {
                    show: true,
                    position: 'top',
                    formatter: function(params: any) {
                      return params.value > 0 ? `+${params.value}%` : `${params.value}%`;
                    },
                    color: theme === 'dark' ? '#f9fafb' : '#111827',
                    fontSize: 11,
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
              }}
              style={{ height: '250px' }}
            />
          </div>
        </Card>

        {/* Simulador de Tarifas */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">Simulador de Tarifas</h3>
            <Button 
              onClick={handleGenerateRecommendations}
              disabled={!hasSimulatorChanges}
              variant="default"
            >
              {recommendationsGenerated && useSimulatedData ? 'Actualizar Recomendaciones' : 'Generar Recomendaciones'}
            </Button>
          </div>
          
          {/* Input Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Nivel de tensión */}
            <div className="space-y-2">
              <Label htmlFor="voltage-level" className="text-sm font-medium">Nivel de tensión</Label>
              <Select value={voltageLevel} onValueChange={setVoltageLevel}>
                <SelectTrigger id="voltage-level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NT1">NT1</SelectItem>
                  <SelectItem value="NT2">NT2</SelectItem>
                  <SelectItem value="NT3">NT3</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Afecta Transmisión y Distribución</p>
            </div>
            
            {/* Consumo mensual */}
            <div className="space-y-2">
              <Label htmlFor="monthly-consumption" className="text-sm font-medium">Consumo mensual (kWh)</Label>
              <Input
                id="monthly-consumption"
                type="number"
                value={monthlyConsumption}
                onChange={(e) => setMonthlyConsumption(Number(e.target.value))}
                min={0}
                step={100}
              />
              <p className="text-xs text-muted-foreground">Se usa para estimar el costo total mensual</p>
            </div>
            
            {/* Variación IPP */}
            <div className="space-y-2">
              <Label htmlFor="ipp-variation" className="text-sm font-medium">
                Variación IPP (%): {ippVariation.toFixed(1)}%
              </Label>
              <Slider
                id="ipp-variation"
                min={-10}
                max={10}
                step={0.1}
                value={[ippVariation]}
                onValueChange={(value) => setIppVariation(value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Impacta G, T, D y Otros (demo)</p>
            </div>
            
            {/* Variación pérdidas */}
            <div className="space-y-2">
              <Label htmlFor="losses-variation" className="text-sm font-medium">
                Variación pérdidas (%): {lossesVariation.toFixed(1)}%
              </Label>
              <Slider
                id="losses-variation"
                min={-10}
                max={10}
                step={0.1}
                value={[lossesVariation]}
                onValueChange={(value) => setLossesVariation(value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Impacta Pérdidas reconocidas</p>
            </div>
          </div>
          
          {/* Tariff Comparison */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-foreground mb-4">Desglose del CU (COP/kWh) - Actual vs Simulado</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tarifa Actual */}
              <div className="space-y-4">
                <h5 className="font-medium text-foreground">Tarifa actual</h5>
                <div className="space-y-3">
                  {[
                    { name: 'Generación', value: actualTariff.generacion, color: '#1f77b4' },
                    { name: 'Transmisión', value: actualTariff.transmision, color: '#2ca02c' },
                    { name: 'Distribución', value: actualTariff.distribucion, color: '#ff7f0e' },
                    { name: 'Comercialización', value: actualTariff.comercializacion, color: '#808080' },
                    { name: 'Pérdidas', value: actualTariff.perdidas, color: '#9467bd' },
                    { name: 'Otros costos', value: actualTariff.otros, color: '#17becf' }
                  ].map((component) => {
                    const percentage = (component.value / actualTotal) * 100;
                    return (
                      <div key={component.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: component.color }}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-foreground">{component.name}</span>
                            <span className="text-sm font-bold text-foreground">{component.value} COP/kWh</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: component.color
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Total CU:</span>
                    <span className="text-lg font-bold text-foreground">{actualTotal} COP/kWh</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-muted-foreground">Costo mensual estimado:</span>
                    <span className="text-sm font-semibold text-foreground">${formatNumber(actualMonthlyCost)} COP</span>
                  </div>
                </div>
              </div>
              
              {/* Tarifa Simulada */}
              <div className="space-y-4">
                <h5 className="font-medium text-foreground">Tarifa simulada</h5>
                <div className="space-y-3">
                  {[
                    { name: 'Generación', value: simulatedTariff.generacion, color: '#1f77b4', actual: actualTariff.generacion },
                    { name: 'Transmisión', value: simulatedTariff.transmision, color: '#2ca02c', actual: actualTariff.transmision },
                    { name: 'Distribución', value: simulatedTariff.distribucion, color: '#ff7f0e', actual: actualTariff.distribucion },
                    { name: 'Comercialización', value: simulatedTariff.comercializacion, color: '#808080', actual: actualTariff.comercializacion },
                    { name: 'Pérdidas', value: simulatedTariff.perdidas, color: '#9467bd', actual: actualTariff.perdidas },
                    { name: 'Otros costos', value: simulatedTariff.otros, color: '#17becf', actual: actualTariff.otros }
                  ].map((component) => {
                    const percentage = (component.value / simulatedTotal) * 100;
                    const change = component.value - component.actual;
                    return (
                      <div key={component.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: component.color }}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-foreground">{component.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-foreground">{component.value} COP/kWh</span>
                              {change !== 0 && (
                                <span className={`text-xs font-semibold ${change < 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {change > 0 ? '+' : ''}{change}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: component.color
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Total CU:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-foreground">{simulatedTotal} COP/kWh</span>
                      {simulatedTotal !== actualTotal && (
                        <span className={`text-sm font-semibold ${simulatedTotal < actualTotal ? 'text-green-600' : 'text-red-600'}`}>
                          ({simulatedTotal < actualTotal ? '-' : '+'}{Math.abs(simulatedTotal - actualTotal)})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-muted-foreground">Costo mensual estimado:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">${formatNumber(simulatedMonthlyCost)} COP</span>
                      {monthlySavings !== 0 && (
                        <span className={`text-sm font-semibold ${monthlySavings < 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({monthlySavings < 0 ? 'Ahorro: ' : 'Incremento: '}${formatNumber(Math.abs(monthlySavings))})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
                {useSimulatedData && (
                  <Badge variant="outline" className="bg-blue-50 border-blue-300 text-blue-700">
                    Basado en datos simulados
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {useSimulatedData 
                  ? "Mensajes prácticos derivados del análisis de los datos del simulador para mejorar la eficiencia."
                  : "Mensajes prácticos derivados del análisis de tu comportamiento energético para mejorar la eficiencia."}
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
