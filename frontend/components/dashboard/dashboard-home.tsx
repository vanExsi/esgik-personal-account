"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, FileText, ShoppingCart, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

interface DashboardHomeProps {
  objects: any[]
  notifications: any[]
  user?: any
  profile?: any
}

export default function DashboardHome({ objects, notifications, user, profile }: DashboardHomeProps) {
  const activeObjects = objects.filter((obj) => obj.status === "in_progress")
  const completedObjects = objects.filter((obj) => obj.status === "completed")

  const getStatusBadge = (status: string) => {
    const statusMap = {
      new: { label: "Новый", variant: "secondary" as const },
      in_progress: { label: "В работе", variant: "default" as const },
      completed: { label: "Завершен", variant: "secondary" as const },
      cancelled: { label: "Отменен", variant: "destructive" as const },
    }
    return statusMap[status as keyof typeof statusMap] || statusMap.new
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Личный кабинет</h1>
        <p className="text-gray-600">Управляйте своими заказами и документами</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные объекты</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeObjects.length}</div>
            <p className="text-xs text-muted-foreground">объектов в работе</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Завершенные</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedObjects.length}</div>
            <p className="text-xs text-muted-foreground">объектов завершено</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Уведомления</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">непрочитанных</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего объектов</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{objects.length}</div>
            <p className="text-xs text-muted-foreground">за все время</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Objects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Последние объекты</CardTitle>
              <CardDescription>Ваши недавние заказы и их статус</CardDescription>
            </div>
            <Link href="/dashboard/objects">
              <Button variant="outline" size="sm">
                Все объекты
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {objects.length === 0 ? (
            <div className="text-center py-8">
              <Building className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Нет объектов</h3>
              <p className="mt-1 text-sm text-gray-500">Начните с заказа услуги</p>
              <div className="mt-6">
                <Link href="/dashboard/services">
                  <Button>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Заказать услугу
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {objects.slice(0, 5).map((object) => {
                const status = getStatusBadge(object.status)
                return (
                  <div key={object.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{object.address}</h4>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {object.services?.name} • {object.cadastral_number}
                      </p>
                      {object.manager_name && <p className="text-sm text-gray-500">Менеджер: {object.manager_name}</p>}
                    </div>
                    <div className="text-right">
                      {object.cost && <p className="font-medium">{object.cost.toLocaleString()} ₽</p>}
                      <p className="text-sm text-gray-500">{new Date(object.created_at).toLocaleDateString("ru-RU")}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <Link href="/dashboard/services">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Заказать услугу
              </CardTitle>
              <CardDescription>Выберите нужную геодезическую или кадастровую услугу</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <Link href="/dashboard/documents">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Документы
              </CardTitle>
              <CardDescription>Просмотрите и подпишите необходимые документы</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <Link href="/dashboard/profile">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Профиль
              </CardTitle>
              <CardDescription>Обновите личную информацию и настройки</CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  )
}
