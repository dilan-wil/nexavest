'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from 'lucide-react'
import { login } from '@/functions/login'
import Loader from '@/components/loader'
import { useToast } from '@/hooks/use-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const {toast} = useToast()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true);

    try {
      const loginSuccessful = await login({email, password});
      if (loginSuccessful) {
        toast({
          variant: "success",
          title: "Connexion Réussi.",
          description: "Vous serez diriger vers votre pannel.",
        });
        router.push("/panel");
      } else {
        toast({
          variant: "destructive",
          title: "Mauvais email ou mot de passe.",
          description: "Rassurez-vous d'entrer la bonne adresse mail et le bon mot de passe.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Login to CryptoVest Pro</h1>
        <form onSubmit={handleLogin} className="space-y-4">
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
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-gray-400">lock</span>
              </span>
              <Input
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
            Mot de passe oublié?
          </Link>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Vous n'avez pas de compte ?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}