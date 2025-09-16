import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Easgik</h1>
          <p className="text-xl text-gray-600">Личный кабинет</p>
          <p className="text-gray-500">Единая служба геодезии и кадастра</p>
        </div>

        <div className="space-y-4">
          <Link href="/auth/login" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">Войти в кабинет</Button>
          </Link>

          <Link href="/auth/register" className="block">
            <Button
              variant="outline"
              className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 py-3 text-lg bg-transparent"
            >
              Регистрация
            </Button>
          </Link>
        </div>

        <div className="text-sm text-gray-500 space-y-2">
          <p>Телефон: 8 (495) 127 75-73</p>
          <p>г. Орехово-Зуево, ул. Бабушкина д.2а, 5 этаж, офис 10</p>
        </div>
      </div>
    </div>
  )
}
