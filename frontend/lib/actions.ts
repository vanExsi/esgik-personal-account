"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"

export async function signOut() {
  // В серверном действии мы не можем напрямую работать с localStorage
  // Поэтому перенаправляем на специальную страницу выхода
  redirect("/auth/logout")
}

export async function ensureUserProfile(userId: string, phone: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  // Проверяем, существует ли профиль
  const { data: existingProfile } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (!existingProfile) {
    // Создаем профиль, если его нет
    const { error } = await supabase.from("profiles").insert({
      id: userId,
      phone,
      full_name: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Ошибка создания профиля:", error)
      throw error
    }
  }
}

export async function signInWithPhone(phone: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  // Форматируем номер телефона для международного формата
  const formattedPhone = phone.startsWith("+") ? phone : `+7${phone.replace(/\D/g, "")}`

  const { error } = await supabase.auth.signInWithOtp({
    phone: formattedPhone,
  })

  if (error) {
    throw error
  }
}

export async function verifyOtp(phone: string, token: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const formattedPhone = phone.startsWith("+") ? phone : `+7${phone.replace(/\D/g, "")}`

  const { data, error } = await supabase.auth.verifyOtp({
    phone: formattedPhone,
    token,
    type: "sms",
  })

  if (error) {
    throw error
  }

  if (data.user) {
    await ensureUserProfile(data.user.id, formattedPhone)
  }

  return data
}
