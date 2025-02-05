"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { icon: "home", label: "Panel", href: "/panel" },
  { icon: "payments", label: "Investir", href: "/panel/invest" },
  { icon: "share", label: "Equipe", href: "/panel/referral", badge: 2 },
  { icon: "receipt_long", label: "Historique", href: "/panel/history" },
  { icon: "person", label: "Profile", href: "/panel/profile" },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-xl shadow-lg">
      <nav className="flex items-center justify-around p-4 max-w-lg mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center group ${pathname === item.href ? "text-blue-600" : "text-gray-600"}`}
          >
            <div className="relative">
              <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              {item.badge && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-xs mt-1 group-hover:font-medium transition-all">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}