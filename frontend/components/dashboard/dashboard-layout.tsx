"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Bell, HelpCircle, Menu, User, FileText, Building, ShoppingCart, FolderOpen, Users, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import NotificationPanel from "./notification-panel"
import HelpPanel from "./help-panel"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: any
  profile: any
  notifications: any[]
}

const menuItems = [
  { href: "/dashboard", label: "Главная", icon: Building },
  { href: "/dashboard/profile", label: "Профиль", icon: User },
  { href: "/dashboard/personal-data", label: "Персональные данные", icon: FileText },
  { href: "/dashboard/objects", label: "Объекты", icon: Building },
  { href: "/dashboard/services", label: "Услуги", icon: ShoppingCart },
  { href: "/dashboard/documents", label: "Документы", icon: FolderOpen },
  { href: "/dashboard/partnership", label: "Сервис партнерств", icon: Users },
]

export default function DashboardLayout({ children, user, profile, notifications }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const unreadCount = notifications.length

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`${mobile ? "w-full" : "w-64"} bg-white border-r border-gray-200 flex flex-col`}>
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">Easgik</h1>
        <p className="text-sm text-gray-600">Личный кабинет</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start text-red-600 hover:bg-red-50"
          onClick={() => {
            localStorage.removeItem("currentUser")
            window.location.href = "/auth/login"
          }}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Выйти
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar mobile />
              </SheetContent>
            </Sheet>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Добро пожаловать, {profile?.first_name || "Пользователь"}!
              </h2>
              <p className="text-sm text-gray-600">{profile?.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            {/* Help */}
            <Button variant="ghost" size="icon" onClick={() => setShowHelp(!showHelp)}>
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 relative">
          {children}

          {/* Notification Panel */}
          {showNotifications && (
            <NotificationPanel
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
              userId={user.id}
            />
          )}

          {/* Help Panel */}
          {showHelp && <HelpPanel onClose={() => setShowHelp(false)} currentPage={pathname} />}
        </main>
      </div>
    </div>
  )
}
