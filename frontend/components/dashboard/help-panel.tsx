"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, HelpCircle, Phone, MapPin, Clock } from "lucide-react"

interface HelpPanelProps {
  onClose: () => void
  currentPage: string
}

export default function HelpPanel({ onClose, currentPage }: HelpPanelProps) {
  const getPageHelp = (page: string) => {
    const helpContent = {
      "/dashboard": {
        title: "Главная страница личного кабинета",
        content: [
          "📊 Отслеживайте статистику ваших объектов: активные, завершенные и общее количество",
          "🔔 Следите за уведомлениями в правом верхнем углу - там появляются важные сообщения",
          "⚡ Используйте быстрые действия для заказа услуг, просмотра документов или редактирования профиля",
          "📋 В разделе 'Последние объекты' видны ваши недавние заказы с актуальными статусами",
          "💬 Данные автоматически синхронизируются с нашей CRM-системой",
        ],
      },
      "/dashboard/profile": {
        title: "Настройка профиля",
        content: [
          "👤 Заполните ФИО и контактные данные для корректного оформления документов",
          "💳 Выберите удобный способ оплаты: наличные, банковский перевод, QR-код или по реквизитам",
          "📦 Настройте способ получения документов: в офисе, доставка на объект, Яндекс.Доставка или CDEK",
          "🎫 Используйте промокоды для получения скидок - вводите код в специальном поле",
          "💰 Сумма к оплате автоматически пересчитывается при применении промокода",
        ],
      },
      "/dashboard/objects": {
        title: "Управление объектами",
        content: [
          "🏠 Здесь отображаются все ваши заказанные объекты с подробной информацией",
          "📍 Для каждого объекта указан адрес, кадастровый номер и статус выполнения работ",
          "👨‍💼 Видите персонального менеджера, кадастрового инженера и геодезиста по каждому объекту",
          "📅 Отслеживайте дату и время выезда специалистов на объект",
          "💬 Общайтесь с персональным менеджером через встроенный чат для решения вопросов",
          "💵 Контролируйте стоимость работ по каждому объекту",
        ],
      },
      "/dashboard/services": {
        title: "Каталог услуг",
        content: [
          "📋 Выберите необходимую геодезическую или кадастровую услугу из каталога",
          "💰 Ознакомьтесь с описанием услуги и стоимостью 'от' указанной суммы",
          "🛒 После заказа услуга автоматически появится в разделе 'Объекты'",
          "📞 Для точного расчета стоимости свяжитесь с нами по телефону 8 (495) 127 75-73",
          "⚡ Доступные услуги: межевание, технический план, акт обследования, схема ЗУ, топосъемка, вынос границ",
        ],
      },
      "/dashboard/documents": {
        title: "Работа с документами",
        content: [
          "📄 Раздел 'Для подписи' - документы, которые мы загрузили для вашего ознакомления и подписи",
          "✅ Раздел 'Подписанные' - место для загрузки ваших подписанных документов",
          "👁️ Используйте предварительный просмотр для ознакомления с документами перед скачиванием",
          "📤 Загружайте подписанные документы через кнопку 'Загрузить файл'",
          "🔔 Получайте уведомления о поступлении новых документов для подписи",
        ],
      },
      "/dashboard/personal-data": {
        title: "Персональные данные",
        content: [
          "🆔 Заполните паспортные данные: серия, номер, кем и когда выдан, адрес прописки",
          "📋 Укажите номер СНИЛС для корректного оформления официальных документов",
          "📸 Загрузите фотографии документов - наши сотрудники сами заполнят все поля",
          "🔄 Данные автоматически синхронизируются с нашей CRM-системой",
          "🔒 Все персональные данные надежно защищены и используются только для оформления документов",
        ],
      },
      "/dashboard/partnership": {
        title: "Партнерская программа",
        content: [
          "📝 Создавайте заявки на работы для своих клиентов, выбирая услугу и указывая детали объекта",
          "👥 Управляйте контрагентами - добавляйте данные ваших физических заказчиков",
          "💰 Отслеживайте заработок по реферальной программе и текущий баланс",
          "🔗 Используйте уникальную реферальную ссылку для привлечения новых клиентов",
          "📊 Следите за статусом заявок: расчет стоимости, принятие/отклонение предложений",
          "💳 Запрашивайте вывод заработанных средств через кнопку в разделе баланса",
        ],
      },
    }

    return helpContent[page as keyof typeof helpContent] || helpContent["/dashboard"]
  }

  const pageHelp = getPageHelp(currentPage)

  return (
    <div className="absolute top-0 right-0 z-50 w-96 max-w-full">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Помощь по работе с системой
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-3">{pageHelp.title}</h3>
            <div className="space-y-3 text-sm text-gray-600 max-h-64 overflow-y-auto">
              {pageHelp.content.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Контактная информация ЕСГИК</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-600" />
                <span className="font-medium">8 (495) 127 75-73</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                <span>г. Орехово-Зуево, ул. Бабушкина д.2а, 5 этаж, офис 10</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
                <span>
                  Обслуживаемые города: Орехово-Зуево, Павловский Посад, Воскресенск, Шатура, Электрогорск,
                  Ликино-Дулёво
                </span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Нужна консультация?</h4>
            <p className="text-sm text-gray-600 mb-3">
              Свяжитесь с нами для получения бесплатной консультации и точного расчета стоимости услуг
            </p>
            <Button className="w-full" size="sm">
              <Phone className="mr-2 h-4 w-4" />
              Позвонить 8 (495) 127 75-73
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
