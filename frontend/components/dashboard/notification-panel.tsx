"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Bell, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface NotificationPanelProps {
  notifications: any[]
  onClose: () => void
  userId: string
}

export default function NotificationPanel({ notifications, onClose, userId }: NotificationPanelProps) {
  const [localNotifications, setLocalNotifications] = useState(notifications)

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

      setLocalNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    } catch (error) {
      console.error("Ошибка при отметке уведомления как прочитанного:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId).eq("is_read", false)

      setLocalNotifications([])
    } catch (error) {
      console.error("Ошибка при отметке всех уведомлений как прочитанных:", error)
    }
  }

  const getTypeColor = (type: string) => {
    const colors = {
      info: "bg-blue-100 text-blue-800",
      warning: "bg-yellow-100 text-yellow-800",
      success: "bg-green-100 text-green-800",
      error: "bg-red-100 text-red-800",
    }
    return colors[type as keyof typeof colors] || colors.info
  }

  return (
    <div className="absolute top-0 right-0 z-50 w-96 max-w-full">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Уведомления
          </CardTitle>
          <div className="flex items-center gap-2">
            {localNotifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <CheckCircle className="h-4 w-4 mr-1" />
                Все прочитано
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          {localNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Нет уведомлений</h3>
              <p className="mt-1 text-sm text-gray-500">Все уведомления прочитаны</p>
            </div>
          ) : (
            <div className="space-y-3">
              {localNotifications.map((notification) => (
                <div key={notification.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <Badge className={`text-xs ${getTypeColor(notification.type)}`}>{notification.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.created_at).toLocaleString("ru-RU")}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
