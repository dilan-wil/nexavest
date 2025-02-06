'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpFromLine, ChevronLeftCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/context/auth-context'
import { useToast } from '@/hooks/use-toast'
import { askWithdrawal } from '@/functions/ask-withdrawals'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function Withdrawal() {
  const { user, userInfo, setUserInfo, setTransactions } = useAuth()
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const {toast} = useToast()
  const [withdrawalMethod, setWithdrawalMethod] = useState("")
  const [cryptoCurrency, setCryptoCurrency] = useState("")

  const handleWithdrawal = async (e) => {
    e.preventDefault()
    if (!user) {
      return false
    }
    const now = new Date();
    const currentHour = now.getUTCHours() + 1; // Adjust to GMT+1
    const currentMinutes = now.getUTCMinutes();
    console.log({amount, paymentMethod, number, name})

    if (!amount || !paymentMethod || !number || !name) {
      toast({
        variant: "destructive",
        title: "Formulaire imcomplet",
        description: "Veuillez remplir tout les champs.",
      })
      return;
    }

    // Check if the time is outside 9 AM to 7 PM
    if (currentHour < 9 || (currentHour === 20 && currentMinutes > 0) || currentHour > 20) {
      toast({
        variant: "destructive",
        title: "Heure de Retrait.",
        description: "Les demandes de dépot se font exclusvivement entre 9h et 20h.",
      })
      return false;
    }

    try {
      setLoading(true);
      const asked = await askWithdrawal(user.uid, paymentMethod, amount, number, name, userInfo, setUserInfo, setTransactions);
      console.log(asked);
      toast({
        variant: "success",
        title: "Demande de retrait réussi.",
        description: "Votre requete a été envoyée. Vous recevrez vos fonds dans un délai de 24h.",
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Amount must be greater than 1000.") {
        toast({
          variant: "destructive",
          title: "Erreur de retrait.",
          description: "Le montant minimum de retrait est de 1000.",
        });
      } else if (error instanceof Error && error.message === "You need a plan") {
        toast({
          variant: "destructive",
          title: "Aucun plan détecté.",
          description: "Vous devez acheter un plan pour pouvoir faire un retrait.",
        });
      }
      else {
        toast({
          variant: "destructive",
          title: "Erreur de retrait.",
          description: "Rassurez-vous d'avoir les fonds nécessaires et d'entrer les bonnes informations.",
        });
      }
    } finally {
      setLoading(false);
      setAmount("");
      setPaymentMethod("");
      setNumber("");
      setName("")
    }
  }

  return (
    <div className="w-full pb-24 max-w-[1200px] p-4 md:p-6 rounded-xl mx-auto">
      <Card className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold">Retrait</h1>
          <div className="relative">
            <details className="group">
              <summary className="flex items-center gap-2 cursor-pointer list-none px-4 py-2 rounded-lg hover:bg-gray-50">
                <span className="material-symbols-outlined">help</span>
                Information
              </summary>
              <div className="absolute right-0 mt-2 w-64 p-4 bg-white rounded-xl shadow-lg border border-gray-100 z-10">
                <p className="text-sm">Choisissez votre mode de retrait et entrez vos informations.</p>
              </div>
            </details>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 p-6 rounded-xl border border-orange-100 mb-6 transform hover:scale-102 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Solde disponible</h3>
              <p className="text-3xl font-bold mb-2">XAF1,234.56</p>
            </div>
          </div>
        </div>

        <Card className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-6">Mode de Retrait</h2>

          <RadioGroup onValueChange={setWithdrawalMethod} className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all">
              <RadioGroupItem value="orange" id="orange" className="w-4 h-4 accent-orange-500" />
              <Label htmlFor="orange" className="flex items-center gap-3 cursor-pointer">
                <span className="material-symbols-outlined text-orange-500">smartphone</span>
                Orange Money
              </Label>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 cursor-pointer transition-all">
              <RadioGroupItem value="mtn" id="mtn" className="w-4 h-4 accent-yellow-500" />
              <Label htmlFor="mtn" className="flex items-center gap-3 cursor-pointer">
                <span className="material-symbols-outlined text-yellow-500">smartphone</span>
                MTN Money
              </Label>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all">
              <RadioGroupItem value="crypto" id="crypto" className="w-4 h-4 accent-blue-500" />
              <Label htmlFor="crypto" className="flex items-center gap-3 cursor-pointer">
                <span className="material-symbols-outlined text-blue-500">currency_bitcoin</span>
                Cryptocurrency
              </Label>
            </div>
          </RadioGroup>

          {withdrawalMethod === "crypto" && (
            <div className="mt-6">
              <Select onValueChange={setCryptoCurrency}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                  <SelectItem value="usdt">Tether (USDT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <form onSubmit={handleWithdrawal}>

          <div className="mt-6 space-y-4">
            {withdrawalMethod !== "crypto" && (
              <div>
                <Label htmlFor="accountName" className="block text-sm font-medium mb-2">
                  Nom du Compte
                </Label>
                <Input
                  id="accountName"
                  type="text"
                  placeholder="Enter account holder name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  onChange={(e) => setName(e.target.value)}
                required
                readOnly={loading}
                />
              </div>
            )}

            <div>
              <Label htmlFor="accountNumber" className="block text-sm font-medium mb-2">
                {withdrawalMethod === "crypto" ? "Addresse USDT TRC20" : "Numero du compte"}
              </Label>
              <Input
                id="accountNumber"
                type="text"
                onChange={(e) => setNumber(e.target.value)}
                readOnly={loading}
                placeholder={withdrawalMethod === "crypto" ? "Entrez votre adresse" : "Entrez votre numero de téléphone"}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <Label htmlFor="amount" className="block text-sm font-medium mb-2">
                Amount
              </Label>
              <Input
                id="amount"
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                placeholder="Enter amount to withdraw"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                readOnly={loading}
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <Button disabled={loading} type="submit" className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">payments</span>
              Envoyer votre requete
            </Button>
          </div>
          </form>
        </Card>
      </Card>
    </div>
  )
}