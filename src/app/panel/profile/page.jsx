"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, LogOut, Info } from 'lucide-react'
import { DepositWithdrawButtons } from "@/components/DepositWithdrawal"
import { useAuth } from "@/components/context/auth-context"
import { auth } from "@/functions/firebase";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation"
import { useToast } from '@/hooks/use-toast'
import Link from "next/link"


export default function Profile() {
  const {userInfo} = useAuth()
  const router = useRouter()
  const {toast} = useToast()

  const handleLogout = async () => {
    console.log("User logged out");
    await signOut(auth)
    router.push('/login')
    // Add your logout logic here (e.g., Firebase logout, redirect, etc.)
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, userInfo.email);
      toast({ variant: "success", title: "Email envoyé", description: "Vérifiez votre boîte mail pour réinitialiser le mot de passe." });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast({ variant: "destructive", title: "Erreur", description: "Impossible d'envoyer l'email de réinitialisation." });
    }
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto bg-gray-50 p-4 md:p-6 rounded-xl shadow-lg">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mb-8">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative">
            <img
              src="https://placehold.co/100x100"
              alt="Profile"
              className="w-20 h-20 md:w-[120px] md:h-[120px] rounded-full ring-4 ring-blue-500/20 transition-all hover:ring-blue-500/40"
            />
            <span className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{userInfo?.name}</h1>
            <p className="text-gray-600 text-sm md:text-base">{userInfo?.email}</p>
            <p className="text-gray-500 text-xs md:text-sm">Membre depuis: Fev 2025</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none">
            <span className="material-symbols-outlined mr-2">edit</span>
            Modifier
          </Button>
          <Button variant="outline" className="flex-1 md:flex-none">
            <span className="material-symbols-outlined mr-2">security</span>
            A propos
          </Button>
          <Button variant="destructive" className="flex-1 md:flex-none">
            <span className="material-symbols-outlined mr-2">logout</span>
            Déconnexion
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <span className="material-symbols-outlined text-4xl md:text-5xl text-blue-500 mb-4">account_balance</span>
          <h2 className="text-lg md:text-xl font-semibold mb-2">Solde Actuelle</h2>
          <p className="text-2xl md:text-3xl font-bold">XAF{userInfo?.balance ?? 0}</p>
        </Card>

      <DepositWithdrawButtons />


        <Card className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <span className="material-symbols-outlined text-4xl md:text-5xl text-green-500 mb-4">arrow_downward</span>
          <h2 className="text-lg md:text-xl font-semibold mb-2">Totale Déposé</h2>
          <p className="text-2xl md:text-3xl font-bold">XAF{userInfo?.deposits ?? 0}</p>
        </Card>

        <Card className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <span className="material-symbols-outlined text-4xl md:text-5xl text-red-500 mb-4">arrow_upward</span>
          <h2 className="text-lg md:text-xl font-semibold mb-2">Totale Retiré</h2>
          <p className="text-2xl md:text-3xl font-bold">XAF{userInfo?.withdrawals ?? 0}</p>
        </Card>

        <Card className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <span className="material-symbols-outlined text-4xl md:text-5xl text-purple-500 mb-4">group</span>
          <h2 className="text-lg md:text-xl font-semibold mb-2">Nombre de Filleul</h2>
          <p className="text-2xl md:text-3xl font-bold">24</p>
          <p className="text-sm text-gray-500 mt-2">Gagné: XAF{userInfo?.referralEarnings ?? 0}</p>
        </Card>

        <Card className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <span className="material-symbols-outlined text-4xl md:text-5xl text-amber-500 mb-4">Pannel</span>
          <h2 className="text-lg md:text-xl font-semibold mb-2">Plans Active</h2>
          <p className="text-2xl md:text-3xl font-bold">{userInfo?.plans?.length ?? 0}</p>
          {/* <p className="text-sm text-gray-500 mt-2">Total invested: $5,000.00</p> */}
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-white">
          <span className="material-symbols-outlined text-4xl md:text-5xl mb-4">trending_up</span>
          <h2 className="text-lg md:text-xl font-semibold mb-2">Performance</h2>
          <p className="text-2xl md:text-3xl font-bold">XAF{userInfo?.earnings ?? 0} gagnés</p>
          {/* <p className="text-sm mt-2">Last 30 days</p> */}
        </Card>
      </div>
    </div>
  )
}