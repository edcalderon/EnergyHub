import jsPDF from 'jspdf';

export interface EcoFeedbackData {
  co2Emitted: number;
  treesEquivalent: number;
  virtualWater: number;
  carbonFootprint: number;
  sustainabilityGoal: number;
  currentProgress: number;
  monthlySavings: number;
  energyEfficiency: number;
  peakHoursReduction: number;
  offPeakHoursIncrease: number;
  recommendations: Array<{
    title: string;
    description: string;
    impact: string;
    difficulty: string;
  }>;
}

export function generateEcoFeedbackPDF(data: EcoFeedbackData): void {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(34, 197, 94); // Green color
  doc.text('Reporte de Eco-Feedback', 20, 30);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Sistema de Gestión Energética - Valle del Cauca', 20, 40);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, 20, 50);
  
  // Line separator
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(0.5);
  doc.line(20, 55, 190, 55);
  
  let yPosition = 70;
  
  // Environmental Impact Section
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Impacto Ambiental', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Indicadores clave de sostenibilidad y eficiencia energética:', 20, yPosition);
  yPosition += 15;
  
  // CO2 Emissions
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('• Emisiones de CO₂:', 20, yPosition);
  doc.text(`${data.co2Emitted} toneladas/mes`, 80, yPosition);
  yPosition += 8;
  
  // Trees Equivalent
  doc.text('• Árboles equivalentes necesarios:', 20, yPosition);
  doc.text(`${data.treesEquivalent} árboles`, 80, yPosition);
  yPosition += 8;
  
  // Virtual Water
  doc.text('• Agua virtual consumida:', 20, yPosition);
  doc.text(`${data.virtualWater.toLocaleString()} litros/mes`, 80, yPosition);
  yPosition += 8;
  
  // Carbon Footprint
  doc.text('• Huella de carbono:', 20, yPosition);
  doc.text(`${data.carbonFootprint} kg CO₂/kWh`, 80, yPosition);
  yPosition += 15;
  
  // Energy Efficiency Section
  doc.setFontSize(16);
  doc.text('Eficiencia Energética', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Indicadores de comportamiento energético:', 20, yPosition);
  yPosition += 15;
  
  // Energy Efficiency
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('• Eficiencia energética actual:', 20, yPosition);
  doc.text(`${data.energyEfficiency}%`, 80, yPosition);
  yPosition += 8;
  
  // Peak Hours Reduction
  doc.text('• Reducción en horas pico:', 20, yPosition);
  doc.text(`${data.peakHoursReduction}%`, 80, yPosition);
  yPosition += 8;
  
  // Off-peak Hours Increase
  doc.text('• Aumento en horas valle:', 20, yPosition);
  doc.text(`${data.offPeakHoursIncrease}%`, 80, yPosition);
  yPosition += 15;
  
  // Savings Section
  doc.setFontSize(16);
  doc.text('Ahorros Alcanzados', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Beneficios económicos y ambientales:', 20, yPosition);
  yPosition += 15;
  
  // Monthly Savings
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('• Ahorro mensual:', 20, yPosition);
  doc.text(`$${data.monthlySavings.toLocaleString('es-CO')} COP`, 80, yPosition);
  yPosition += 8;
  
  // Sustainability Progress
  doc.text('• Progreso hacia meta de sostenibilidad:', 20, yPosition);
  doc.text(`${data.currentProgress}% de ${data.sustainabilityGoal}%`, 80, yPosition);
  yPosition += 15;
  
  // Recommendations Section
  doc.setFontSize(16);
  doc.text('Recomendaciones Sostenibles', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Prácticas recomendadas para mejorar la eficiencia:', 20, yPosition);
  yPosition += 15;
  
  data.recommendations.forEach((rec, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`${index + 1}. ${rec.title}`, 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(rec.description, 25, yPosition);
    yPosition += 8;
    
    doc.setFontSize(9);
    doc.setTextColor(34, 197, 94);
    doc.text(`Impacto: ${rec.impact}`, 25, yPosition);
    yPosition += 8;
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Dificultad: ${rec.difficulty}`, 25, yPosition);
    yPosition += 12;
  });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Generado por EnergyHub - Sistema de Gestión Energética', 20, 280);
  doc.text('Valle del Cauca, Colombia', 20, 285);
  
  // Save the PDF
  doc.save(`eco-feedback-report-${new Date().toISOString().split('T')[0]}.pdf`);
}
