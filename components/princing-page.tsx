'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Check, BriefcaseIcon } from "lucide-react"

export function Pricing() {
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
          <Link href="/sign-up" className="text-gray-600 hover:text-primary">SignUp</Link>
        </nav>
        <Button asChild>
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </header>

      <main className="flex-grow">
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-4">Pricing Plans</h1>
            <p className="text-xl text-center text-gray-600 mb-12">Choose the right plan for your hiring needs</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PricingCard
                title="Starter"
                price="$99"
                period="per month"
                description="Perfect for small businesses just getting started with hiring"
                features={[
                  "Up to 5 job postings",
                  "Basic AI matching",
                  "Standard analytics",
                  "Email support"
                ]}
                buttonText="Get Started"
                buttonLink="/subscribe"
              />
              <PricingCard
                title="Professional"
                price="$299"
                period="per month"
                description="Ideal for growing companies with regular hiring needs"
                features={[
                  "Up to 20 job postings",
                  "Advanced AI matching",
                  "Detailed analytics dashboard",
                  "Priority email support",
                  "Multi-channel posting"
                ]}
                highlighted={true}
                buttonText="Try Pro"
                buttonLink="/subscribe"
              />
              <PricingCard
                title="Enterprise"
                price="Custom"
                period="contact us for pricing"
                description="Tailored solutions for large organizations with complex hiring processes"
                features={[
                  "Unlimited job postings",
                  "Custom AI solutions",
                  "Advanced analytics with API access",
                  "Dedicated account manager",
                  "Custom integrations",
                  "On-site training"
                ]}
                buttonText="Contact Sales"
                buttonLink="/subscribe"
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FAQItem
                question="Can I change my plan later?"
                answer="Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
              />
              <FAQItem
                question="Is there a free trial available?"
                answer="We offer a 14-day free trial for our Starter and Professional plans. No credit card required."
              />
              <FAQItem
                question="What payment methods do you accept?"
                answer="We accept all major credit cards, PayPal, and bank transfers for Enterprise plans."
              />
              <FAQItem
                question="Is there a long-term contract?"
                answer="No, our Starter and Professional plans are billed monthly with no long-term commitment. Enterprise plans may have custom terms."
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-8">Ready to Transform Your Hiring?</h2>
            <p className="text-xl mb-8">Join thousands of companies already using JobPostPro</p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/sign-up">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="bg-gray-800 text-white py-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <span className="text-2xl font-bold">JobPostPro</span>
            <p className="mt-2">© 2023 JobPostPro. All rights reserved.</p>
          </div>
          <nav className="flex space-x-4">
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
            <Link href="/contact" className="hover:text-primary">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function PricingCard({ title, price, period, description, features, highlighted = false, buttonText, buttonLink }) {
  return (
    <div className={`bg-white p-8 rounded-lg shadow-md ${highlighted ? 'ring-2 ring-primary' : ''}`}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-4xl font-bold mb-2">{price}</p>
      <p className="text-gray-600 mb-4">{period}</p>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="mb-8 space-y-2">
        {features.map((feature, index) =>
          <li key={index} className="flex items-center">
            <Check className="w-5 h-5 text-primary mr-2" />
            <span>{feature}</span>
          </li>
        )}
      </ul>
      <Button className="w-full" variant={highlighted ? "default" : "outline"} asChild>
        <Link href={buttonLink}>{buttonText}</Link>
      </Button>
    </div>
  )
}

function FAQItem({ question, answer }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  )
}