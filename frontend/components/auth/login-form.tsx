"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [smsCode, setSmsCode] = useState("")

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    smsMethod: "phone", // phone или telegram
  })

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const cleanPhone = formData.phone.replace(/\D/g, "")

      if (!formData.phone || !formData.password || !formData.smsMethod) {
        setError("Все поля обязательны для заполнения")
        setLoading(false)
        return
      }

      // Проверяем пользователя в localStorage
      const users = JSON.parse(localStorage.getItem("easgik_users") || "[]")
      const user = users.find((u: any) => u.phone === cleanPhone)

      if (user && user.password === formData.password) {
        // Отправляем код подтверждения
        setShowCodeInput(true)
        const testCode = formData.smsMethod === "phone" ? "1234" : "5678"
        setSuccess(`Тестовый код отправлен ${formData.smsMethod === "phone" ? "по SMS" : "в Telegram"}: ${testCode}`)
      } else {
        setError("Неверный номер телефона или пароль")
      }
    } catch (err) {
      setError("Произошла ошибка при входе")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const expectedCode = formData.smsMethod === "phone" ? "1234" : "5678"

      if (smsCode === expectedCode) {
        const cleanPhone = formData.phone.replace(/\D/g, "")
        const users = JSON.parse(localStorage.getItem("easgik_users") || "[]")
        const user = users.find((u: any) => u.phone === cleanPhone)

        localStorage.setItem("currentUser", JSON.stringify(user))
        router.push("/dashboard")
      } else {
        setError("Неверный код подтверждения")
      }
    } catch (err) {
      setError("Ошибка подтверждения кода")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Вход в кабинет</CardTitle>
        <CardDescription>Заполните все поля для входа</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4">
            <AlertDescription className="text-green-600">{success}</AlertDescription>
          </Alert>
        )}

        {!showCodeInput ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Номер телефона *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                type="tel"
                placeholder="+7 (999) 123-45-67"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль *</Label>
              <Input
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                type="password"
                placeholder="Минимум 6 символов"
                required
              />
              <p className="text-xs text-gray-500">Минимум 6 символов</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smsMethod">Способ получения кода *</Label>
              <Select
                value={formData.smsMethod}
                onValueChange={(value) => setFormData({ ...formData, smsMethod: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите способ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">SMS на телефон</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Отправить код подтверждения
            </Button>
          </form>
        ) : (
          <form onSubmit={handleConfirmCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smsCode">Введите код подтверждения</Label>
              <Input
                id="smsCode"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                placeholder="Введите код"
                maxLength={4}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Подтвердить код
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => {
                setShowCodeInput(false)
                setSmsCode("")
                setSuccess("")
              }}
            >
              Назад к форме входа
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Нет аккаунта?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
