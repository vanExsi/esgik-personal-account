"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import DocumentsManager from "@/components/dashboard/documents-manager"

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

export default function DocumentsPage() {
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

  const documents = [
    {
      id: "1",
      user_id: user.id,
      object_id: "1",
      name: "Межевой план участка",
      file_path: "/demo/межевой-план.pdf",
      file_size: 2048576,
      status: "pending_signature",
      uploaded_at: new Date().toISOString(),
      objects: {
        address: "г. Орехово-Зуево, ул. Ленина, д. 1",
        cadastral_number: "50:23:0010101:1",
      },
    },
    {
      id: "2",
      user_id: user.id,
      object_id: "2",
      name: "Акт обследования",
      file_path: "/demo/акт-обследования.pdf",
      file_size: 1024768,
      status: "signed",
      uploaded_at: new Date(Date.now() - 86400000).toISOString(),
      objects: {
        address: "г. Орехово-Зуево, ул. Пушкина, д. 5",
        cadastral_number: "50:23:0010102:2",
      },
    },
  ]

  const notifications = [
    {
      id: "1",
      title: "Новый документ для подписи",
      message: "Поступил межевой план для подписания",
      type: "document",
      is_read: false,
      created_at: new Date().toISOString(),
    },
  ]

  return (
    <DashboardLayout user={user} profile={profile} notifications={notifications}>
      <DocumentsManager documents={documents} userId={user.id} />
    </DashboardLayout>
  )
}
