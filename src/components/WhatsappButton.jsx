'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { PhoneIcon as WhatsApp, X } from 'lucide-react'

export function WhatsAppButton() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end">
      {isExpanded && (
        <div className="flex flex-col items-end space-y-2 mb-2">
          <Button 
            variant="outline" 
            className="bg-green-500 hover:bg-green-600 text-white border-none shadow-lg"
            onClick={() => window.open('https://chat.whatsapp.com/CZw1CClidCVEFa2mpvMSyw', '_blank')}
          >
            WhatsApp Group
          </Button>
          <Button 
            variant="outline" 
            className="bg-green-500 hover:bg-green-600 text-white border-none shadow-lg"
            onClick={() => window.open('https://wa.me/237690377623', '_blank')}
          >
            Customer Service
          </Button>
        </div>
      )}
      <Button
        className="rounded-full w-12 h-12 bg-green-500 hover:bg-green-600 text-white shadow-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <X /> : <WhatsApp />}
      </Button>
    </div>
  )
}
