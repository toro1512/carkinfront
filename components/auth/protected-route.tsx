"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { UserRole } from '@/lib/types/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  fallbackPath?: string;
  showFallback?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  fallbackPath = '/auth/login',
  showFallback = true 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, hasAnyRole } = useAuthStore();

  // Si no está autenticado
  if (!isAuthenticated) {
    if (showFallback) {
      return (
        <div className="container flex items-center justify-center min-h-screen py-12 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <ShieldAlert className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle>Acceso Restringido</CardTitle>
              <CardDescription>
                Necesitas iniciar sesión para acceder a esta página
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => router.push(fallbackPath)} 
                className="w-full"
              >
                Iniciar Sesión
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.back()} 
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      router.push(fallbackPath);
      return null;
    }
  }

  // Si está autenticado pero no tiene los roles requeridos
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    if (showFallback) {
      return (
        <div className="container flex items-center justify-center min-h-screen py-12 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <ShieldAlert className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle>Permisos Insuficientes</CardTitle>
              <CardDescription>
                No tienes los permisos necesarios para acceder a esta página
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                <p>Tu rol actual: <span className="font-medium capitalize">{user?.role}</span></p>
                <p>Roles requeridos: <span className="font-medium">{requiredRoles.join(', ')}</span></p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.back()} 
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      router.push('/');
      return null;
    }
  }

  // Si tiene acceso, mostrar el contenido
  return <>{children}</>;
}