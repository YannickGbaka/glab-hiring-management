'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BriefcaseIcon } from "lucide-react"

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_your_publishable_key')

function PaymentForm({ selectedPlan }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setProcessing(true)

    if (!stripe || !elements) {
      return
    }

    const cardElement = elements.getElement(CardElement)

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    })

    if (error) {
      setError(error.message)
      setProcessing(false)
    } else {
      // Here you would typically send the paymentMethod.id to your server
      console.log('PaymentMethod:', paymentMethod)
      alert('Payment successful! Thank you for subscribing to JobPostPro.')
      setProcessing(false)
    }
  }

  return (
    <div>
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="card-element">Credit or debit card</Label>
        <div className="p-3 border rounded-md">
          <CardElement id="card-element" options={{style: {base: {fontSize: '16px'}}}} />
        </div>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </form>
      <Button type="button" className="w-full mt-2">
        <Link href="/dashboard">Pay</Link>
      </Button>
    </div>
  )
}

export function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState(null)

  const plans = [
    { id: 'starter', name: 'Starter', price: '$99/month' },
    { id: 'professional', name: 'Professional', price: '$299/month' },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom' },
  ]

  const handlePlanChange = (planId) => {
    setSelectedPlan(plans.find(plan => plan.id === planId))
  }

  return (
    <div className="flex flex-col min-h-screen">
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
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Complete Your Subscription</h1>
        <div className="max-w-md mx-auto">
          <div className="mb-6 space-y-4">
            <Label htmlFor="plan">Select Your Plan</Label>
            <Select onValueChange={handlePlanChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>{plan.name} - {plan.price}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPlan && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Selected Plan: {selectedPlan.name}</h2>
              <p className="text-gray-600">Price: {selectedPlan.price}</p>
            </div>
          )}

          {selectedPlan && (
            <Elements stripe={stripePromise}>
              <PaymentForm selectedPlan={selectedPlan} />
            </Elements>
          )}

          <p className="mt-4 text-center text-sm text-gray-600">
            By proceeding with the payment, you agree to our{" "}
            <Link href="/terms" className="font-medium text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
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