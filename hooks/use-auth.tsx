"use client"

import type React from "react"

import { useState, createContext, useContext } from "react"
import type { User } from "@/types/auth"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, captchaToken: string) => Promise<{ success: boolean; needsVerification?: boolean; error?: string }>
  register: (name: string, email: string, password: string, captchaToken: string) => Promise<boolean>
  logout: () => Promise<void>
  verifyEmail: (name:string, email: string, code: string) => Promise<boolean>
  resendVerificationCode: (email: string, name:string) => Promise<boolean>
}

// Crear el contexto con un valor inicial undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvidermio({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

   const login = async (email: string, password: string, captchaToken: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, captchaToken }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        return { success: true }
      } else {
        // Verificar si el usuario necesita verificar su correo
        if (response.status === 403 && data.needsVerification) {
          return { success: false, needsVerification: true }
        }
        return { success: false, error: data.error || "Error al iniciar sesión" }
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      return { success: false, error: "Error de conexión" }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, captchaToken: string) => {
    setIsLoading(true)
    try {
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/pre-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, captchaToken }),
      })
      const data = await response.json();
     if (!response.ok) {
      // Lanza el mensaje de error del backend (ej. "El correo electrónico ya está registrado")
      throw new Error(data.error || "Error al registrar");
    }
    return true;
    } catch (error) {
    console.error("Error al registrarse:", error);
    throw error; // Propaga el error hacia el componente
  } finally {
    setIsLoading(false);
  }
  }

  const verifyEmail = async (name:string, email: string, code: string) => {
    setIsLoading(true)
    try {
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-and-register`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email , code }),
      })
      const data = await response.json()
      if (response.ok) {
        setUser(data.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Error al verificar el correo:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerificationCode = async (email: string, name:string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      })
const data = await response.json();

     if (!response.ok) {
      // Lanza el mensaje de error del backend (ej. "El correo electrónico ya está registrado")
      throw new Error(data.error || "Error al registrar");
    }
    return true;
    } catch (error) {
    console.error("Error al registrarse:", error);
    throw error; // Propaga el error hacia el componente
  } finally {
    setIsLoading(false);
  }
  }

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {
        method: "POST",
      })
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    verifyEmail,
    resendVerificationCode,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}