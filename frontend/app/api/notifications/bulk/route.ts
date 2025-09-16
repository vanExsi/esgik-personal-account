import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Функция для создания массовых уведомлений
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { notifications } = await request.json()

    if (!notifications || !Array.isArray(notifications)) {
      return NextResponse.json({ error: "Неверный формат данных" }, { status: 400 })
    }

    const { data, error } = await supabase.from("notifications").insert(notifications)

    if (error) {
      return NextResponse.json({ error: "Ошибка создания уведомлений" }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: notifications.length })
  } catch (error) {
    console.error("Ошибка создания массовых уведомлений:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
