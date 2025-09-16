import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { userId, title, message, type = "info" } = await request.json()

    if (!userId || !title || !message) {
      return NextResponse.json({ error: "Отсутствуют обязательные параметры" }, { status: 400 })
    }

    const { data, error } = await supabase.from("notifications").insert({
      user_id: userId,
      title,
      message,
      type,
    })

    if (error) {
      return NextResponse.json({ error: "Ошибка создания уведомления" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Ошибка создания уведомления:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
