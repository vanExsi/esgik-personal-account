"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import DashboardHome from "@/components/dashboard/dashboard-home"

interface User {
  id: string
  phone: string
  created_at: string
}

interface Profile {
  id: string
  phone: string
  first_name?: string
  last_name?: string
  middle_name?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)
    setProfile({
      id: userData.id,
      phone: userData.phone,
      first_name: userData.first_name,
      last_name: userData.last_name,
      middle_name: userData.middle_name,
    })
    setLoading(false)
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>
  }

  if (!user) {
    return null
  }

  const objects = [
    {
      id: "1",
      address: "г. Орехово-Зуево, ул. Ленина, д. 1",
      cadastral_number: "50:23:0010101:1",
      status: "in_progress",
      services: { name: "Межевой план" },
      created_at: new Date().toISOString(),
    },
  ]

  const notifications = [
    {
      id: "1",
      title: "Новый документ для подписи",
      message: "Поступил межевой план для подписи",
      type: "document",
      is_read: false,
      created_at: new Date().toISOString(),
    },
  ]

  return (
    <DashboardLayout user={user} profile={profile} notifications={notifications}>
      <DashboardHome objects={objects} notifications={notifications} user={user} profile={profile} />
    </DashboardLayout>
  )
}
