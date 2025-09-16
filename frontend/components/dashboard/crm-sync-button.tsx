"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, RefreshCw } from "lucide-react"
import { syncUserWithCRM, checkAndNotifyIncompleteProfile } from "@/lib/crm-integration"

interface CRMSyncButtonProps {
  userId: string
  phone: string
}

export default function CRMSyncButton({ userId, phone }: CRMSyncButtonProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSync = async () => {
    setLoading(true)
    setResult(null)

    try {
      // Синхронизируем с CRM
      const syncResult = await syncUserWithCRM(phone, userId)
      setResult(syncResult)

      // Проверяем заполненность профиля и создаем уведомления
      if (syncResult.success) {
        await checkAndNotifyIncompleteProfile(userId)
      }

      // Перезагружаем страницу для отображения обновленных данных
      if (syncResult.success) {
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Ошибка синхронизации",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleSync} disabled={loading} variant="outline">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
        Синхронизировать с CRM
      </Button>

      {result && (
        <Alert variant={result.success ? "default" : "destructive"}>
          <AlertDescription className={result.success ? "text-green-600" : ""}>{result.message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
