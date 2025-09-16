"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ProfileForm from "@/components/dashboard/profile-form"

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

export default function ProfilePage() {
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

  const promocodes = [
    { id: "1", code: "DEMO10", discount_percent: 10, is_active: true },
    { id: "2", code: "NEWCLIENT", discount_percent: 15, is_active: true },
  ]

  const notifications = [
    {
      id: "1",
      title: "Заполните профиль",
      message: "Добавьте способ оплаты и доставки",
      type: "profile",
      is_read: false,
      created_at: new Date().toISOString(),
    },
  ]

  return (
    <DashboardLayout user={user} profile={profile} notifications={notifications}>
      <ProfileForm profile={profile} promocodes={promocodes} />
    </DashboardLayout>
  )
}
