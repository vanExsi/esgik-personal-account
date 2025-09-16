"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Building, MessageSquare, Calendar, User, Hash, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface ObjectsListProps {
  objects: any[]
  userId: string
}

export default function ObjectsList({ objects, userId }: ObjectsListProps) {
  const [selectedObject, setSelectedObject] = useState<any>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const getStatusBadge = (status: string) => {
    const statusMap = {
      new: { label: "Новый", variant: "secondary" as const, color: "bg-gray-100 text-gray-800" },
      in_progress: { label: "В работе", variant: "default" as const, color: "bg-blue-100 text-blue-800" },
      completed: { label: "Завершен", variant: "secondary" as const, color: "bg-green-100 text-green-800" },
      cancelled: { label: "Отменен", variant: "destructive" as const, color: "bg-red-100 text-red-800" },
    }
    return statusMap[status as keyof typeof statusMap] || statusMap.new
  }

  const loadChatMessages = async (objectId: string) => {
    const { data } = await supabase
      .from("chats")
      .select("*")
      .eq("object_id", objectId)
      .order("created_at", { ascending: true })

    setChatMessages(data || [])
  }

  const sendMessage = async () => {
    if (!chatMessage.trim() || !selectedObject) return

    setLoading(true)
    try {
      const { error } = await supabase.from("chats").insert({
        object_id: selectedObject.id,
        user_id: userId,
        message: chatMessage,
        sender_type: "client",
      })

      if (!error) {
        setChatMessage("")
        loadChatMessages(selectedObject.id)
      }
    } catch (err) {
      console.error("Ошибка отправки сообщения:", err)
    } finally {
      setLoading(false)
    }
  }

  const openChat = (object: any) => {
    setSelectedObject(object)
    loadChatMessages(object.id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Мои объекты</h1>
        <p className="text-gray-600">Отслеживайте статус ваших заказов и общайтесь с менеджерами</p>
      </div>

      {objects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Нет объектов</h3>
            <p className="mt-2 text-gray-500">Закажите услугу, чтобы начать работу с объектами</p>
            <Button className="mt-4">Заказать услугу</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {objects.map((object) => {
            const status = getStatusBadge(object.status)
            return (
              <Card key={object.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{object.address}</CardTitle>
                        <Badge className={status.color}>{status.label}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Hash className="h-4 w-4" />
                          {object.cadastral_number || "Не указан"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(object.created_at).toLocaleDateString("ru-RU")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {object.total_cost && (
                        <p className="text-lg font-semibold">{object.total_cost.toLocaleString()} ₽</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Вид работ</p>
                      <p className="text-sm text-gray-600">{object.services?.name || "Не указано"}</p>
                    </div>
                    {object.manager_name && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Персональный менеджер</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {object.manager_name}
                        </p>
                      </div>
                    )}
                    {object.cadastral_engineer && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Кадастровый инженер</p>
                        <p className="text-sm text-gray-600">{object.cadastral_engineer}</p>
                      </div>
                    )}
                    {object.geodesist && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Геодезист</p>
                        <p className="text-sm text-gray-600">{object.geodesist}</p>
                      </div>
                    )}
                    {object.visit_date && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Дата выезда</p>
                        <p className="text-sm text-gray-600">{new Date(object.visit_date).toLocaleString("ru-RU")}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => openChat(object)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Чат с менеджером
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Чат по объекту</DialogTitle>
                          <p className="text-sm text-gray-600">{object.address}</p>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="max-h-60 overflow-y-auto space-y-2">
                            {chatMessages.length === 0 ? (
                              <p className="text-center text-gray-500 py-4">Сообщений пока нет</p>
                            ) : (
                              chatMessages.map((msg) => (
                                <div
                                  key={msg.id}
                                  className={`p-2 rounded-lg ${
                                    msg.sender_type === "client" ? "bg-blue-100 ml-4" : "bg-gray-100 mr-4"
                                  }`}
                                >
                                  <p className="text-sm">{msg.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(msg.created_at).toLocaleString("ru-RU")}
                                  </p>
                                </div>
                              ))
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Textarea
                              value={chatMessage}
                              onChange={(e) => setChatMessage(e.target.value)}
                              placeholder="Введите сообщение..."
                              className="flex-1"
                              rows={2}
                            />
                            <Button onClick={sendMessage} disabled={loading || !chatMessage.trim()}>
                              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Отправить"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
