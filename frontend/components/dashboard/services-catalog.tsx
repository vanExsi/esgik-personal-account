"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShoppingCart, FileText, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ServicesCatalogProps {
  services: any[]
  userId: string
}

export default function ServicesCatalog({ services, userId }: ServicesCatalogProps) {
  const router = useRouter()
  const [selectedService, setSelectedService] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleOrderService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const orderData = {
      user_id: userId,
      service_id: selectedService.id,
      address: formData.get("address") as string,
      cadastral_number: formData.get("cadastral_number") as string,
      status: "new",
      total_cost: selectedService.base_price,
    }

    try {
      const { error } = await supabase.from("objects").insert(orderData)

      if (error) {
        setError("Ошибка при создании заказа")
      } else {
        setSuccess("Заказ успешно создан! Перенаправляем в раздел объектов...")
        setTimeout(() => {
          router.push("/dashboard/objects")
        }, 2000)
      }
    } catch (err) {
      setError("Произошла ошибка")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Каталог услуг</h1>
        <p className="text-gray-600">Выберите необходимую геодезическую или кадастровую услугу</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {service.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">от {service.base_price?.toLocaleString()} ₽</span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => setSelectedService(service)}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Заказать
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Заказ услуги: {service.name}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleOrderService} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Адрес объекта *</Label>
                      <Input id="address" name="address" required placeholder="г. Орехово-Зуево, ул. Примерная, д. 1" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cadastral_number">Кадастровый номер</Label>
                      <Input id="cadastral_number" name="cadastral_number" placeholder="50:23:0010101:1" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comments">Комментарии</Label>
                      <Textarea
                        id="comments"
                        name="comments"
                        placeholder="Дополнительная информация об объекте..."
                        rows={3}
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Стоимость услуги</h4>
                      <div className="flex justify-between items-center">
                        <span>{service.name}</span>
                        <span className="font-bold">от {service.base_price?.toLocaleString()} ₽</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Точная стоимость будет рассчитана после осмотра объекта
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading} className="flex-1">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Оформить заказ
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Услуги временно недоступны</h3>
            <p className="mt-2 text-gray-500">Обратитесь к менеджеру для получения информации</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
