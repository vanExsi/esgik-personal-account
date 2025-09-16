import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import RegisterForm from "@/components/auth/register-form"

export default async function RegisterPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Если пользователь уже авторизован, перенаправляем в кабинет
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  )
}
