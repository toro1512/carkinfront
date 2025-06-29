import { VerificationForm } from "@/components/auth/verification-form"
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