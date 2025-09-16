"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ObjectsList from "@/components/dashboard/objects-list"

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

export default function ObjectsPage() {
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
      manager_name: "Иванов Иван Иванович",
      cadastral_engineer: "Петров Петр Петрович",
      surveyor: "Сидоров Сидор Сидорович",
      visit_date: "2024-01-15T10:00:00Z",
      cost: 14000,
      services: { name: "Межевой план", description: "Подготовка межевого плана земельного участка" },
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      address: "г. Орехово-Зуево, ул. Пушкина, д. 5",
      cadastral_number: "50:23:0010102:2",
      status: "completed",
      manager_name: "Козлова Анна Петровна",
      cadastral_engineer: "Федоров Федор Федорович",
      surveyor: "Николаев Николай Николаевич",
      visit_date: "2024-01-10T14:00:00Z",
      cost: 8000,
      services: { name: "Акт обследования", description: "Акт обследования объекта недвижимости" },
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ]

  const notifications = [
    {
      id: "1",
      title: "Обновление по объекту",
      message: "Межевой план готов к подписанию",
      type: "object",
      is_read: false,
      created_at: new Date().toISOString(),
    },
  ]

  return (
    <DashboardLayout user={user} profile={profile} notifications={notifications}>
      <ObjectsList objects={objects} userId={user.id} />
    </DashboardLayout>
  )
}
