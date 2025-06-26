"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Captcha } from "./captcha"
import { validatePassword, validateEmail } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Check, X } from 'lucide-react'
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import logo from '@/public/logoisocol.png';

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [captchaToken, setCaptchaToken] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const { register } = useAuth()
  const router = useRouter()
  const { toast } = useToast();

  const passwordValidation = validatePassword(password)
  const emailIsValid = validateEmail(email)

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos.")
      return
    }

    if (!emailIsValid) {
      setError("Por favor, ingresa un correo electrónico válido.")
      return
    }

    if (!passwordValidation.isValid) {
      setError("La contraseña no cumple con los requisitos de seguridad.")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    if (!captchaToken) {
      setError("Por favor, completa la verificación de captcha.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const success = await register(name, email, password, captchaToken)
      if (success) {
        setSuccess(true)
        // Redirigir a la página de verificación
        router.push(`/verificar-reg?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`)
      }


    } catch (error) {
      // El error ya se maneja en el store
      toast({
        title: "Error al registrar",
        description: error instanceof Error ? error.message : "Dato incorrectas",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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
          </div>
        <CardTitle className="text-2xl text-center">Crear Cuenta</CardTitle>
        <CardDescription className="text-center">Completa el formulario para crear una nueva cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-700">
              ¡Registro exitoso! Te hemos enviado un código de verificación a tu correo electrónico.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {password && (
                <div className="text-sm space-y-1 mt-2">
                  <p className="font-medium">La contraseña debe tener:</p>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="flex items-center">
                      {passwordValidation.hasMinLength ? (
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span>Al menos 8 caracteres</span>
                    </div>
                    <div className="flex items-center">
                      {passwordValidation.hasUpperCase ? (
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span>Una mayúscula</span>
                    </div>
                    <div className="flex items-center">
                      {passwordValidation.hasLowerCase ? (
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span>Una minúscula</span>
                    </div>
                    <div className="flex items-center">
                      {passwordValidation.hasNumber ? (
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span>Un número</span>
                    </div>
                    <div className="flex items-center">
                      {passwordValidation.hasSpecialChar ? (
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span>Un carácter especial</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={confirmPassword && password !== confirmPassword ? "border-red-500" : ""}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-red-500">Las contraseñas no coinciden.</p>
              )}
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

            <Button
              type="submit"
              className="w-full"
              disabled={
                isSubmitting ||
                !passwordValidation.isValid ||
                password !== confirmPassword ||
                !emailIsValid ||
                !captchaToken
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Crear Cuenta"
              )}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-sm text-gray-500">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Iniciar Sesión
          </Link>
        </p>
      </CardFooter>
      
        {/* Información sobre privacidad */}
        <div className="bg-green-50 border border-green-200 p-4 mt-8">
          <h3 className="text-sm font-medium text-green-800 mb-2">
            Tu privacidad es importante
          </h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Nunca compartimos tu información personal</li>
            <li>• Tus datos están protegidos con encriptación</li>
            <li>• Puedes eliminar tu cuenta en cualquier momento</li>
            <li>• Solo enviamos notificaciones relevantes</li>
          </ul>
        </div>

        {/* Beneficios de registrarse */}
        <div className="bg-blue-50 border border-blue-200 p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            ¿Por qué crear una cuenta?
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Guarda tus carros favoritos para verlos después</li>
            <li>• Recibe alertas de nuevos carros que te interesen</li>
            <li>• Accede a precios y ofertas exclusivas</li>
            <li>• Gestiona todas tus consultas en un solo lugar</li>
            <li>• Historial de búsquedas personalizadas</li>
            <li>• Proceso de compra más rápido y seguro</li>
          </ul>
        </div>

        {/* Términos y condiciones */}
        <div className="text-xs text-gray-500 text-center">
          Al crear una cuenta, aceptas nuestros{' '}
          <Link href="/terms" className="text-blue-600 hover:text-blue-500 underline">
            Términos y Condiciones
          </Link>{' '}
          y nuestra{' '}
          <Link href="/privacy" className="text-blue-600 hover:text-blue-500 underline">
            Política de Privacidad
          </Link>
        </div>
    </Card>
    
  )
}