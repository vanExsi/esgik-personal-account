"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import PartnershipDashboard from "@/components/dashboard/partnership-dashboard"

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

export default function PartnershipPage() {
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

  const partnerOrders = [
    {
      id: "1",
      partner_id: user.id,
      service_id: "1",
      cadastral_number: "50:23:0010103:3",
      address: "г. Орехово-Зуево, ул. Гагарина, д. 10",
      client_id: "1",
      status: "pending_calculation",
      estimated_cost: null,
      partner_commission: null,
      comments: "Срочный заказ",
      created_at: new Date().toISOString(),
      services: { name: "Межевой план" },
      partner_clients: { first_name: "Анна", last_name: "Петрова", middle_name: "Ивановна" },
    },
  ]

  const partnerClients = [
    {
      id: "1",
      partner_id: user.id,
      first_name: "Анна",
      last_name: "Петрова",
      middle_name: "Ивановна",
      passport_series: "1234",
      passport_number: "567890",
      passport_issued_by: "ОУФМС России",
      passport_issued_date: "2010-05-15",
      passport_address: "г. Орехово-Зуево, ул. Ленина, д. 20, кв. 5",
      snils: "123-456-789 00",
      created_at: new Date().toISOString(),
    },
  ]

  const referrals = [
    {
      id: "1",
      partner_id: user.id,
      referred_user_id: "ref1",
      commission_earned: 2100,
      status: "completed",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      profiles: { first_name: "Михаил", last_name: "Сидоров", phone: "+7 (999) 123-45-67" },
    },
  ]

  const services = [
    { id: "1", name: "Межевой план", price_from: 14000 },
    { id: "2", name: "Технический план", price_from: 14000 },
    { id: "3", name: "Акт обследования", price_from: 8000 },
    { id: "4", name: "Схема ЗУ на КПТ", price_from: 10000 },
    { id: "5", name: "Топографическая съемка", price_from: 12000 },
    { id: "6", name: "Вынос границ", price_from: 800 },
  ]

  const notifications = []

  return (
    <DashboardLayout user={user} profile={profile} notifications={notifications}>
      <PartnershipDashboard
        partnerOrders={partnerOrders}
        partnerClients={partnerClients}
        referrals={referrals}
        services={services}
        userId={user.id}
      />
    </DashboardLayout>
  )
}
