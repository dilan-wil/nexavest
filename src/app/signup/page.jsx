'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from 'lucide-react'
import { signup } from '@/functions/signup'
import Loader from '@/components/loader'
import { useToast } from "@/hooks/use-toast";

function Signup() {
  const searchParams = useSearchParams();
  const invite = searchParams.get("code")
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState("")
  const [referralCode, setReferralCode] = useState(invite)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('') // State for password error
  const router = useRouter()
  const {toast} = useToast()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const signUp = await signup({ email, password, name, referralCode, phone })
      console.log(signUp)
      if (signUp === true) {
        setLoading(false)
        toast({
          variant: "success",
          title: "Inscription Réussi.",
          description: "Vous avez été inscrit. Vous serez diriger vers votre pannel.",
        })
        router.push('/panel')
      } else {
        toast({
          variant: "destructive",
          title: "Erreur lors de l'inscription.",
          description: "Il se pourrait que vous n'ayez pas bien rempli vos informations ou que cette utilisateur existe déjà.",
        })
        console.log(signUp)
      }
      
    } catch(e){
      toast({
        variant: "destructive",
        title: "Erreur lors de l'inscription.",
        description: e.message,
      })
    } finally {
      setLoading(false)
    }
    // Handle signup logic
  }

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value
    setConfirmPassword(value)

    if (password && value !== password) {
      setPasswordError('Les mots de passe ne correspondent pas.') // Set error message
    } else {
      setPasswordError('') // Clear error message
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">S'inscrire pour NexaVest</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <Label htmlFor="name">Noms et Prénoms</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-gray-400">person</span>
              </span>
              <Input
                id="name"
                type="text"
                placeholder="Entrez votre nom"
                className="pl-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-gray-400">mail</span>
              </span>
              <Input
                id="email"
                type="email"
                placeholder="Entrez votre adresse mail"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Numero de Téléphone</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-gray-400">phone</span>
              </span>
              <Input
                id="phone"
                type="tel"
                placeholder="Entrez votre numero de téléphone"
                className="pl-10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="referralCode">Code de Parrainage (Optional)</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-gray-400">redeem</span>
              </span>
              <Input
                id="referralCode"
                type="text"
                placeholder="Code de parainnage"
                className="pl-10"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-gray-400">lock</span>
              </span>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-gray-400">lock</span>
              </span>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="pl-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            S'inscrire
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Vous avez déjà un compte ?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense>
      <Signup />
    </Suspense>
  )
}
