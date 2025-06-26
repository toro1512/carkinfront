"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Captcha } from "@/components/auth/captcha"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { validateEmail } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'
import Image from 'next/image';
import logo from '@/public/logoisocol.png';

//eliminar esta importaciones es para simular

import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [captchaToken, setCaptchaToken] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)

  const { login } = useAuth() ;
  const { toast } = useToast();

  
  const router = useRouter() 
  const emailIsValid = validateEmail(email)


  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (!email || !password) {
      setError("Por favor, completa todos los campos.")
      return
    }
    if (!emailIsValid) {
      setError("Por favor, ingresa un correo electrónico válido.")
      return
    }

    if (!captchaToken) {
      setError("Por favor, completa la verificación de captcha.")
      return
    }

    setIsSubmitting(true)
    setError("")
    setNeedsVerification(false)
    
    try {
      const result = await login(email, password, captchaToken)

      if (result.success) {
        toast({
        title: "Bienvenido Carking",
        description: "Sitio de carros para todos los Gustos",
        variant: "destructive",
      });
        router.push("/")
      } else if (result.needsVerification) {
        setNeedsVerification(true)
      } else {
        setError(result.error || "Credenciales incorrectas. Por favor, inténtalo de nuevo.")
      }
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
  <div className="container flex items-center justify-center min-h-screen py-12 px-4 md:px-6 lg:px-8">
    <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
            <div className="h-16 w-16 flex items-center justify-center">
              <Image 
                src={logo}
                alt="Logo"
                width={100}  // Ajusta según necesidad
                height={100}
                className="h-14 w-14 object-contain" // Mantienes las mismas dimensiones
              />
            </div>
            <div className="mb-4 p-3 bg-muted rounded-md text-sm">
            <p className="font-medium mb-2">Credenciales de prueba:</p>
            <div className="space-y-1 text-xs">
              <p><strong>Admin:</strong> admin@autoelite.com / admin123</p>
              <p><strong>Vendedor:</strong> dealer@autoelite.com / dealer123</p>
              <p><strong>Cliente:</strong> cliente@ejemplo.com / cliente123</p>
            </div>
          </div>
            </div>
            <CardTitle className="text-2xl text-center">Iniciar Sesion</CardTitle>
            <CardDescription className="text-center">Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        {needsVerification ? (
          <div className="space-y-4">
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-yellow-800">
                Tu cuenta no ha sido verificada. Por favor, verifica tu correo electrónico para continuar.
              </AlertDescription>
            </Alert>
            <Button
              className="w-full"
              onClick={() => router.push(`/verificacion?email=${encodeURIComponent(email)}`)}
            >
              Ir a verificación
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={email && !emailIsValid ? "border-red-500" : ""}
              />
              {email && !emailIsValid && (
                <p className="text-sm text-red-500">Por favor, ingresa un correo electrónico válido.</p>
              )}
            </div>            

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Verificación de Captcha</Label>
              <Captcha onVerify={handleCaptchaVerify} />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          ¿No tienes una cuenta?{" "}
          <Link href="/registro" className="text-primary hover:underline">
            Regístrate
          </Link>
        </p>
      </CardFooter>
    </Card>
   </div>
  )
}