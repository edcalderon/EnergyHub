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
  
  // Add Celsia logo (you'll need to add the image to public folder)
  try {
    // For now, we'll add a placeholder for the logo
    // In production, you would load the actual image
    doc.setFontSize(16);
    doc.setTextColor(0, 100, 200); // Celsia blue
    doc.text('Celsia', 20, 20);
  } catch (error) {
    console.log('Logo not found, using text branding');
  }
  
  // Header with better spacing
  doc.setFontSize(18);
  doc.setTextColor(34, 197, 94); // Green color
  doc.text('EnergyHub', 20, 35);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Sistema de Gestión Energética - Valle del Cauca', 20, 42);
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
  doc.text('Indicadores de sostenibilidad y eficiencia:', 20, yPosition);
  yPosition += 15;
  
  // CO2 Emissions
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('• CO₂ Emitido:', 20, yPosition);
  doc.text(`${data.co2Emitted} ton/mes`, 70, yPosition);
  yPosition += 8;
  
  // Trees Equivalent
  doc.text('• Árboles equivalentes:', 20, yPosition);
  doc.text(`${data.treesEquivalent} árboles`, 70, yPosition);
  yPosition += 8;
  
  // Virtual Water
  doc.text('• Agua virtual:', 20, yPosition);
  doc.text(`${data.virtualWater.toLocaleString()} L/mes`, 70, yPosition);
  yPosition += 8;
  
  // Carbon Footprint
  doc.text('• Huella carbono:', 20, yPosition);
  doc.text(`${data.carbonFootprint} kg CO₂/kWh`, 70, yPosition);
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
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('• Eficiencia actual:', 20, yPosition);
  doc.text(`${data.energyEfficiency}%`, 70, yPosition);
  yPosition += 8;
  
  // Peak Hours Reduction
  doc.text('• Reducción horas pico:', 20, yPosition);
  doc.text(`${data.peakHoursReduction}%`, 70, yPosition);
  yPosition += 8;
  
  // Off-peak Hours Increase
  doc.text('• Aumento horas valle:', 20, yPosition);
  doc.text(`${data.offPeakHoursIncrease}%`, 70, yPosition);
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
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('• Ahorro mensual:', 20, yPosition);
  doc.text(`$${data.monthlySavings.toLocaleString('es-CO')}`, 70, yPosition);
  yPosition += 8;
  
  // Sustainability Progress
  doc.text('• Progreso sostenibilidad:', 20, yPosition);
  doc.text(`${data.currentProgress}% de ${data.sustainabilityGoal}%`, 70, yPosition);
  yPosition += 15;
  
  // Recommendations Section
  doc.setFontSize(16);
  doc.text('Recomendaciones Sostenibles', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Prácticas recomendadas para mejorar eficiencia:', 20, yPosition);
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
    
    // Split long descriptions into multiple lines
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const maxWidth = 160; // Maximum width for text
    const splitText = doc.splitTextToSize(rec.description, maxWidth);
    doc.text(splitText, 25, yPosition);
    yPosition += splitText.length * 4;
    
    doc.setFontSize(9);
    doc.setTextColor(34, 197, 94);
    doc.text(`Impacto: ${rec.impact}`, 25, yPosition);
    yPosition += 6;
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Dificultad: ${rec.difficulty}`, 25, yPosition);
    yPosition += 12;
  });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('EnergyHub by Celsia - Sistema de Gestión Energética', 20, 280);
  doc.text('Valle del Cauca, Colombia', 20, 285);
  
  // Add Celsia branding
  doc.setFontSize(10);
  doc.setTextColor(0, 100, 200);
  doc.text('Celsia', 160, 280);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Energía para el futuro', 160, 285);
  
  // Save the PDF
  doc.save(`energyhub-eco-feedback-${new Date().toISOString().split('T')[0]}.pdf`);
}
