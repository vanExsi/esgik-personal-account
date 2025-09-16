"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ServicesCatalog from "@/components/dashboard/services-catalog"

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

export default function ServicesPage() {
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

  const services = [
    {
      id: "1",
      name: "Межевание земельного участка",
      description: "Определение границ земельного участка и подготовка межевого плана",
      price_from: 14000,
      is_active: true,
    },
    {
      id: "2",
      name: "Технический план",
      description: "Подготовка технического плана объекта капитального строительства",
      price_from: 14000,
      is_active: true,
    },
    {
      id: "3",
      name: "Акт обследования",
      description: "Обследование объекта недвижимости и составление акта",
      price_from: 8000,
      is_active: true,
    },
    {
      id: "4",
      name: "Схема расположения земельного участка",
      description: "Подготовка схемы расположения земельного участка на кадастровом плане территории",
      price_from: 10000,
      is_active: true,
    },
    {
      id: "5",
      name: "Топографическая съемка",
      description: "Выполнение топографической съемки участка",
      price_from: 12000,
      is_active: true,
    },
    {
      id: "6",
      name: "Вынос точек в натуру",
      description: "Вынос границ земельного участка в натуру",
      price_from: 800,
      is_active: true,
    },
  ]

  const notifications = []

  return (
    <DashboardLayout user={user} profile={profile} notifications={notifications}>
      <ServicesCatalog services={services} userId={user.id} />
    </DashboardLayout>
  )
}
