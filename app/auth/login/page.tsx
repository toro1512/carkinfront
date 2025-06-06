"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/store/auth-store";

const loginSchema = z.object({
  email: z.string().email("Por favor ingresa una dirección de correo válida"),
  password: z.string().min(1, "La contraseña es requerida"),
  rememberMe: z.boolean().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, isLoading, error, clearError } = useAuthStore();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  React.useEffect(() => {
    // Limpiar errores cuando el componente se monta
    clearError();
  }, [clearError]);

  async function onSubmit(data: LoginValues) {
    try {
      await login(data);
      
      toast({
        title: "¡Inicio de sesión exitoso!",
        description: "Bienvenido de vuelta a AutoElite.",
      });
      
      // Redirigir a la página de inicio
      router.push("/");
    } catch (error) {
      // El error ya se maneja en el store
      toast({
        title: "Error al iniciar sesión",
        description: error instanceof Error ? error.message : "Credenciales incorrectas",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12 px-4 md:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Car className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Bienvenido de vuelta</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mostrar credenciales de prueba */}
          <div className="mb-4 p-3 bg-muted rounded-md text-sm">
            <p className="font-medium mb-2">Credenciales de prueba:</p>
            <div className="space-y-1 text-xs">
              <p><strong>Admin:</strong> admin@autoelite.com / admin123</p>
              <p><strong>Vendedor:</strong> dealer@autoelite.com / dealer123</p>
              <p><strong>Cliente:</strong> cliente@ejemplo.com / cliente123</p>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="juan.perez@ejemplo.com" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Contraseña</FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-primary hover:text-primary/90"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="********" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  {...form.register("rememberMe")}
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground"
                >
                  Recordarme por 30 días
                </label>
              </div>
              
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm text-muted-foreground mt-2">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/auth/register"
              className="text-primary underline hover:text-primary/90"
            >
              Regístrate
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}