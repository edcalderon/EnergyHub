"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getAssetUrl } from "@/lib/url-utils";

type ComponentKey = "G" | "T" | "D" | "C" | "Perdidas" | "Otros";

const COMPONENT_INFO: Record<ComponentKey, { title: string; description: string; color: string; image: string; example: string } > = {
  G: {
    title: "Generación (G)",
    description:
      "Es el costo de producir la energía que llega a tu empresa; depende del clima, los combustibles y la disponibilidad de las plantas generadoras.",
    color: "#1f77b4",
    image: getAssetUrl("/images/generacion.png"),
    example: "Ejemplo: cuando hay sequía y baja el nivel de los embalses, el costo de generación suele subir.",
  },
  T: {
    title: "Transmisión (T)",
    description:
      "Es el peaje eléctrico por usar las autopistas de alta tensión que llevan la energía desde las plantas hasta tu región.",
    color: "#ff7f0e",
    image: getAssetUrl("/images/transmision.png"),
    example: "Ejemplo: como pagar un peaje por usar una autopista nacional, pero para la electricidad.",
  },
  D: {
    title: "Distribución (D)",
    description:
      "Es el valor por usar las redes locales que entregan la energía directamente a tu punto de conexión.",
    color: "#2ca02c",
    image: getAssetUrl("/images/distribucion.png"),
    example: "Ejemplo: las redes del barrio que llevan la energía a tu sede.",
  },
  C: {
    title: "Comercialización (C)",
    description:
      "Es el valor por el servicio que hace posible que recibas tu energía a tiempo, con acompañamiento cercano y la buena energía de Celsia.",
    color: "#17becf",
    image: getAssetUrl("/images/comercializacion.png"),
    example: "Ejemplo: la atención y gestión comercial para que tu servicio funcione sin sorpresas.",
  },
  Perdidas: {
    title: "Pérdidas",
    description:
      "Son pequeñas cantidades de energía que se pierden en el camino hasta tu empresa y que la regulación permite incluir para mantener el equilibrio del sistema.",
    color: "#9467bd",
    image: getAssetUrl("/images/perdidas.svg"),
    example: "Ejemplo: calor en cables y transformadores que hace que parte de la energía no llegue.",
  },
  Otros: {
    title: "Otros",
    description:
      "Cobros obligatorios fijados por el Estado que ayudan a mantener estable y confiable el servicio de energía en todo el país.",
    color: "#8c564b",
    image: "/images/otros.svg",
    example: "Ejemplo: contribuciones y cargos regulatorios para mantener el sistema confiable.",
  },
};

