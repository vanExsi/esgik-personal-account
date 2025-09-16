"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import PersonalDataForm from "@/components/dashboard/personal-data-form"

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

export default function PersonalDataPage() {
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

  const personalData = {
    id: user.id,
    user_id: user.id,
    passport_series: "",
    passport_number: "",
    passport_issued_by: "",
    passport_issued_date: "",
    passport_address: "",
    snils: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const notifications = [
    {
      id: "1",
      title: "Заполните персональные данные",
      message: "Для оформления документов необходимо заполнить паспортные данные",
      type: "personal_data",
      is_read: false,
      created_at: new Date().toISOString(),
    },
  ]

  return (
    <DashboardLayout user={user} profile={profile} notifications={notifications}>
      <PersonalDataForm personalData={personalData} userId={user.id} />
    </DashboardLayout>
  )
}
