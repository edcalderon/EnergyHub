"use client";

import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";

export default function TariffSimulator() {
  const { toast } = useToast();
  
  // Simulator parameters
  const [voltageLevel, setVoltageLevel] = useState<string>('NT2');
  const [monthlyConsumption, setMonthlyConsumption] = useState<number>(4800);
  const [ippVariation, setIppVariation] = useState<number>(-1.8);
  const [lossesVariation, setLossesVariation] = useState<number>(5.2);
  
  const formatNumber = (num: number) => {
    return num.toLocaleString('es-CO', { maximumFractionDigits: 0 });
  };
  
  // Calculate tariff components - Actual (base values from dic-25)
  const actualTariff = useMemo(() => {
    return {
      generacion: 400.22,    // G - 43.19%
      transmision: 56.03,    // T - 6.05%
      distribucion: 188.29,  // D - 20.32%
      comercializacion: 183.69, // C - 19.82%
      perdidas: 74.76,       // Perdidas - 8.07%
      otros: 23.72           // Otros - 2.56%
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
  
  // Track simulator changes
  const defaultSimulatorValues = useMemo(() => ({
    voltageLevel: 'NT2',
    monthlyConsumption: 4800,
    ippVariation: -1.8,
    lossesVariation: 5.2
  }), []);
  
  const hasSimulatorChanges = useMemo(() => {
    return (
      voltageLevel !== defaultSimulatorValues.voltageLevel ||
      monthlyConsumption !== defaultSimulatorValues.monthlyConsumption ||
      ippVariation !== defaultSimulatorValues.ippVariation ||
      lossesVariation !== defaultSimulatorValues.lossesVariation
    );
  }, [voltageLevel, monthlyConsumption, ippVariation, lossesVariation, defaultSimulatorValues]);
  
  const handleReset = () => {
    setVoltageLevel(defaultSimulatorValues.voltageLevel);
    setMonthlyConsumption(defaultSimulatorValues.monthlyConsumption);
    setIppVariation(defaultSimulatorValues.ippVariation);
    setLossesVariation(defaultSimulatorValues.lossesVariation);
    toast({
      title: "Valores restablecidos",
      description: "Los parámetros se han restablecido a los valores por defecto.",
      variant: "default",
    });
  };
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Simulación de Tarifas Flexibles</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Ajusta los parámetros para simular diferentes escenarios tarifarios y ver su impacto
          </p>
        </div>
        <Button 
          onClick={handleReset}
          disabled={!hasSimulatorChanges}
          variant="outline"
        >
          Restablecer
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
          <p className="text-xs text-muted-foreground">Impacta G, T, D y Otros</p>
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
      
      {/* Note */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Esta es una funcionalidad en desarrollo que forma parte de la segunda fase del proyecto. 
          La simulación se perfeccionará en el futuro con modelos más precisos y datos adicionales.
        </p>
      </div>
    </Card>
  );
}

