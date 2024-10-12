'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { BriefcaseIcon, UsersIcon, BarChartIcon, ShieldCheckIcon } from "lucide-react"
import Image from "next/image"
import { useTranslation } from '../hooks/useTranslation';
import {Header} from '@/components/Header';

export function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Revolutionize Your Hiring Process</h1>
            <p className="text-xl md:text-2xl mb-8">Streamline job postings and find the perfect candidates with JobPostPro</p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </section>

        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Features That Solve Hiring Challenges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<UsersIcon className="w-12 h-12 text-primary" />}
                title="AI-Powered Matching"
                description="Match candidates to job requirements using advanced AI algorithms"
              />
              <FeatureCard
                icon={<BarChartIcon className="w-12 h-12 text-primary" />}
                title="Analytics Dashboard"
                description="Gain insights into your hiring process with detailed analytics"
              />
              <FeatureCard
                icon={<ShieldCheckIcon className="w-12 h-12 text-primary" />}
                title="Bias-Free Hiring"
                description="Ensure fair and unbiased candidate selection"
              />
              <FeatureCard
                icon={<BriefcaseIcon className="w-12 h-12 text-primary" />}
                title="Multi-Channel Posting"
                description="Publish job offers across multiple platforms with one click"
              />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">See JobPostPro in Action</h2>
            <div className="aspect-w-16 aspect-h-9 max-w-4xl mx-auto">
              <iframe
                className="w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="JobPostPro Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <TestimonialCard
                quote="JobPostPro has cut our hiring time in half!"
                author="Jane Doe"
                position="HR Manager"
                company="Tech Corp"
                imageUrl="/placeholder.svg?height=100&width=100"
              />
              <TestimonialCard
                quote="The AI matching feature is a game-changer."
                author="John Smith"
                position="CEO"
                company="Startup Inc"
                imageUrl="/placeholder.svg?height=100&width=100"
              />
              <TestimonialCard
                quote="We've found higher quality candidates since using JobPostPro."
                author="Alice Johnson"
                position="Recruiter"
                company="Global Solutions"
                imageUrl="/placeholder.svg?height=100&width=100"
              />
              <TestimonialCard
                quote="The analytics help us continually improve our hiring process."
                author="Bob Williams"
                position="CTO"
                company="Innovation Labs"
                imageUrl="/placeholder.svg?height=100&width=100"
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto text-center">
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
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
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

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function TestimonialCard({ quote, author, position, company, imageUrl }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
      <div className="mb-4 relative w-16 h-16 rounded-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={`${author} from ${company}`}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <p className="text-gray-600 mb-4 text-center">"{quote}"</p>
      <div className="text-center">
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-gray-500">{position}</p>
        <p className="text-sm text-gray-500">{company}</p>
      </div>
    </div>
  )
}