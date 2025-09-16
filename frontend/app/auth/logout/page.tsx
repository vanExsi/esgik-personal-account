"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("easgik_users")
    router.push("/auth/login")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">Выход из системы...</h1>
        <p className="text-gray-600">Пожалуйста, подождите</p>
      </div>
    </div>
  )
}
