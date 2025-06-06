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
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  Car, 
  BarChart3, 
  Users,
  Heart,
  ShoppingCart,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function UserMenu() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout, isAdmin, isDealer, isCustomer } = useAuthStore();

  if (!user) return null;

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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'dealer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'customer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'dealer':
        return 'Vendedor';
      case 'customer':
        return 'Cliente';
      default:
        return role;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground mt-1">
                  {user.email}
                </p>
              </div>
            </div>
            <Badge className={`w-fit text-xs ${getRoleBadgeColor(user.role)}`}>
              {getRoleLabel(user.role)}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Opciones comunes para todos los usuarios */}
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Mi Perfil</span>
          </Link>
        </DropdownMenuItem>
        
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
  <Link href="/profile/verification" className="cursor-pointer">
    <Shield className="mr-2 h-4 w-4" />
    <span>Verificar Cuenta</span>
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
        
        {/* Opciones específicas para vendedores */}
        {isDealer() && (
          <>
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
            <DropdownMenuItem asChild>
              <Link href="/dealer/sales" className="cursor-pointer">
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Mis Ventas</span>
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
            <DropdownMenuItem asChild>
              <Link href="/admin/inventory" className="cursor-pointer">
                <Car className="mr-2 h-4 w-4" />
                <span>Gestión de Inventario</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings" className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                <span>Configuración del Sistema</span>
              </Link>
            </DropdownMenuItem>
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