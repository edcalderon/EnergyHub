import { Bell, AlertTriangle, TrendingUp, Lightbulb, X, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  type: "alert" | "tariff" | "recommendation";
  title: string;
  message: string;
  timestamp: string;
  priority: "high" | "medium" | "low";
  actionable: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Consumo Inusual Detectado",
    message: "Tu consumo energético ha aumentado un 35% en las últimas 24 horas comparado con el promedio semanal.",
    timestamp: "Hace 15 minutos",
    priority: "high",
    actionable: true,
  },
  {
    id: "2",
    type: "tariff",
    title: "Cambio Tarifario Próximo",
    message: "Se espera un incremento del 8% en la tarifa de energía a partir del próximo mes.",
    timestamp: "Hace 2 horas",
    priority: "medium",
    actionable: true,
  },
  {
    id: "3",
    type: "recommendation",
    title: "Oportunidad de Ahorro",
    message: "Cambiando el horario de operación de maquinaria pesada a horario valle podrías ahorrar hasta $1,800,000 COP/mes.",
    timestamp: "Hace 5 horas",
    priority: "medium",
    actionable: true,
  },
  {
    id: "4",
    type: "recommendation",
    title: "Mantenimiento Preventivo",
    message: "El sistema detectó eficiencia reducida en equipos de climatización. Considera una revisión técnica.",
    timestamp: "Hace 1 día",
    priority: "low",
    actionable: false,
  },
];

export default function NotificationCenter() {
  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "tariff":
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case "recommendation":
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Card className="bg-card border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Centro de Notificaciones</h2>
              <p className="text-sm text-muted-foreground">Alertas y recomendaciones personalizadas</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {mockNotifications.length} nuevas
          </Badge>
        </div>
      </div>

      <ScrollArea className="h-[500px]">
        <div className="p-4 space-y-3">
          {mockNotifications.map((notification) => (
            <Card
              key={notification.id}
              className="p-4 hover:shadow-md transition-all duration-200 border-l-4"
              style={{
                borderLeftColor:
                  notification.priority === "high"
                    ? "hsl(var(--destructive))"
                    : notification.priority === "medium"
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted))",
              }}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                    <Badge variant={getPriorityColor(notification.priority) as any} className="text-xs whitespace-nowrap">
                      {notification.priority === "high" ? "Alta" : notification.priority === "medium" ? "Media" : "Baja"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                    {notification.actionable && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 text-xs">
                          <X className="h-3 w-3 mr-1" />
                          Ignorar
                        </Button>
                        <Button size="sm" className="h-8 text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Implementar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}