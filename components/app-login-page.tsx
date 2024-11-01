"use client"
import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BriefcaseIcon, Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

export function LoginComponent() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email format'
    if (!formData.password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      try {
        const response = await fetch('http://192.168.1.101:3001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Login successful:', data)
          toast.success('Login successful!', {
            style: {
              background: '#4CAF50',
              color: '#fff',
            },
          })
          // You might want to store the token or user data in localStorage or a state management solution here
          router.push('/dashboard')
        } else {
          const errorData = await response.json()
          toast.error(errorData.message || 'Login failed. Please try again.', {
            style: {
              background: '#F44336',
              color: '#fff',
            },
          })
        }
      } catch (error) {
        console.error('Login error:', error)
        toast.error('An error occurred. Please try again later.', {
          style: {
            background: '#FF9800',
            color: '#fff',
          },
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      // Display validation errors
      Object.values(errors).forEach((error) => {
        toast.error(error, {
          style: {
            background: '#2196F3',
            color: '#fff',
          },
        })
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" />
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center space-x-4">
          <BriefcaseIcon className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-primary">JobPostPro</span>
        </div>
        <nav className="hidden md:flex space-x-4">
          <Link href="/" className="text-gray-600 hover:text-primary">Home</Link>
          <Link href="/#features" className="text-gray-600 hover:text-primary">Features</Link>
          <Link href="/pricing" className="text-gray-600 hover:text-primary">Pricing</Link>
          <Link href="/#contact" className="text-gray-600 hover:text-primary">Contact</Link>
          <Link href="/sign-up" className="text-gray-600 hover:text-primary">Sign Up</Link>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Log in to JobPostPro</h1>
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'border-red-500' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'border-red-500' : ''}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Log In'
                )}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <span className="text-2xl font-bold">JobPostPro</span>
            <p className="mt-2">© 2023 JobPostPro. All rights reserved.</p>
          </div>
          <nav className="flex space-x-4">
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
            <Link href="/#contact" className="hover:text-primary">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
