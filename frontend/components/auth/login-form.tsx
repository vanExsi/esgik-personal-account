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
    setSuccess("")

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone, password: formData.password })
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || "Ошибка при входе")
      } else {
        setShowCodeInput(true)
        setSuccess(data.message)
      }
    } catch {
      setError("Ошибка подключения к серверу")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch("http://localhost:8000/auth/login-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
          code: smsCode
        })
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || "Неверный код")
      } else {
        localStorage.setItem("access_token", data.access_token)
        localStorage.setItem("currentUser", JSON.stringify({ id: data.user_id, phone: formData.phone }))
        router.push("/dashboard")
      }
    } catch {
      setError("Ошибка подключения к серверу")
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
