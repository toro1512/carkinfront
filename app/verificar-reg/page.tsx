import { VerificationForm } from "@/components/auth/verification-form"

// Opción 1: Desactiva prerenderizado completamente
export const dynamic = 'force-dynamic'

// Opción 2: Alternativa más óptima (recomendada)
export const dynamicParams = true

export default function VerificationPage({
  searchParams,
}: {
  searchParams: { email?: string; name?: string }
}) {
  return (
    <div className="container mx-auto px-4 py-12">
      <VerificationForm 
        initialEmail={searchParams.email} 
        initialName={searchParams.name} 
      />
    </div>
  )
}