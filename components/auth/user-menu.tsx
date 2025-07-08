"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  Car, 
  BarChart3, 
  Users,
  Heart,
  FileText,
  Gavel,
  Plus,
  Edit,
  Key,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function UserMenu() {
  const router = useRouter();
  const { toast } = useToast();
  const { 
    user, 
    logout, 
    getUserStatus, 
    getVerificationProgress,
    isAdmin, 
    isDealer, 
    isCustomer,
    isVerified 
  } = useAuthStore();

  if (!user) return null;

  const userStatus = getUserStatus();
  const progress = getVerificationProgress();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
      router.push('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al cerrar sesión.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (firstName: string) => {
    return `${firstName.charAt(0)}`.toUpperCase();
  };

  const getStatusInfo = () => {
    switch (userStatus) {
      case 'logueado':
        console.log(userStatus)
        return {
          badge: <Badge variant="secondary" className="text-xs">Verificación Pendiente</Badge>,
          icon: <Clock className="h-3 w-3 text-orange-500" />,
          color: 'text-orange-600'
        };
      case 'verificado':
        console.log(userStatus)
        return {
          badge: <Badge variant="default" className="text-xs">Verificado</Badge>,
          icon: <CheckCircle className="h-3 w-3 text-green-500" />,
          color: 'text-green-600'
        };
      default:
        console.log(userStatus)
        return {
          badge: <Badge variant="outline" className="text-xs">Visitante</Badge>,
          icon: <User className="h-3 w-3 text-gray-500" />,
          color: 'text-gray-600'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={`${user.name}`} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          {/* Indicador de estado */}
          {userStatus === 'logueado' && (
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-orange-500 rounded-full border-2 border-background" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={`${user.name}`} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">
                  {user.name}</p>
                <p className="text-xs leading-none text-muted-foreground mt-1">
                  {user.email}
                </p>
              </div>
            </div>
            
            {/* Estado y progreso */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                {statusInfo.badge}
                {statusInfo.icon}
              </div>
              
              {/* Progreso de verificación para usuarios logged */}
              {userStatus === 'logueado' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progreso de verificación</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              
              {/* Información del rol para usuarios verificados */}
              {userStatus === 'verificado' && user.role && (
                <div className="text-xs text-muted-foreground">
                  Rol: <span className="font-medium capitalize">{user.role}</span>
                </div>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Opciones de perfil */}
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Mi Perfil</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/profile/edit" className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" />
            <span>Editar Perfil</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/profile/change-password" className="cursor-pointer">
            <Key className="mr-2 h-4 w-4" />
            <span>Cambiar Contraseña</span>
          </Link>
        </DropdownMenuItem>
        
        {/* Verificación - Solo para usuarios logged */}
        {userStatus === 'logueado' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile/verification" className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4 text-orange-600" />
                <span className="text-orange-600 font-medium">Completar Verificación</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        {/* Opciones para usuarios verificados */}
        {userStatus === 'verificado' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Funcionalidades
            </DropdownMenuLabel>
            
            {/* Opciones específicas para clientes */}
            {isCustomer() && (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/favorites" className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Mis Favoritos</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/inquiries" className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Mis Consultas</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            
            {/* Opciones de subastas */}
            <DropdownMenuItem asChild>
              <Link href="/auctions" className="cursor-pointer">
                <Gavel className="mr-2 h-4 w-4" />
                <span>Ver Subastas</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/my-auctions" className="cursor-pointer">
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Mis Subastas</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/create-auction" className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                <span>Crear Subasta</span>
              </Link>
            </DropdownMenuItem>
            
            {/* Opciones específicas para vendedores */}
            {isDealer() && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Vendedor
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/dealer/inventory" className="cursor-pointer">
                    <Car className="mr-2 h-4 w-4" />
                    <span>Mi Inventario</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dealer/leads" className="cursor-pointer">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Clientes Potenciales</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            
            {/* Opciones específicas para administradores */}
            {isAdmin() && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Administración
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard" className="cursor-pointer">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Panel de Control</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/users" className="cursor-pointer">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Gestión de Usuarios</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}