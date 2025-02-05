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
      const signUp = await signup({ email, password, name, referralCode })
      console.log(signUp)
      if (signUp === true) {
        setLoading(false)
        toast({
          variant: "success",
          title: "Inscription Réussi.",
          description: "Vous avez été inscrit. Vous serez diriger vers votre pannel.",
        })
        router.push('/d')
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
    <div className="flex items-center justify-center min-h-screen bg-blue-100 p-4">
      {loading && <Loader />}
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-blue-900">S'enregistrer</CardTitle>
          <CardDescription className="text-center text-blue-700">
            Créer un compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-blue-800">Nom</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-blue-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-800">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-blue-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-blue-800">Code de Parrainage</Label>
              <Input
                id="name"
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="border-blue-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-800">Mot de Passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-blue-300 focus:border-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-blue-800">Confirmez le mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="border-blue-300 focus:border-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-600 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              S'enregistrer
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-blue-700 w-full">
            Avez vous déjà un compte ?{' '}
            <Link href="/login" className="text-blue-900 font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </CardFooter>
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
