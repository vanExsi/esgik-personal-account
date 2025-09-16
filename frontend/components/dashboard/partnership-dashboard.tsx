"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Plus,
  FileText,
  DollarSign,
  LinkIcon,
  Copy,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
} from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface PartnershipDashboardProps {
  partnerOrders: any[]
  partnerClients: any[]
  referrals: any[]
  services: any[]
  userId: string
}

export default function PartnershipDashboard({
  partnerOrders,
  partnerClients,
  referrals,
  services,
  userId,
}: PartnershipDashboardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedService, setSelectedService] = useState("")

  // Генерируем реферальную ссылку
  const referralCode = `PARTNER_${userId.slice(0, 8).toUpperCase()}`
  const referralLink = `${window.location.origin}/auth/register?ref=${referralCode}`

  // Подсчитываем статистику
  const totalEarnings = referrals.reduce((sum, ref) => sum + (ref.commission_earned || 0), 0)
  const pendingOrders = partnerOrders.filter((order) => order.status === "pending").length
  const acceptedOrders = partnerOrders.filter((order) => order.status === "accepted").length

  const handleCreateOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const orderData = {
      partner_id: userId,
      client_id: formData.get("client_id") as string,
      service_id: selectedService,
      cadastral_number: formData.get("cadastral_number") as string,
      address: formData.get("address") as string,
      comments: formData.get("comments") as string,
      status: "pending",
    }

    try {
      const { error } = await supabase.from("partner_orders").insert(orderData)

      if (error) {
        setError("Ошибка создания заказа")
      } else {
        setSuccess("Заказ успешно создан и отправлен на расчет")
        // Сброс формы
        ;(e.target as HTMLFormElement).reset()
        setSelectedService("")
      }
    } catch (err) {
      setError("Произошла ошибка")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const clientData = {
      partner_id: userId,
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      middle_name: formData.get("middle_name") as string,
      passport_series: formData.get("passport_series") as string,
      passport_number: formData.get("passport_number") as string,
      passport_issued_by: formData.get("passport_issued_by") as string,
      passport_issued_date: formData.get("passport_issued_date") as string,
      passport_registration_address: formData.get("passport_registration_address") as string,
      snils: formData.get("snils") as string,
    }

    try {
      const { error } = await supabase.from("partner_clients").insert(clientData)

      if (error) {
        setError("Ошибка создания контрагента")
      } else {
        setSuccess("Контрагент успешно добавлен")
        ;(e.target as HTMLFormElement).reset()
      }
    } catch (err) {
      setError("Произошла ошибка")
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptOrder = async (orderId: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.from("partner_orders").update({ status: "accepted" }).eq("id", orderId)

      if (error) {
        setError("Ошибка принятия заказа")
      } else {
        setSuccess("Заказ принят")
        window.location.reload()
      }
    } catch (err) {
      setError("Произошла ошибка")
    } finally {
      setLoading(false)
    }
  }

  const handleRejectOrder = async (orderId: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.from("partner_orders").update({ status: "rejected" }).eq("id", orderId)

      if (error) {
        setError("Ошибка отклонения заказа")
      } else {
        setSuccess("Заказ отклонен")
        window.location.reload()
      }
    } catch (err) {
      setError("Произошла ошибка")
    } finally {
      setLoading(false)
    }
  }

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    setSuccess("Реферальная ссылка скопирована!")
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Ожидает расчета", color: "bg-yellow-100 text-yellow-800", icon: Clock },
      quoted: { label: "Рассчитано", color: "bg-blue-100 text-blue-800", icon: DollarSign },
      accepted: { label: "Принято", color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { label: "Отклонено", color: "bg-red-100 text-red-800", icon: XCircle },
      completed: { label: "Завершено", color: "bg-gray-100 text-gray-800", icon: CheckCircle },
    }
    return statusMap[status as keyof typeof statusMap] || statusMap.pending
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Партнерский сервис</h1>
        <p className="text-gray-600">Управляйте заказами, контрагентами и отслеживайте заработок</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription className="text-green-600">{success}</AlertDescription>
        </Alert>
      )}

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ожидают расчета</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Принятые заказы</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptedOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Контрагенты</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partnerClients.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заработано</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarnings.toLocaleString()} ₽</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Заказы</TabsTrigger>
          <TabsTrigger value="clients">Мои контрагенты</TabsTrigger>
          <TabsTrigger value="program">Партнерская программа</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Заказы</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Создать заявку
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Создать заявку на работу</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateOrder} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="service">Услуга *</Label>
                      <Select value={selectedService} onValueChange={setSelectedService} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите услугу" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">Другое</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client_id">Контрагент *</Label>
                      <Select name="client_id" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите контрагента" />
                        </SelectTrigger>
                        <SelectContent>
                          {partnerClients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.last_name} {client.first_name} {client.middle_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cadastral_number">Кадастровый номер</Label>
                    <Input id="cadastral_number" name="cadastral_number" placeholder="50:23:0010101:1" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Адрес объекта *</Label>
                    <Input id="address" name="address" required placeholder="г. Орехово-Зуево, ул. Примерная, д. 1" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comments">Комментарии</Label>
                    <Textarea id="comments" name="comments" placeholder="Дополнительная информация..." rows={3} />
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Отправить на расчет
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {partnerOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Нет заказов</h3>
                  <p className="mt-2 text-gray-500">Создайте первую заявку на работу</p>
                </CardContent>
              </Card>
            ) : (
              partnerOrders.map((order) => {
                const status = getStatusBadge(order.status)
                const StatusIcon = status.icon
                return (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{order.address}</h4>
                            <Badge className={status.color}>
                              <StatusIcon className="mr-1 h-3 w-3" />
                              {status.label}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>Услуга: {order.services?.name || "Другое"}</p>
                            <p>
                              Контрагент: {order.partner_clients?.last_name} {order.partner_clients?.first_name}
                            </p>
                            {order.cadastral_number && <p>Кадастровый номер: {order.cadastral_number}</p>}
                            <p>Создано: {new Date(order.created_at).toLocaleDateString("ru-RU")}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {order.quoted_price && (
                            <p className="text-lg font-semibold">{order.quoted_price.toLocaleString()} ₽</p>
                          )}
                          {order.partner_commission && (
                            <p className="text-sm text-green-600">
                              Ваш доход: {order.partner_commission.toLocaleString()} ₽
                            </p>
                          )}
                          {order.status === "quoted" && (
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" onClick={() => handleAcceptOrder(order.id)}>
                                Принять
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleRejectOrder(order.id)}>
                                Отклонить
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Мои контрагенты</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить контрагента
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Добавить контрагента</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateClient} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Фамилия *</Label>
                      <Input id="last_name" name="last_name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Имя *</Label>
                      <Input id="first_name" name="first_name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="middle_name">Отчество</Label>
                      <Input id="middle_name" name="middle_name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="passport_series">Серия паспорта</Label>
                      <Input id="passport_series" name="passport_series" maxLength={4} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passport_number">Номер паспорта</Label>
                      <Input id="passport_number" name="passport_number" maxLength={6} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passport_issued_by">Кем выдан</Label>
                    <Input id="passport_issued_by" name="passport_issued_by" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="passport_issued_date">Дата выдачи</Label>
                      <Input id="passport_issued_date" name="passport_issued_date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="snils">СНИЛС</Label>
                      <Input id="snils" name="snils" placeholder="123-456-789 00" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passport_registration_address">Адрес регистрации</Label>
                    <Input id="passport_registration_address" name="passport_registration_address" />
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Добавить контрагента
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partnerClients.map((client) => (
              <Card key={client.id}>
                <CardContent className="p-4">
                  <h4 className="font-medium">
                    {client.last_name} {client.first_name} {client.middle_name}
                  </h4>
                  <div className="text-sm text-gray-600 mt-2 space-y-1">
                    {client.passport_series && client.passport_number && (
                      <p>
                        Паспорт: {client.passport_series} {client.passport_number}
                      </p>
                    )}
                    {client.snils && <p>СНИЛС: {client.snils}</p>}
                    <p>Добавлен: {new Date(client.created_at).toLocaleDateString("ru-RU")}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="program" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Реферальная ссылка
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input value={referralLink} readOnly className="font-mono text-sm" />
                  <Button onClick={copyReferralLink} size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Зарегистрировались по вашей ссылке: <strong>{referrals.length}</strong> человек
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Ваш баланс
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">{totalEarnings.toLocaleString()} ₽</div>
                <Button className="w-full">Запросить вывод средств</Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Привлеченные контрагенты</CardTitle>
            </CardHeader>
            <CardContent>
              {referrals.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Пока нет привлеченных контрагентов</p>
              ) : (
                <div className="space-y-3">
                  {referrals.map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {referral.profiles?.first_name} {referral.profiles?.last_name}
                        </p>
                        <p className="text-sm text-gray-600">{referral.profiles?.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{referral.commission_earned?.toLocaleString() || 0} ₽</p>
                        <p className="text-sm text-gray-500">
                          {new Date(referral.created_at).toLocaleDateString("ru-RU")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Часто задаваемые вопросы
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Как работает партнерская программа?</h4>
                <p className="text-sm text-gray-600">
                  Вы создаете заявки на работы для своих клиентов, мы рассчитываем стоимость, и после принятия заказа вы
                  получаете комиссию с каждой выполненной работы.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Какой размер комиссии?</h4>
                <p className="text-sm text-gray-600">
                  Размер комиссии зависит от типа услуги и объема работ. Обычно составляет от 5% до 15% от стоимости
                  заказа.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Как добавить контрагента?</h4>
                <p className="text-sm text-gray-600">
                  Перейдите в раздел "Мои контрагенты" и нажмите "Добавить контрагента". Заполните персональные данные
                  вашего клиента.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Когда выплачивается комиссия?</h4>
                <p className="text-sm text-gray-600">
                  Комиссия начисляется после завершения работ и может быть выведена по запросу. Минимальная сумма для
                  вывода - 1000 рублей.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Как отследить статус заказа?</h4>
                <p className="text-sm text-gray-600">
                  Все заказы отображаются в разделе "Заказы" с актуальным статусом. Вы получите уведомление при
                  изменении статуса.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
