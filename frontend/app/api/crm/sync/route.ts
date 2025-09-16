import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Симуляция API CRM системы
const CRM_API_BASE = process.env.CRM_API_URL || "https://crm.easgik.local/api"

interface CRMUser {
  id: string
  phone: string
  first_name?: string
  last_name?: string
  middle_name?: string
  email?: string
  objects?: CRMObject[]
}

interface CRMObject {
  id: string
  address: string
  cadastral_number?: string
  status: string
  service_name: string
  manager_name?: string
  cadastral_engineer?: string
  geodesist?: string
  visit_date?: string
  total_cost?: number
}

// Функция для получения данных пользователя из CRM
async function getCRMUserByPhone(phone: string): Promise<CRMUser | null> {
  try {
    // В реальном приложении здесь будет запрос к CRM API
    // Для демонстрации возвращаем тестовые данные
    const testUsers: CRMUser[] = [
      {
        id: "crm_001",
        phone: "+79991234567",
        first_name: "Иван",
        last_name: "Петров",
        middle_name: "Сергеевич",
        email: "ivan.petrov@example.com",
        objects: [
          {
            id: "obj_001",
            address: "г. Орехово-Зуево, ул. Ленина, д. 10",
            cadastral_number: "50:23:0010101:1",
            status: "in_progress",
            service_name: "Межевой план",
            manager_name: "Анна Смирнова",
            cadastral_engineer: "Петр Иванов",
            geodesist: "Сергей Козлов",
            visit_date: "2024-01-15T10:00:00Z",
            total_cost: 15000,
          },
        ],
      },
      {
        id: "crm_002",
        phone: "+79997654321",
        first_name: "Мария",
        last_name: "Сидорова",
        middle_name: "Александровна",
        email: "maria.sidorova@example.com",
        objects: [
          {
            id: "obj_002",
            address: "г. Орехово-Зуево, ул. Пушкина, д. 5",
            cadastral_number: "50:23:0010102:2",
            status: "completed",
            service_name: "Технический план",
            manager_name: "Дмитрий Волков",
            total_cost: 12000,
          },
        ],
      },
    ]

    return testUsers.find((user) => user.phone === phone) || null
  } catch (error) {
    console.error("Ошибка получения данных из CRM:", error)
    return null
  }
}

// Функция для создания пользователя в CRM
async function createCRMUser(userData: Partial<CRMUser>): Promise<string | null> {
  try {
    // В реальном приложении здесь будет POST запрос к CRM API
    console.log("Создание пользователя в CRM:", userData)
    return `crm_${Date.now()}`
  } catch (error) {
    console.error("Ошибка создания пользователя в CRM:", error)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { phone, userId } = await request.json()

    if (!phone || !userId) {
      return NextResponse.json({ error: "Отсутствуют обязательные параметры" }, { status: 400 })
    }

    // Получаем данные пользователя из CRM
    const crmUser = await getCRMUserByPhone(phone)

    if (crmUser) {
      // Пользователь найден в CRM, обновляем профиль
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: crmUser.first_name,
          last_name: crmUser.last_name,
          middle_name: crmUser.middle_name,
          email: crmUser.email,
          crm_id: crmUser.id,
        })
        .eq("id", userId)

      if (profileError) {
        console.error("Ошибка обновления профиля:", profileError)
      }

      // Синхронизируем объекты из CRM
      if (crmUser.objects && crmUser.objects.length > 0) {
        // Получаем услуги для сопоставления
        const { data: services } = await supabase.from("services").select("*")

        for (const crmObject of crmUser.objects) {
          // Находим соответствующую услугу
          const service = services?.find((s) => s.name === crmObject.service_name)

          const { error: objectError } = await supabase.from("objects").upsert(
            {
              user_id: userId,
              address: crmObject.address,
              cadastral_number: crmObject.cadastral_number,
              status: crmObject.status,
              service_id: service?.id,
              manager_name: crmObject.manager_name,
              cadastral_engineer: crmObject.cadastral_engineer,
              geodesist: crmObject.geodesist,
              visit_date: crmObject.visit_date,
              total_cost: crmObject.total_cost,
              crm_object_id: crmObject.id,
            },
            { onConflict: "crm_object_id" },
          )

          if (objectError) {
            console.error("Ошибка синхронизации объекта:", objectError)
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: "Данные успешно синхронизированы из CRM",
        crmUser,
      })
    } else {
      // Пользователь не найден в CRM, создаем новую запись
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (profile) {
        const crmId = await createCRMUser({
          phone: profile.phone,
          first_name: profile.first_name,
          last_name: profile.last_name,
          middle_name: profile.middle_name,
          email: profile.email,
        })

        if (crmId) {
          // Обновляем профиль с CRM ID
          await supabase.from("profiles").update({ crm_id: crmId }).eq("id", userId)
        }
      }

      return NextResponse.json({
        success: true,
        message: "Пользователь создан в CRM",
        isNewUser: true,
      })
    }
  } catch (error) {
    console.error("Ошибка синхронизации с CRM:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
