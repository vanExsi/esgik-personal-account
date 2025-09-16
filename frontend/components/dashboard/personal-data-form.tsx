"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, FileText, Camera } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface PersonalDataFormProps {
  personalData: any
  userId: string
}

export default function PersonalDataForm({ personalData, userId }: PersonalDataFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const updateData = {
      user_id: userId,
      passport_series: formData.get("passport_series") as string,
      passport_number: formData.get("passport_number") as string,
      passport_issued_by: formData.get("passport_issued_by") as string,
      passport_issued_date: formData.get("passport_issued_date") as string,
      passport_registration_address: formData.get("passport_registration_address") as string,
      snils: formData.get("snils") as string,
      document_photos: uploadedFiles,
    }

    try {
      let error
      if (personalData) {
        // Обновляем существующие данные
        const result = await supabase.from("personal_data").update(updateData).eq("user_id", userId)
        error = result.error
      } else {
        // Создаем новые данные
        const result = await supabase.from("personal_data").insert(updateData)
        error = result.error
      }

      if (error) {
        setError("Ошибка сохранения данных")
      } else {
        setSuccess("Персональные данные успешно сохранены")
      }
    } catch (err) {
      setError("Произошла ошибка")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setLoading(true)
    const uploadedUrls: string[] = []

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${userId}/${Date.now()}.${fileExt}`

        const { data, error } = await supabase.storage.from("documents").upload(fileName, file)

        if (error) {
          console.error("Ошибка загрузки файла:", error)
        } else {
          const { data: urlData } = supabase.storage.from("documents").getPublicUrl(data.path)
          uploadedUrls.push(urlData.publicUrl)
        }
      }

      setUploadedFiles((prev) => [...prev, ...uploadedUrls])
      setSuccess(`Загружено ${uploadedUrls.length} файлов`)
    } catch (err) {
      setError("Ошибка загрузки файлов")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Персональные данные</h1>
        <p className="text-gray-600">Заполните паспортные данные для оформления документов</p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Паспортные данные */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Паспортные данные
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passport_series">Серия паспорта</Label>
                  <Input
                    id="passport_series"
                    name="passport_series"
                    defaultValue={personalData?.passport_series || ""}
                    placeholder="1234"
                    maxLength={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passport_number">Номер паспорта</Label>
                  <Input
                    id="passport_number"
                    name="passport_number"
                    defaultValue={personalData?.passport_number || ""}
                    placeholder="567890"
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passport_issued_by">Кем выдан</Label>
                <Input
                  id="passport_issued_by"
                  name="passport_issued_by"
                  defaultValue={personalData?.passport_issued_by || ""}
                  placeholder="ОУФМС России по г. Орехово-Зуево"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passport_issued_date">Дата выдачи</Label>
                <Input
                  id="passport_issued_date"
                  name="passport_issued_date"
                  type="date"
                  defaultValue={personalData?.passport_issued_date || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passport_registration_address">Адрес регистрации</Label>
                <Input
                  id="passport_registration_address"
                  name="passport_registration_address"
                  defaultValue={personalData?.passport_registration_address || ""}
                  placeholder="г. Орехово-Зуево, ул. Примерная, д. 1, кв. 1"
                />
              </div>
            </CardContent>
          </Card>

          {/* СНИЛС и документы */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>СНИЛС</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="snils">Номер СНИЛС</Label>
                  <Input
                    id="snils"
                    name="snils"
                    defaultValue={personalData?.snils || ""}
                    placeholder="123-456-789 00"
                    maxLength={14}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Фотографии документов
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="document_photos">Загрузите фото паспорта и СНИЛС</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      id="document_photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="document_photos" className="cursor-pointer">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Нажмите для выбора файлов или перетащите их сюда</p>
                      <p className="text-xs text-gray-500">PNG, JPG до 10MB</p>
                    </label>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Загруженные файлы:</Label>
                    <div className="space-y-1">
                      {uploadedFiles.map((url, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4" />
                          <span>Документ {index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Совет:</strong> Загрузите четкие фотографии документов, и наши сотрудники автоматически
                    заполнят все поля, сэкономив ваше время.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Сохранить данные
          </Button>
        </div>
      </form>
    </div>
  )
}