export default function TarifaExplainer() {
  const keys: ComponentKey[] = ["G", "T", "D", "C", "Perdidas", "Otros"];
  const [selectedComponent, setSelectedComponent] = useState<ComponentKey | null>(null);

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">Explicación General de la Tarifa de Energía</h2>
            <p className="text-sm text-muted-foreground">
              Costo Unitario por Prestación del Servicio ($/kWh). Haz clic en cada componente para conocer más detalles.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-lg">
        <motion.span 
          className="font-semibold cursor-pointer hover:text-primary transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedComponent(null)}
        >
          CU
        </motion.span>
        <span>=</span>
        {keys.map((k, index) => (
          <div key={k} className="flex items-center gap-2">
            <InteractivePart 
              k={k} 
              isSelected={selectedComponent === k}
              onClick={() => setSelectedComponent(selectedComponent === k ? null : k)}
            />
            {index < keys.length - 1 && <span className="opacity-70">+</span>}
          </div>
        ))}
      </div>

      {/* Sección de contenido dinámico */}
      <motion.div
        key={selectedComponent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="pt-4"
      >
        {selectedComponent ? (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COMPONENT_INFO[selectedComponent].color }} />
                <h3 className="text-lg font-semibold">{COMPONENT_INFO[selectedComponent].title}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-muted-foreground">{COMPONENT_INFO[selectedComponent].description}</p>
                  <p className="text-sm text-muted-foreground italic">{COMPONENT_INFO[selectedComponent].example}</p>
                </div>
                
                <div className="flex justify-center">
                  <img 
                    src={COMPONENT_INFO[selectedComponent].image} 
                    alt={COMPONENT_INFO[selectedComponent].title}
                    className="max-w-full h-auto max-h-48 object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">¿Qué es el CU (Costo Unitario)?</h3>
              <p className="text-muted-foreground">
                El Costo Unitario (CU) es el precio que pagas por cada kilovatio-hora (kWh) de energía eléctrica que consumes. 
                Este costo se compone de varios elementos que cubren todo el proceso desde la generación hasta la entrega 
                de la energía en tu empresa.
              </p>
              <p className="text-sm text-muted-foreground">
                Haz clic en cualquiera de los componentes de la fórmula para conocer más detalles sobre cada uno.
              </p>
            </div>
          </Card>
        )}
      </motion.div>
      
      {/* Enlace con ícono en esquina inferior derecha */}
      <div className="flex justify-end pt-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors p-0 h-auto">
              <Lightbulb className="h-3 w-3" />
              ¿Quieres conocer más?
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Definiciones de La Tarifa de Energía</DialogTitle>
              <DialogDescription>
                Información detallada sobre cada componente que conforma el Costo Unitario de Energía (CU)
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 mt-4">
              {/* Generación */}
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Generación</h3>
                    <p className="text-muted-foreground mb-3">
                      Corresponde al costo de producir la energía eléctrica que consumen los usuarios. Este valor se calcula según los precios del mercado mayorista, donde participan las plantas hidráulicas, térmicas y solares del país.
                    </p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium text-sm mb-2">⚙️ Ejemplos:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Energía producida por hidroeléctricas como Calima o Salvajina.</li>
                        <li>• Energía térmica generada con gas o carbón en épocas de sequía.</li>
                        <li>• Energía solar proveniente de parques como Celsia Solar Yumbo o Celsia Solar Bolívar.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Transmisión */}
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Transmisión</h3>
                    <p className="text-muted-foreground mb-3">
                      Es el costo de transportar la energía desde las plantas generadoras hasta las redes regionales. Se realiza a través de líneas de alta tensión que recorren todo el país, operadas por empresas como ISA Intercolombia.
                    </p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium text-sm mb-2">⚙️ Ejemplos:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Líneas de 230 kV o 500 kV que conectan las centrales con las subestaciones regionales.</li>
                        <li>• Mantenimiento y operación de torres, cables y equipos de protección.</li>
                        <li>• Ampliaciones del sistema para garantizar el suministro nacional.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Distribución */}
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Distribución</h3>
                    <p className="text-muted-foreground mb-3">
                      Es el costo de llevar la energía desde las subestaciones regionales hasta los hogares, comercios e industrias. Incluye la construcción, mantenimiento y operación de redes de media y baja tensión. Depende del nivel de tensión en el que se conecte el cliente.
                    </p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium text-sm mb-2">⚙️ Ejemplos:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Postes, transformadores y cables que llegan hasta tu empresa.</li>
                        <li>• Reparación de fallas y mantenimiento preventivo de redes.</li>
                        <li>• Inversión en ampliaciones para nuevos usuarios.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Comercialización */}
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Comercialización</h3>
                    <p className="text-muted-foreground mb-3">
                      Corresponde al servicio que presta Celsia para garantizar que la energía llegue a cada cliente de forma continua, transparente y con buena atención. Incluye la compra de energía en el mercado, la medición, facturación y acompañamiento permanente.
                    </p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium text-sm mb-2">⚙️ Ejemplos:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Compra y gestión de la energía para tus consumos.</li>
                        <li>• Facturación, atención y soporte comercial personalizado.</li>
                        <li>• Procesos de recaudo y seguimiento para asegurar la continuidad del servicio.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Pérdidas */}
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Pérdidas</h3>
                    <p className="text-muted-foreground mb-3">
                      Corresponden a la energía que se disipa naturalmente mientras viaja por las redes eléctricas desde las plantas de generación hasta los usuarios. Estas pérdidas son reconocidas por la regulación y garantizan la sostenibilidad del servicio. Es un % de la G y de la T.
                    </p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium text-sm mb-2">⚙️ Ejemplos:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Energía que se desvanece por calentamiento en cables y transformadores.</li>
                        <li>• Diferencias entre la energía que entra a la red y la que llega al cliente.</li>
                        <li>• Ajustes técnicos para mantener la calidad y continuidad del suministro.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Otros cargos regulados */}
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Otros cargos regulados</h3>
                    <p className="text-muted-foreground mb-3">
                      Son valores definidos por la CREG y otras entidades para garantizar el funcionamiento del sistema eléctrico nacional. Incluyen costos por restricciones operativas, aportes a la CREG y la Superservicios, y ajustes por pérdidas o compensaciones.
                    </p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium text-sm mb-2">⚙️ Ejemplos:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Restricciones en el sistema eléctrico (maniobras de XM).</li>
                        <li>• Contribuciones regulatorias (CREG, Superservicios).</li>
                        <li>• Ajustes por pérdidas o compensaciones normativas.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Restricciones */}
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Restricciones</h3>
                    <p className="text-muted-foreground mb-3">
                      Las restricciones son costos que se generan cuando el sistema eléctrico del país tiene algún problema o limitación y necesita hacer ajustes para que la energía siga llegando sin interrupciones. En esos casos, el operador nacional (XM) realiza maniobras para mantener el sistema estable y confiable, y los costos que se producen se incluyen dentro del Costo Unitario de Energía (CU) que pagan todos los usuarios, dentro de la componente otros.
                    </p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium text-sm mb-2">⚙️ Ejemplos:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>💥 Voladura o daño de torres y líneas: si una línea de transmisión se cae, el sistema debe redistribuir la generación para cubrir la zona afectada.</li>
                        <li>🔧 Mantenimiento o falla en una central importante: cuando una hidroeléctrica o térmica se detiene, se encienden otras plantas de respaldo para mantener el servicio.</li>
                        <li>🌦️ Épocas de sequía: si los embalses bajan, disminuye la generación hidráulica y el sistema realiza ajustes para garantizar el suministro.</li>
                        <li>⚡ Congestión en la red: cuando una región consume más energía de la que la red puede transportar, el despacho se reorganiza para generar más cerca del consumo.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Contribución */}
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Contribución</h3>
                    <p className="text-muted-foreground mb-3">
                      Es un cargo establecido por el Gobierno Nacional, no por Celsia, que aplica un porcentaje adicional sobre el valor del servicio de energía a ciertos usuarios. Su propósito es financiar los subsidios que benefician a los hogares de menores ingresos del país.
                    </p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium text-sm mb-2">⚙️ Ejemplos:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Aplica principalmente a usuarios comerciales, industriales y oficiales, según la regulación vigente.</li>
                        <li>• Los recursos se destinan al Fondo de Solidaridad para Subsidios y Redistribución del Ingreso.</li>
                        <li>• El porcentaje es fijado por el Gobierno y puede variar con las normas tarifarias.</li>
                        <li>• Algunos clientes, según su actividad económica, pueden estar exentos de este cargo.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* CPROG */}
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">CPROG (Costo del Programa de Reducción de Pérdidas)</h3>
                    <p className="text-muted-foreground mb-3">
                      Es un componente definido por la regulación que remunera a los Operadores de Red (OR) por los programas y acciones implementadas para disminuir las pérdidas de energía en sus sistemas de distribución.
                    </p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium text-sm mb-2">⚙️ Ejemplos:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Reposición de redes antiguas por sistemas más eficientes.</li>
                        <li>• Instalación de medidores inteligentes y equipos de control.</li>
                        <li>• Campañas técnicas y comerciales para detectar conexiones irregulares.</li>
                      </ul>
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>⚡ En palabras simples:</strong> El CPROG reconoce el esfuerzo y la inversión que realizan los operadores para que cada vez se pierda menos energía en las redes, mejorando la calidad y confiabilidad del servicio que Celsia entrega a sus clientes.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* IPP */}
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Índice de Precios al Productor (IPP)</h3>
                    <p className="text-muted-foreground mb-3">
                      El Índice de Precios al Productor (IPP) mide la variación mensual de los precios de los bienes producidos en Colombia, antes de llegar al consumidor final. Este indicador, calculado por el DANE, refleja cómo cambian los costos de producción en sectores como la minería, la industria y la generación eléctrica.
                    </p>
                    <p className="text-muted-foreground mb-3">
                      En el servicio de energía, el IPP se usa como referencia para actualizar las tarifas que componen el Costo Unitario de Energía (CU). La CREG lo adopta como indexador oficial desde hace más de 20 años para ajustar los valores de transmisión, distribución y CPROG (parte del componente PR). Además, Celsia utiliza este mismo índice para actualizar los precios de los componentes de Generación y Comercialización (G+C), garantizando que los costos reflejen la realidad económica del país.
                    </p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium text-sm mb-2">⚙️ Ejemplos de cómo se aplica el IPP:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>📈 Ajuste mensual: cuando el IPP sube, aumentan los costos de transmisión y distribución, ya que reflejan precios más altos en materiales, transporte y operación del sistema.</li>
                        <li>⚡ Actualización de tarifas: Celsia aplica el IPP publicado por el DANE para mantener actualizados los precios del servicio, según lo exige la regulación.</li>
                        <li>🏗️ Impacto económico: si los precios del acero, cobre o combustibles aumentan, el IPP también sube y se ajustan proporcionalmente los costos de las redes y equipos eléctricos.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Referencia */}
            <div className="mt-6 pt-4 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Para más información oficial sobre tarifas reguladas, consulta:{" "}
                <a 
                  href="https://www.celsia.com/en/informacion-regulatoria-y-res-creg-080/tarifas/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://www.celsia.com/en/informacion-regulatoria-y-res-creg-080/tarifas/
                </a>
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}

function InteractivePart({ k, isSelected, onClick }: { k: ComponentKey; isSelected: boolean; onClick: () => void }) {
  const info = COMPONENT_INFO[k];

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
    >
      <Badge
        variant={isSelected ? "default" : "secondary"}
        className="cursor-pointer select-none px-3 py-1 text-base transition-colors"
        style={{ 
          borderColor: info.color, 
          color: isSelected ? "white" : info.color,
          backgroundColor: isSelected ? info.color : "transparent"
        }}
        onClick={onClick}
      >
        {k}
      </Badge>
    </motion.div>
  );
}


