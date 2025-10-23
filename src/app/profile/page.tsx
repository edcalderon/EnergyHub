"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
  CreditCard,
  Bell,
  Shield,
  LogOut,
  Edit
} from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 pt-4 md:pt-16 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Perfil de Usuario
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal y preferencias de la cuenta
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Profile Information */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Información Personal
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                        U
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Usuario Demo</h3>
                      <p className="text-muted-foreground">Cliente Premium</p>
                      <Badge variant="secondary" className="mt-1">Activo</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Email</p>
                        <p className="text-sm text-muted-foreground">usuario@energyhub.com</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Teléfono</p>
                        <p className="text-sm text-muted-foreground">+57 300 123 4567</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Dirección</p>
                        <p className="text-sm text-muted-foreground">Bogotá, Colombia</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Miembro desde</p>
                        <p className="text-sm text-muted-foreground">Octubre 2024</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración de Cuenta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-blue-500" />
                        <div className="text-left">
                          <p className="font-medium">Seguridad</p>
                          <p className="text-sm text-muted-foreground">Cambiar contraseña y configuración de seguridad</p>
                        </div>
                      </div>
                    </Button>

                    <Button variant="outline" className="justify-start h-auto p-4">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-yellow-500" />
                        <div className="text-left">
                          <p className="font-medium">Notificaciones</p>
                          <p className="text-sm text-muted-foreground">Configurar alertas y preferencias</p>
                        </div>
                      </div>
                    </Button>

                    <Button variant="outline" className="justify-start h-auto p-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-green-500" />
                        <div className="text-left">
                          <p className="font-medium">Facturación</p>
                          <p className="text-sm text-muted-foreground">Métodos de pago y facturas</p>
                        </div>
                      </div>
                    </Button>

                    <Button variant="outline" className="justify-start h-auto p-4">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-purple-500" />
                        <div className="text-left">
                          <p className="font-medium">Privacidad</p>
                          <p className="text-sm text-muted-foreground">Control de datos y privacidad</p>
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">2,450</div>
                    <p className="text-sm text-muted-foreground">kWh Consumidos</p>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">$1,250,000</div>
                    <p className="text-sm text-muted-foreground">Ahorro Mensual</p>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">98%</div>
                    <p className="text-sm text-muted-foreground">Eficiencia</p>
                  </div>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado de Cuenta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Plan Actual</span>
                    <Badge>Premium</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Próxima Factura</span>
                    <span className="text-sm font-medium">15 Nov 2024</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Último Pago</span>
                    <span className="text-sm font-medium text-green-600">15 Oct 2024</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración General
                  </Button>

                  <Button className="w-full justify-start" variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Preferencias de Notificaciones
                  </Button>

                  <Separator className="my-3" />

                  <Button className="w-full justify-start text-destructive hover:text-destructive" variant="ghost">
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
