"use client"

import { supabase } from "./supabase/client"

export interface CRMSyncResult {
  success: boolean
  message: string
  isNewUser?: boolean
  crmUser?: any
}

// Функция для синхронизации пользователя с CRM
export async function syncUserWithCRM(phone: string, userId: string): Promise<CRMSyncResult> {
  try {
    const response = await fetch("/api/crm/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, userId }),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Ошибка синхронизации с CRM:", error)
    return {
      success: false,
      message: "Ошибка подключения к CRM системе",
    }
  }
}

// Функция для создания уведомления
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: "info" | "warning" | "success" | "error" = "info",
) {
  try {
    const response = await fetch("/api/notifications/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, title, message, type }),
    })

    return await response.json()
  } catch (error) {
    console.error("Ошибка создания уведомления:", error)
    return { success: false, error: "Ошибка создания уведомления" }
  }
}

// Функция для создания уведомлений о необходимости заполнения профиля
export async function checkAndNotifyIncompleteProfile(userId: string) {
  try {
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

    const { data: personalData } = await supabase.from("personal_data").select("*").eq("user_id", userId).single()

    const notifications = []

    // Проверяем заполненность основного профиля
    if (!profile?.first_name || !profile?.last_name || !profile?.email) {
      notifications.push({
        user_id: userId,
        title: "Заполните профиль",
        message: "Для корректного оформления документов необходимо заполнить основную информацию в профиле",
        type: "warning",
      })
    }

    // Проверяем заполненность персональных данных
    if (!personalData?.passport_series || !personalData?.passport_number || !personalData?.snils) {
      notifications.push({
        user_id: userId,
        title: "Добавьте персональные данные",
        message: "Для оформления документов необходимо указать паспортные данные и СНИЛС",
        type: "warning",
      })
    }

    // Создаем уведомления, если есть что уведомлять
    if (notifications.length > 0) {
      const response = await fetch("/api/notifications/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notifications }),
      })

      return await response.json()
    }

    return { success: true, message: "Профиль заполнен полностью" }
  } catch (error) {
    console.error("Ошибка проверки профиля:", error)
    return { success: false, error: "Ошибка проверки профиля" }
  }
}

// Функция для уведомления о новых документах
export async function notifyNewDocuments(userId: string, documentNames: string[]) {
  const notifications = documentNames.map((name) => ({
    user_id: userId,
    title: "Новый документ для подписи",
    message: `Документ "${name}" готов для ознакомления и подписи`,
    type: "info" as const,
  }))

  try {
    const response = await fetch("/api/notifications/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notifications }),
    })

    return await response.json()
  } catch (error) {
    console.error("Ошибка создания уведомлений о документах:", error)
    return { success: false, error: "Ошибка создания уведомлений" }
  }
}

// Функция для уведомления об изменении статуса объекта
export async function notifyObjectStatusChange(userId: string, objectAddress: string, newStatus: string) {
  const statusMessages = {
    new: "Заказ принят в работу",
    in_progress: "Работы начаты",
    completed: "Работы завершены",
    cancelled: "Заказ отменен",
  }

  const message = statusMessages[newStatus as keyof typeof statusMessages] || "Статус заказа изменен"

  return await createNotification(
    userId,
    "Изменение статуса заказа",
    `${message} по объекту: ${objectAddress}`,
    newStatus === "completed" ? "success" : "info",
  )
}
