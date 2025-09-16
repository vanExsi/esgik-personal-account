"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Download, Upload, Eye, Loader2, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface DocumentsManagerProps {
  documents: any[]
  userId: string
}

export default function DocumentsManager({ documents, userId }: DocumentsManagerProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")

  const forSignatureDocuments = documents.filter((doc) => doc.document_type === "for_signature" && !doc.is_signed)
  const signedDocuments = documents.filter((doc) => doc.document_type === "signed" || doc.is_signed)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, objectId?: string) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setLoading(true)
    setError("")

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${userId}/${Date.now()}_${file.name}`

        const { data, error } = await supabase.storage.from("documents").upload(fileName, file)

        if (error) {
          setError("Ошибка загрузки файла")
          continue
        }

        const { data: urlData } = supabase.storage.from("documents").getPublicUrl(data.path)

        // Сохраняем информацию о документе в базе
        const { error: dbError } = await supabase.from("documents").insert({
          user_id: userId,
          object_id: objectId,
          name: file.name,
          file_url: urlData.publicUrl,
          document_type: "signed",
          is_signed: true,
        })

        if (dbError) {
          setError("Ошибка сохранения информации о документе")
        }
      }

      setSuccess("Документы успешно загружены")
      // Обновляем страницу для отображения новых документов
      window.location.reload()
    } catch (err) {
      setError("Произошла ошибка при загрузке")
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = (url: string) => {
    setPreviewUrl(url)
  }

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
  }

  const markAsSigned = async (documentId: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.from("documents").update({ is_signed: true }).eq("id", documentId)

      if (error) {
        setError("Ошибка при отметке документа как подписанного")
      } else {
        setSuccess("Документ отмечен как подписанный")
        window.location.reload()
      }
    } catch (err) {
      setError("Произошла ошибка")
    } finally {
      setLoading(false)
    }
  }

  const DocumentCard = ({ document, showSignButton = false }: { document: any; showSignButton?: boolean }) => (
    <Card key={document.id}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4" />
              <h4 className="font-medium">{document.name}</h4>
              <Badge variant={document.is_signed ? "secondary" : "default"}>
                {document.is_signed ? "Подписан" : "Требует подписи"}
              </Badge>
            </div>
            {document.objects && (
              <p className="text-sm text-gray-600 mb-1">
                Объект: {document.objects.address}
                {document.objects.cadastral_number && ` (${document.objects.cadastral_number})`}
              </p>
            )}
            <p className="text-xs text-gray-500">{new Date(document.uploaded_at).toLocaleString("ru-RU")}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePreview(document.file_url)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDownload(document.file_url, document.name)}>
              <Download className="h-4 w-4" />
            </Button>
            {showSignButton && !document.is_signed && (
              <Button size="sm" onClick={() => markAsSigned(document.id)}>
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Документы</h1>
        <p className="text-gray-600">Управляйте документами для подписи и загружайте подписанные</p>
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

      <Tabs defaultValue="for-signature" className="space-y-4">
        <TabsList>
          <TabsTrigger value="for-signature" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Для подписи ({forSignatureDocuments.length})
          </TabsTrigger>
          <TabsTrigger value="signed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Подписанные ({signedDocuments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="for-signature" className="space-y-4">
          {forSignatureDocuments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Нет документов для подписи</h3>
                <p className="mt-2 text-gray-500">Документы появятся здесь, когда будут готовы для подписи</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {forSignatureDocuments.map((document) => (
                <DocumentCard key={document.id} document={document} showSignButton />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="signed" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Подписанные документы</h3>
            <div>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(e)}
                className="hidden"
                id="upload-signed"
              />
              <label htmlFor="upload-signed">
                <Button asChild disabled={loading}>
                  <span>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    Загрузить документы
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {signedDocuments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Нет подписанных документов</h3>
                <p className="mt-2 text-gray-500">Загрузите подписанные документы с помощью кнопки выше</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {signedDocuments.map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl("")}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Предварительный просмотр документа</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {previewUrl && (
              <iframe src={previewUrl} className="w-full h-96 border rounded" title="Предварительный просмотр" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
