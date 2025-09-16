"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Truck, Tag } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface ProfileFormProps {
  profile: any
  promocodes: any[]
}

export default function ProfileForm({ profile, promocodes }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<any>(null)
  const [totalAmount, setTotalAmount] = useState(15000) // Пример суммы заказа

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const updateData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      middle_name: formData.get("middle_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      payment_method: formData.get("payment_method") as string,
      delivery_method: formData.get("delivery_method") as string,
    }

    try {
      const { error } = await supabase.from("profiles").update(updateData).eq("id", profile.id)

      if (error) {
        setError("Ошибка обновления профиля")
      } else {
        setSuccess("Профиль успешно обновлен")
      }
    } catch (err) {
      setError("Произошла ошибка")
    } finally {
      setLoading(false)
    }
  }

  const applyPromoCode = () => {
    const promo = promocodes.find((p) => p.code === promoCode)
    if (promo) {
      setAppliedPromo(promo)
      setError("")
      setSuccess(`Промокод "${promo.code}" применен!`)
    } else {
      setError("Промокод не найден или недействителен")
      setAppliedPromo(null)
    }
  }

  const calculateDiscount = () => {
    if (!appliedPromo) return 0
    if (appliedPromo.discount_type === "percentage") {
      return (totalAmount * appliedPromo.discount_value) / 100
    }
    return appliedPromo.discount_value
  }

  const finalAmount = totalAmount - calculateDiscount()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Профиль</h1>
        <p className="text-gray-600">Управляйте своей личной информацией и настройками</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Личная информация */}
        <Card>
          <CardHeader>
            <CardTitle>Личная информация</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="last_name">Фамилия</Label>
                  <Input id="last_name" name="last_name" defaultValue={profile?.last_name || ""} placeholder="Иванов" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="first_name">Имя</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    defaultValue={profile?.first_name || ""}
                    placeholder="Иван"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="middle_name">Отчество</Label>
                <Input
                  id="middle_name"
                  name="middle_name"
                  defaultValue={profile?.middle_name || ""}
                  placeholder="Иванович"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Электронная почта</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={profile?.email || ""}
                  placeholder="ivan@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Контактный телефон</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={profile?.phone || ""}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Сохранить изменения
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Настройки оплаты и доставки */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Способ оплаты
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select name="payment_method" defaultValue={profile?.payment_method || "cash"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Наличные</SelectItem>
                  <SelectItem value="bank_transfer">Банковский перевод</SelectItem>
                  <SelectItem value="qr_code">QR-код</SelectItem>
                  <SelectItem value="requisites">Оплата по реквизитам</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Способ получения документов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select name="delivery_method" defaultValue={profile?.delivery_method || "office"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">В офисе</SelectItem>
                  <SelectItem value="courier">Наш сотрудник привезет на объект</SelectItem>
                  <SelectItem value="yandex">Яндекс доставка</SelectItem>
                  <SelectItem value="cdek">CDEK</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Промокоды и стоимость */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Промокоды и стоимость
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="promo_code">Промокод</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="promo_code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Введите промокод"
                  />
                  <Button type="button" onClick={applyPromoCode} variant="outline">
                    Применить
                  </Button>
                </div>
              </div>

              {promocodes.length > 0 && (
                <div>
                  <Label>Доступные промокоды:</Label>
                  <div className="mt-2 space-y-1">
                    {promocodes.slice(0, 3).map((promo) => (
                      <div key={promo.id} className="text-sm text-gray-600">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">{promo.code}</span> -{" "}
                        {promo.discount_type === "percentage"
                          ? `${promo.discount_value}%`
                          : `${promo.discount_value} ₽`}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Расчет стоимости</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Услуга:</span>
                    <span>Межевой план</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Стоимость:</span>
                    <span>{totalAmount.toLocaleString()} ₽</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Скидка ({appliedPromo.code}):</span>
                      <span>-{calculateDiscount().toLocaleString()} ₽</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>К оплате:</span>
                    <span>{finalAmount.toLocaleString()} ₽</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
