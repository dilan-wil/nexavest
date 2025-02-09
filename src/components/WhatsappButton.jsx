'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { PhoneIcon as WhatsApp, X } from 'lucide-react'

export function WhatsAppButton() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-20 right-6 flex flex-col gap-2">
    <details className="group">
        <summary className="w-12 h-12 rounded-full bg-green-500 shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transition-all duration-300 outline-none hover:scale-105">
            <span className="material-symbols-outlined text-white transform group-open:rotate-180 transition-transform">
                add
            </span>
        </summary>
        <div className="absolute bottom-14 right-0 flex flex-col gap-2">
            <a
                href="https://chat.whatsapp.com/Hpdjxemh3JW2y4hDYggMTd"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-green-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 hover:bg-green-50"
            >
                <span className="material-symbols-outlined text-white">groups</span>
            </a>
            <a
                href="https://wa.me/237688083496"
                className="w-12 h-12 bg-green-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 hover:bg-blue-50"
            >
                <span className="material-symbols-outlined text-white">support_agent</span>
            </a>
        </div>
    </details>
</div>
  )
}
