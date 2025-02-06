'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Check, Loader2 } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from '@/components/ui/alert-dialog'
import { useAuth } from '@/components/context/auth-context'
import { doc, updateDoc, arrayUnion, addDoc, collection, increment } from "firebase/firestore";
import { db } from "@/functions/firebase";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid"; // Import if using the uuid library
import { useToast } from '@/hooks/use-toast'
import addReferralBonus from '@/functions/add-referral-bonus'

const plans = [
  {
    id: 1,
    name: "Starter Plan",
    type: "Basic",
    price: 2500,
    dailyRevenue: 300,
    period: 30,
    icon: "savings",
    color: "bg-blue-600",
    // text1: "text-blue-600",
    // color: "bg-blue-600",
    // color: "bg-blue-600",
  },
  {
    id: 2,
    name: "Basic Growth",
    type: "Basic",
    price: 5000,
    dailyRevenue: 600,
    period: 30,
    icon: "trending_up",
    color: "bg-blue-600",
  },
  {
    id: 3,
    name: "Basic Plus",
    type: "Basic",
    price: 10000,
    dailyRevenue: 1200,
    period: 30,
    totalRevenue: 525,
    icon: "add_chart",
    color: "bg-blue-600",
  },
  {
    id: 4,
    name: "Pro Starter",
    type: "Pro",
    price: 20000,
    dailyRevenue: 2400,
    period: 30,
    icon: "trending_up",
    color: "bg-indigo-600",
  },
  {
    id: 5,
    name: "Pro Growth",
    type: "Pro",
    price: 50000,
    dailyRevenue: 6000,
    period: 30,    icon: "show_chart",
    color: "bg-indigo-600",
  },
  {
    id: 6,
    name: "Pro Plus",
    type: "Pro",
    price: 100000,
    dailyRevenue: 12000,
    period: 30,
    icon: "analytics",
    color: "bg-indigo-600",
  },
  {
    id: 7,
    name: "Elite Plan",
    type: "Premium",
    price: 250000,
    dailyRevenue: 24000,
    period: 30,
    icon: "diamond",
    color: "bg-purple-600",
  },
  {
    id: 8,
    name: "VIP Plan",
    type: "Premium",
    price: 500000,
    dailyRevenue: 60000,
    period: 30,
    icon: "workspace_premium",
    color: "bg-purple-600",
  },
  {
    id: 9,
    name: "VVIP Plan",
    type: "Premium",
    price: 1000000,
    dailyRevenue: 120000,
    period: 30,
    totalRevenue: 30000,
    icon: "workspace_premium",
    color: "bg-purple-600",
  },
]

