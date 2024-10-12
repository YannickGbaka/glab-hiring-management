'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { BriefcaseIcon, MapPinIcon, DollarSignIcon, ClockIcon, BuildingIcon, GlobeIcon, UsersIcon, LinkedinIcon, PhoneIcon } from "lucide-react"

// Mock function to fetch job data
const fetchJobData = async (id: string) => {
  // In a real application, this would be an API call
  return {
    id,
    title: 'Senior Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $160,000',
    description: 'We are seeking a talented Senior Software Engineer to join our innovative team. You will be responsible for designing, developing, and maintaining high-performance software applications. This role offers an exciting opportunity to work on cutting-edge technologies and contribute to products that impact millions of users.',
    requirements: [
      '5+ years of experience in software development',
      'Proficiency in React, Node.js, and TypeScript',
      'Experience with cloud platforms (AWS, Azure, or GCP)',
      'Strong problem-solving skills and attention to detail',
      'Excellent communication and teamwork abilities'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Health, dental, and vision insurance',
      '401(k) plan with company match',
      'Flexible work hours and remote work options',
      'Professional development budget'
    ],
    companyInfo: {
      name: 'TechCorp',
      description: 'TechCorp is a leading technology company specializing in innovative software solutions. We are dedicated to creating products that transform industries and improve people\'s lives.',
      employees: '1000-5000',
      website: 'https://www.techcorp.com',
    }
  }
}

export function Page({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const [job, setJob] = useState<any>(null)
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false)

  useEffect(() => {
    const loadJobData = async () => {
      try {
        const jobData = await fetchJobData(id)
        setJob(jobData)
      } catch (error) {
        console.error('Error fetching job data:', error)
        // Handle error (e.g., show error message to user)
      }
    }
    loadJobData()
  }, [id])

  const handleApply = (event: React.FormEvent) => {
    event.preventDefault()
    // Here you would typically send the application data to your backend
    console.log('Application submitted')
    setIsApplyDialogOpen(false)
    // Show a success message or redirect the user
  }

  if (!job) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <Link href="/jobs" className="text-primary hover:underline">← Back to Job Listings</Link>
            <h1 className="text-3xl font-bold text-primary">{job.title}</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </nav>
        </div>
      </header>

      <motion.main 
        className="flex-grow container mx-auto px-4 py-8"
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <MapPinIcon className="w-5 h-5 mr-2 text-gray-600" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2 text-gray-600" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSignIcon className="w-5 h-5 mr-2 text-gray-600" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center">
                    <BriefcaseIcon className="w-5 h-5 mr-2 text-gray-600" />
                    <span>{job.company}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                <p className="mb-4">{job.description}</p>
                <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                <ul className="list-disc list-inside mb-4">
                  {job.requirements.map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
                <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                <ul className="list-disc list-inside">
                  {job.benefits.map((benefit: string, index: number) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About {job.companyInfo.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{job.companyInfo.description}</p>
                <div className="flex items-center mb-2">
                  <UsersIcon className="w-5 h-5 mr-2 text-gray-600" />
                  <span>{job.companyInfo.employees} employees</span>
                </div>
                <div className="flex items-center">
                  <GlobeIcon className="w-5 h-5 mr-2 text-gray-600" />
                  <a href={job.companyInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {job.companyInfo.website}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-8">
              <CardContent className="pt-6">
                <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full mb-4">Apply Now</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Apply for {job.title}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleApply} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" required />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" required />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <div className="flex">
                          <Select className="mr-2">
                            <SelectTrigger id="phone-prefix">
                              <SelectValue placeholder="+1" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="+225">+225</SelectItem>
                              <SelectItem value="+44">+44</SelectItem>
                              <SelectItem value="+91">+91</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="relative flex-grow">
                            <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input id="phone" type="tel" className="pl-10" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                          <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input id="location" className="pl-10" placeholder="Enter your location" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn URL (optional)</Label>
                        <div className="relative">
                          <LinkedinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input id="linkedin" className="pl-10" placeholder="https://www.linkedin.com/in/yourprofile" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="resume">Resume</Label>
                        <Input id="resume" type="file" required />
                      </div>
                      <div>
                        <Label htmlFor="cover-letter">Cover Letter</Label>
                        <Textarea id="cover-letter" rows={4} />
                      </div>
                      <Button type="submit" className="w-full">Submit Application</Button>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" className="w-full" onClick={() => router.push('/jobs')}>
                  Back to Job Listings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">JobPostPro</h2>
              <p className="text-sm">Find your dream job today</p>
            </div>
            <nav className="flex space-x-4">
              <Link href="/about" className="hover:text-primary-foreground">About</Link>
              <Link href="/contact" className="hover:text-primary-foreground">Contact</Link>
              <Link href="/privacy" className="hover:text-primary-foreground">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary-foreground">Terms of Service</Link>
            </nav>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>&copy; 2023 JobPostPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}