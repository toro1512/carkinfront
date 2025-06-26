"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'

export function VerificationForm() {
  const [code, setCode] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const { verifyEmail, resendVerificationCode } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
 
  useEffect(() => {
    // Obtener el email de los parámetros de la URL
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
    const nameParam = searchParams.get("name")
    if (nameParam) {
      setName(nameParam)
    }
  }, [searchParams])

  useEffect(() => {
    // Contador para el tiempo de espera para reenviar el código
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("El correo electrónico es requerido.")
      return
    }
    if (!name) {
      setError("El nombre es requerido.")
      return
    }

    if (!code) {
      setError("Por favor, ingresa el código de verificación.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const success = await verifyEmail(name, email, code)
      console.log(success)

      if (success) {
        // Redirigir al inicio después de la verificación exitosa
        router.push("/")
      } else {
        setError("Código de verificación incorrecto. Por favor, inténtalo de nuevo.")
      }
    } catch (err) {
      setError("Ocurrió un error al verificar el correo. Por favor, inténtalo de nuevo.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      setError("El correo electrónico es requerido.")
      return
    }

    setIsResending(true)
    setError("")
    setResendSuccess(false)

    try {
      const success = await resendVerificationCode(email,name)

      if (success) {
        setResendSuccess(true)
        setCountdown(60) // Esperar 60 segundos antes de permitir otro reenvío
      } else {
        setError("Error al reenviar el código. Por favor, inténtalo de nuevo.")
      }
    } catch (err) {
      setError("Ocurrió un error al reenviar el código. Por favor, inténtalo de nuevo.")
      console.error(err)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verificar Correo Electrónico</CardTitle>
        <CardDescription>Ingresa el código de verificación enviado a tu correo</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={!!searchParams.get("email")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="verification-code">Código de Verificación</Label>
            <Input
              id="verification-code"
              type="text"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <p className="text-sm text-gray-500">
              Hemos enviado un código de verificación a tu correo electrónico. Si no lo encuentras, revisa tu carpeta de
              spam.
            </p>
          </div>

          {resendSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-700">
                Hemos enviado un nuevo código de verificación a tu correo electrónico.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar Cuenta"
            )}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={handleResendCode}
              disabled={isResending || countdown > 0}
              className="text-sm"
            >
              {countdown > 0
                ? `Reenviar código (${countdown}s)`
                : isResending
                  ? "Reenviando..."
                  : "¿No recibiste el código? Reenviar"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          <Link href="/auth/register" className="text-primary hover:underline">
            Volver al registro
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}