export default function Investments() {
  const [showMyInvestments, setShowMyInvestments] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userPLans, setUserPlans] = useState([]);
  const { userInfo, setUserInfo, setTransactions } = useAuth();
  const router = useRouter()
  const now = new Date();
  const { toast } = useToast()
  const [showActivePlans, setShowActivePlans] = useState(false)

  useEffect(() => {
    console.log(userInfo)
    if(userInfo?.plans){
      setUserPlans(userInfo?.plans)
    } else {
      setUserPlans([])
    }
  }, [userInfo])

  const handleBuyClick = (plan) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
  };

  const confirmPurchase = async () => {
    console.log(selectedPlan)
    setLoading(true)
    if (!userInfo?.uid || !selectedPlan) return;

    if (userInfo.balance < selectedPlan.price) {
      toast({
        variant: "destructive",
        title: "Solde Insuffisant.",
        description: "Veuillez Rechargez votre compte pour payer ce plan.",
      })
      router.push("/panel/deposit");
      return;
    }

    try {
      const userDocRef = doc(db, "users", userInfo.uid);
      const newBalance = userInfo.balance - selectedPlan.price;

      const newPlan = {
        instanceId: uuidv4(),
        ...selectedPlan,
        purchaseDate: new Date().toISOString(),
        times: 30,
        lastClicked: now.toISOString(),
      };

      await updateDoc(userDocRef, {
        balance: newBalance,
        plans: arrayUnion(newPlan),
      });

      const transactionsCollectionRef = collection(userDocRef, "transactions");
      const newTransaction = {
        description: `Achat du plan ${selectedPlan.name}`,
        transactionId: selectedPlan.name,
        type: "Achat",
        amount: -selectedPlan.price,
        charge: 0,
        status: "success",
        method: "system",
        icon: "shopping_bag",
        iconBg: "bg-blue-100",
        date: new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
      }

      await addDoc(transactionsCollectionRef, newTransaction);

      setUserInfo({ ...userInfo, balance: newBalance, plans: [...(userInfo?.plans || []), newPlan], });
      // Update transactions by appending the new transaction
      setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);

      if (!userInfo.plans) {
        await addReferralBonus(userInfo.referredBy, selectedPlan.price)
      }

      toast({
        variant: "success",
        title: "Achat Réussi.",
        description: "Votre plan a été ajouté. Rendez-vous dans la section taches pour éfféctuer vos taches.",
      })
    } catch (error) {
      console.error("Error purchasing plan: ", error);

      toast({
        variant: "destructive",
        title: "Erreur.",
        description: "Recommencer s'ils vous plait.",
      })
    } finally {
      setLoading(false)
      setDialogOpen(false);
    }
  };

  const handleTaskClick = async (plan) => {
    if (loading) return;
  
    const now = new Date();
    const lastClicked = plan.lastClicked ? new Date(plan.lastClicked) : null;
    const purchaseDate = plan.purchaseDate ? new Date(plan.purchaseDate) : null;
  
    // Check if the task is being accessed on the same day as the purchase
    if (purchaseDate && now.toDateString() === purchaseDate.toDateString()) {
      toast({
        variant: "destructive",
        title: "Première tâche indisponible.",
        description: "Votre première tâche sera disponible demain à 00h.",
      });
      return;
    }
  
    // Check if the task was already clicked today
    if (lastClicked && now.toDateString() === lastClicked.toDateString()) {
      toast({
        variant: "destructive",
        title: "Déjà effectué aujourd'hui.",
        description: "Vous avez déjà effectué cette tâche aujourd'hui. Revenez demain pour recommencer.",
      });
      return;
    }
  
    // Prevent further clicks if times are exhausted
    if (plan.times <= 0) {
      toast({
        variant: "destructive",
        title: "Plus de tâches.",
        description: "Vous avez épuisé le nombre de tâches pour ce plan.",
      });
      return;
    }
  
    setLoading(true);
  
    try {
      const userDocRef = doc(db, "users", userInfo?.uid);
  
      // Filter and calculate earnings only for plans available today
      const availablePlans = userInfo?.plans.filter((p) => {
        const planPurchaseDate = p.purchaseDate ? new Date(p.purchaseDate) : null;
  
        // A plan is available if it was purchased before today
        return planPurchaseDate && now > planPurchaseDate && p.times > 0;
      });
  
      const totalDailyEarnings = availablePlans.reduce(
        (sum, p) => sum + (p.id === plan.id ? p.dailyRevenue : 0),
        0
      );
  
      const updatedPlans = userInfo?.plans.map((p) =>
        p.id === plan.id
          ? {
              ...p,
              times: p.times - 1,
              lastClicked: now.toISOString(),
            }
          : p
      );
  
      const newBalance = userInfo?.balance + totalDailyEarnings;
  
      // Update Firestore with new plans data and balance
      await updateDoc(userDocRef, {
        plans: updatedPlans,
        balance: newBalance,
        earned: increment(totalDailyEarnings),
      });
  
      const transactionsCollectionRef = collection(userDocRef, "transactions");
      const newTransaction = {
        description: `Gain du plan ${plan.name}`,
        transactionId: plan.name,
        type: "Tâches",
        amount: totalDailyEarnings,
        charge: 0,
        status: "success",
        method: "system",
        icon: "task_alt",
        iconBg: "bg-purple-100",
        date: new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
      };
  
      await addDoc(transactionsCollectionRef, newTransaction);
  
      // Update local state
      setUserInfo({
        ...userInfo,
        plans: updatedPlans,
        balance: newBalance,
      });
      // Update transactions by appending the new transaction
      setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
  
      toast({
        variant: "success",
        title: "Tâches effectuées avec succès.",
        description: "Vous avez effectué votre tâche. Vos gains ont été crédités.",
      });
    } catch (error) {
      console.error("Error completing task:", error);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };  
  
  

  // const handleInvest = (planId) => {
  //   console.log('Invested in plan:', planId)
  //   setActivePlans([...activePlans, planId])
  // }

  return (
    <div className="space-y-6 pb-24 max-w-6xl mx-auto">
      <h1 className="text-3xl text-white font-bold mb-8">Investment Plans</h1>

      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 overflow-hidden mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gray-50 p-1 rounded-xl">
            <button
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                !showActivePlans ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setShowActivePlans(false)}
            >
              Tout les plans
            </button>
            <button
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                showActivePlans ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setShowActivePlans(true)}
            >
              Mes plans
            </button>
          </div>
        </div>
      </div>

      {!showActivePlans ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`bg-white p-6 rounded-xl border border-${plan.color}-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex justify-between items-center mb-6">
                <span className={`material-symbols-outlined text-${plan.color}-600 text-3xl`}>{plan.icon}</span>
                <span
                  className={`bg-${plan.color}-200 text-${plan.color}-800 px-3 py-1 rounded-full text-sm font-medium`}
                >
                  {plan.type}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{plan.name}</h3>
              <p className="text-gray-600 mb-4">Investissement: XAF{plan.price}</p>
              <div className="text-3xl font-bold mb-6 text-gray-800">
                XAF{plan.dailyRevenue.toFixed(2)}
                <span className="text-sm text-gray-500 font-normal">/jours</span>
              </div>
              <p className="text-gray-600 mb-2">Periode: {plan.period} jours</p>
              <p className="text-gray-600 mb-4">Revenus Total: XAF{plan.dailyRevenue * plan.period}</p>
              <button
                onClick={() => handleBuyClick(plan)} disabled={loading}
                className={`w-full ${plan.color} hover:bg-${plan.color}-700 text-white py-3 rounded-xl font-medium transform hover:scale-105 transition-all duration-300`}
              >
                Investir
              </button>
            </article>
          ))}
        </section>
      ) : (
        <section>
          <h2 className="text-2xl font-bold mb-6">Investissement actifs</h2>
          <div className="space-y-4">
            {userPLans.map((plan) => (
              <article
              key={plan.id}
              className={`bg-white p-6 rounded-xl border border-${plan.color}-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex justify-between items-center mb-6">
                <span className={`material-symbols-outlined text-${plan.color}-600 text-3xl`}>{plan.icon}</span>
                <span
                  className={`bg-${plan.color}-200 text-${plan.color}-800 px-3 py-1 rounded-full text-sm font-medium`}
                >
                  {plan.type}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{plan.name}</h3>
              <p className="text-gray-600 mb-4">Investissement: XAF{plan.price}</p>
              <div className="text-3xl font-bold mb-6 text-gray-800">
                XAF{plan.dailyRevenue.toFixed(2)}
                <span className="text-sm text-gray-500 font-normal">/day</span>
              </div>
              <p className="text-gray-600 mb-2">Période Restante: {plan.times} days</p>
              <p className="text-gray-600 mb-4">Revenus Restant: XAF{plan.dailyRevenue * plan.period}</p>
              <button
                onClick={() => handleTaskClick({ dailyRevenue: plan.dailyRevenue, id: plan.id, instanceId: plan.instanceId, lastClicked: plan.lastClicked, name: plan.name, price: plan.price, purchaseDate: plan.purchaseDate, times: plan.times })} 
                disabled={loading} 
                className={`w-full ${plan.color} hover:bg-${plan.color}-700 text-white py-3 rounded-xl font-medium transform hover:scale-105 transition-all duration-300`}
              >
                Completez la tache
              </button>
            </article>
            ))}
          </div>
        </section>
      )}
      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <AlertDialogHeader>
            <h2 className="text-lg font-semibold">Confirmer l'Achat</h2>
          </AlertDialogHeader>
          <p className="text-gray-700">Confirmez votre l'achat du plan {selectedPlan?.name}</p>
          <AlertDialogFooter className="mt-4 flex justify-end space-x-2">
            <AlertDialogCancel onClick={() => setDialogOpen(false)} className="text-red-600">Annuler</AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={confirmPurchase} className="bg-blue-600 text-white hover:bg-blue-700">
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}