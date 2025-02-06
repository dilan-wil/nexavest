'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownToLine, ChevronLeftCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/context/auth-context'
import { addDeposit } from '@/functions/add-deposit'
import { useToast } from '@/hooks/use-toast'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const paymentMethods = {
  'orange-money': { name: 'Orange Money', number: '694918751', account: 'Maureen Enow Genge' },
  'mtn-money': { name: 'MTN Money', number: '674323545', account: 'Vrouwa Hamidou Guire' },
  'crypto': { name: 'USDT', network: 'TRC20', number: 'TPeAE8zwT8qDhVHCkgngAQzNM13fsBy621' },
}

export default function Deposit() {
  const { user } = useAuth()
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [mobileProvider, setMobileProvider] = useState("")
  const [crypto, setCrypto] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleAddMoney = async (e) => {
    e.preventDefault();
    if (!user) {
      return false;
    }
    console.log({
        userUid: user.uid,
        amount: amount,
        transactionId: transactionId,
        paymentMethod,
        gateway: paymentMethod === "mobile" ? mobileProvider : crypto,
      })
    
    // try {
    //   setLoading(true);
      
    //   const added = await addDeposit({
    //     userUid: user.uid,
    //     amount: amount,
    //     transactionId: transactionId,
    //     gateway: paymentMethods === "mobile" ? mobileProvider : crypto,
    //   });
    //   console.log(added);
    //   toast({
    //     variant: "success",
    //     title: "En attente d'approbation.",
    //     description:
    //       "Votre demande de dépôt est en attente d'approbation. Un administrateur se chargera de l'accepter.",
    //   });
    // } catch (error) {
    //   if (error.message === "This deposit request has already been processed.") {
    //     // Specific toast for duplicate transaction error
    //     toast({
    //       variant: "destructive",
    //       title: "Erreur de transaction",
    //       description: "Cette demande de dépôt a déjà été traitée.",
    //     });
    //   } else {
    //     // Generic toast for other errors
    //     toast({
    //       variant: "destructive",
    //       title: "Erreur",
    //       description:
    //         "Rassurez-vous que vous avez entré le bon montant et la bonne clé de transaction.",
    //     });
    //   }
    // } finally {
    //   setLoading(false);
    //   setTransactionId("");
    //   setAmount("");
    //   setPaymentMethod("");
    // }
  };

  return (
    <div className="w-full pb-24 max-w-[1200px] p-4 md:p-6 rounded-xl mx-auto">
      <Card className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold">Dépot</h1>
          <div className="relative">
            <details className="group">
              <summary className="flex items-center gap-2 cursor-pointer list-none px-4 py-2 rounded-lg hover:bg-gray-50">
                <span className="material-symbols-outlined">help</span>
                Information
              </summary>
              <div className="absolute right-0 mt-2 w-64 p-4 bg-white rounded-xl shadow-lg border border-gray-100 z-10">
                <p className="text-sm">Choisissez votre moyen de paiement et suivez les informations.</p>
              </div>
            </details>
          </div>
        </div>

        <Card className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-6">Moyen de paiement</h2>

          <RadioGroup onValueChange={setPaymentMethod} className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all">
              <RadioGroupItem value="mobile" id="mobile" className="w-4 h-4 accent-orange-500" />
              <Label htmlFor="mobile" className="flex items-center gap-3 cursor-pointer">
                <span className="material-symbols-outlined text-orange-500">smartphone</span>
                Paiement Mobile
              </Label>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all">
              <RadioGroupItem value="crypto" id="crypto" className="w-4 h-4 accent-blue-500" />
              <Label htmlFor="crypto" className="flex items-center gap-3 cursor-pointer">
                <span className="material-symbols-outlined text-blue-500">currency_bitcoin</span>
                Crypto Monnaie (+20%)
              </Label>
            </div>
          </RadioGroup>

          {paymentMethod === "mobile" && (
            <div className="mt-6 space-y-4">
              <Select onValueChange={setMobileProvider}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select mobile provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="orange">Orange Money</SelectItem>
                  <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                </SelectContent>
              </Select>
              
              {mobileProvider && (
                <>
                  <div>
                    {/* <Label className="block text-sm font-medium mb-2">Account to send money to:</Label> */}
                    <div className="rounded-lg bg-blue-50 p-4">
                       <div className="space-y-2">
                            <p className="text-sm">
                                Nom du Compte: <span className="font-semibold">{mobileProvider === "orange" ? "Pagniol Dublece Tchonmo" : "Helene Choungo epse Zebaze"}</span>
                            </p>
                            <p className="text-sm">
                                Numero du compte: <span className="font-semibold">{mobileProvider === "orange" ? "656408222" : "678579362"}</span>
                            </p>
                            <p className="text-sm">
                                Réseau: <span className="font-semibold">{mobileProvider === "orange" ? "Orange Money" : "MTM Momo"}</span>
                            </p>
                        </div>
                    </div> 
                    {/* <p className="font-bold">{mobileProvider === "orange" ? "+225 0123456789" : "+225 9876543210"}</p> */}
                  </div>
                  <form onSubmit={handleAddMoney}>
                  <div>
                    <Label htmlFor="amount" className="block text-sm font-medium mb-2">
                      Montant
                    </Label>
                    <Input
                      id="amount"
                      onChange={(e) => setAmount(e.target.value)}
                      type="number"
                      placeholder="Enter amount to deposit"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="transactionId" className="block text-sm font-medium mb-2">
                      Transaction ID
                    </Label>
                    <Input
                      id="transactionId"
                      type="text"
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter transaction ID"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    />
                  </div>
                  <Button disabled={loading} type="submit" className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all">
                    Confirmez le dépot
                  </Button>
                  </form>
                  
                </>
              )}
            </div>
          )}

          {paymentMethod === "crypto" && (
            <div className="mt-6 space-y-4">
              <Select onValueChange={setCrypto}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usdt">USDT</SelectItem>
                  <SelectItem value="btc">BTC</SelectItem>
                  <SelectItem value="eth">ETH</SelectItem>
                </SelectContent>
              </Select>

              {crypto && (
                <>
                  <div>
                  <div className="rounded-lg bg-blue-50 p-4">
                       <div className="space-y-2">
                            <p className="text-sm">
                                Adresse du Portefeuille: <span className="font-semibold">{crypto === "btc"
                        ? "15mqyeTVd8NJoyrLQGoJCyLy3nZrsGdvgY"
                        : crypto === "eth"
                          ? "0x17bddd66a1ae60ac7a6aea84cb432e456bd1c833"
                          : "TPeAE8zwT8qDhVHCkgngAQzNM13fsBy621"}</span>
                            </p>
                            <p className="text-sm">
                                Réseau: <span className="font-semibold">{crypto === "btc"
                        ? "BTC"
                        : crypto === "eth"
                          ? "BEP20"
                          : "TRC20"}</span>
                            </p>
                        </div>
                    </div>
                  </div>
                  <form onSubmit={handleAddMoney}> 
                  <div>
                    <Label htmlFor="amount" className="block text-sm font-medium mb-2">
                      Montant
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount to deposit"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="transactionId" className="block text-sm font-medium mb-2">
                      Transaction ID
                    </Label>
                    <Input
                      id="transactionId"
                      type="text"
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter transaction ID"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    />
                  </div>
                  <Button disabled={loading} type="submit" className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all">
                    Confirmez le dépot
                  </Button>

                  </form>
                </>
              )}
            </div>
          )}
        </Card>
      </Card>
    </div>
  )
}

