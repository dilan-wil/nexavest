"use client"
import { Inter } from 'next/font/google'
import BottomNav from '@/components/BottomNav'
import ProtectedRoute from '@/components/context/protected-route'
import { useAuth } from '@/components/context/auth-context'
const inter = Inter({ subsets: ['latin'] })
import React from 'react'
import { getADocument } from '@/functions/get-a-document'
import { listenToSubCollection } from '@/functions/get-a-sub-collection'
import { WhatsAppButton } from '../../components/WhatsappButton'

export default function DashboardLayout({ children }) {
  const { user, referrals, setUserInfo, setTransactions, setReferrals } = useAuth()

  React.useEffect(() => {
    if (!user) {
      console.error("User is not authenticated")
      return
    }

    const unsubscribe = getADocument(user.uid, "users", setUserInfo);

    // Cleanup listener on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };

  }, [user, setUserInfo])

  React.useEffect(() => {
    if (!user) {
      console.error("User is not authenticated")
      return
    }

    const unsubscribe = listenToSubCollection("users", user.uid, "transactions", setTransactions);

    // Cleanup listener on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };

  }, [user, setTransactions])

  React.useEffect(() => {
    if (!user) {
      console.error("User is not authenticated")
      return
    }

    const unsubscribe = listenToSubCollection("users", user.uid, "referrals", setReferrals);

    // Cleanup listener on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };

  }, [user, setReferrals])

  return (
    <ProtectedRoute>
      <div className={`${inter.className} pb-30 flex flex-col min-h-screen`}>
        {children}
        <WhatsAppButton />
        <BottomNav number={referrals?.length ?? 0}/>
      </div>
    </ProtectedRoute>
    // <html lang="en">
    //   <body className={`${inter.className} flex flex-col min-h-screen bg-blue-50`}>
    //     <main className="flex-grow overflow-auto pb-16">
    //       {children}
    //     </main>
    //     <BottomNav />
    //   </body>
    // </html>
  )
}

