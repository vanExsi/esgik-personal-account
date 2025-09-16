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

export default function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [smsMethod, setSmsMethod] = useState("phone")
  const [showSmsInput, setShowSmsInput] = useState(false)
  const [smsCode, setSmsCode] = useState("")
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const phone = (form.get("phone") as string) || ""
    const password = (form.get("password") as string) || ""
    const confirmPassword = (form.get("confirmPassword") as string) || ""

    // Валидация
    if (password !== confirmPassword) {
      setError("Пароли не совпадают")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов")
      setLoading(false)
      return
    }

    if (!phone || phone.length < 10) {
      setError("Введите корректный номер телефона")
      setLoading(false)
      return
    }

    try {
      const users = JSON.parse(localStorage.getItem("easgik_users") || "[]")
      const cleanPhone = phone.replace(/\D/g, "")
      const existingUser = users.find((u: any) => u.phone === cleanPhone)

      if (existingUser) {
        setError("Пользователь с таким номером телефона уже существует")
        setLoading(false)
        return
      }

      // Сохраняем данные формы
      setFormData({ phone, password, confirmPassword })

      // Отправляем SMS код (в демо показываем тестовый)
      setShowSmsInput(true)
      setSuccess(`Тестовый код отправлен ${smsMethod === "phone" ? "по SMS" : "в Telegram"}: 1234`)
    } catch (err) {
      setError("Ошибка отправки кода")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Проверяем тестовый код
      if (smsCode === "1234") {
        const cleanPhone = formData.phone.replace(/\D/g, "")

        const users = JSON.parse(localStorage.getItem("easgik_users") || "[]")
        const newUser = {
          id: Date.now().toString(),
          phone: cleanPhone,
          fullPhone: formData.phone,
          password: formData.password,
          sms_method: smsMethod,
          created_at: new Date().toISOString(),
        }

        users.push(newUser)
        localStorage.setItem("easgik_users", JSON.stringify(users))
        localStorage.setItem("easgik_current_user", JSON.stringify(newUser))

        setSuccess("Регистрация успешна! Перенаправляем в личный кабинет...")
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setError("Неверный код")
      }
    } catch (err) {
      setError("Ошибка подтверждения регистрации")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Регистрация</CardTitle>
        <CardDescription>Создайте аккаунт для доступа к личному кабинету</CardDescription>
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

        {!showSmsInput ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Номер телефона</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Минимум 6 символов"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Повторите пароль"
                value={formData.confirmPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smsMethod">Способ получения кода</Label>
              <Select value={smsMethod} onValueChange={setSmsMethod}>
                <SelectTrigger>
                  <SelectValue />
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
          <form onSubmit={handleConfirmRegistration} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sms-code">Код подтверждения</Label>
              <Input
                id="sms-code"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                placeholder="1234"
                maxLength={4}
                required
              />
              <p className="text-sm text-gray-600">
                Код отправлен {smsMethod === "phone" ? "по SMS" : "в Telegram"} на {formData.phone}
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Завершить регистрацию
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => {
                setShowSmsInput(false)
                setSmsCode("")
                setSuccess("")
              }}
            >
              Изменить данные
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Уже есть аккаунт?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
