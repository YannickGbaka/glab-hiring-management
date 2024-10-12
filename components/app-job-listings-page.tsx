'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPinIcon, DollarSignIcon, ClockIcon, SearchIcon } from "lucide-react"
import { Header } from '@/components/Header'

// Mock data for job listings
const jobListings = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: 150000,
    description: 'We are seeking a talented Senior Software Engineer to join our innovative team...',
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'InnovateCo',
    location: 'New York, NY',
    type: 'Full-time',
    salary: 120000,
    description: 'Join our product team to lead the development of cutting-edge software solutions...',
  },
  {
    id: 3,
    title: 'UX Designer',
    company: 'DesignHub',
    location: 'Remote',
    type: 'Contract',
    salary: 100000,
    description: 'We\'re looking for a creative UX Designer to help shape the future of our products...',
  },
  {
    id: 4,
    title: 'Data Scientist',
    company: 'DataDriven',
    location: 'Boston, MA',
    type: 'Full-time',
    salary: 140000,
    description: 'Join our data science team to uncover insights and drive business decisions...',
  },
  {
    id: 5,
    title: 'Marketing Specialist',
    company: 'GrowthGenius',
    location: 'Chicago, IL',
    type: 'Part-time',
    salary: 60000,
    description: 'Help us create and execute marketing strategies to drive customer acquisition...',
  },
]

export function FrontOfficeJobsComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [salaryRange, setSalaryRange] = useState([0, 200000])

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = selectedLocation === 'all' || job.location.includes(selectedLocation)
    const matchesType = selectedType === 'all' || job.type === selectedType
    const matchesSalary = job.salary >= salaryRange[0] && job.salary <= salaryRange[1]

    return matchesSearch && matchesLocation && matchesType && matchesSalary
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search jobs, companies, or keywords"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="San Francisco">San Francisco</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="Boston">Boston</SelectItem>
                <SelectItem value="Chicago">Chicago</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="type">Job Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="salary-range">Salary Range</Label>
            <Slider
              id="salary-range"
              min={0}
              max={200000}
              step={10000}
              value={salaryRange}
              onValueChange={setSalaryRange}
              className="mt-2"
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>${salaryRange[0].toLocaleString()}</span>
              <span>${salaryRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <Card key={job.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{job.title}</CardTitle>
                <p className="text-gray-600">{job.company}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <DollarSignIcon className="w-4 h-4 mr-2" />
                  <span>${job.salary.toLocaleString()} per year</span>
                </div>
                <p className="text-sm text-gray-700">{job.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/jobs/${job.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            <p>No job listings found matching your criteria.</p>
          </div>
        )}
      </main>

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