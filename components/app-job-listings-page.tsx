'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPinIcon, DollarSignIcon, ClockIcon, SearchIcon } from "lucide-react"
import { Header } from '@/components/Header'

// Définissez une interface pour le type Job
interface Job {
  id: string;
  title: string;
  company?: string;
  location: string;
  jobType: string;
  salary: string;
  description: string;
  requirements?: string;
}

export function FrontOfficeJobsComponent() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [salaryRange, setSalaryRange] = useState([0, 21000000])

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:3001/api/jobs');
        console.log('Raw API Response:', response.data);
        
        const jobsData = Array.isArray(response.data) ? response.data : response.data.jobs;
        console.log('Processed Jobs Data:', jobsData);
        
        const validJobs = jobsData.filter((job: any) => {
          const isValid = job.id && job.title;
          if (!isValid) {
            console.log('Invalid job entry:', job);
          }
          return isValid;
        });
        
        console.log('Valid Jobs:', validJobs);
        setJobs(validJobs);
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to fetch jobs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Fonction utilitaire pour extraire la valeur numérique minimale du salaire
  const extractMinSalary = (salaryString: string): number => {
    const numbers = salaryString.match(/\d+/g);
    return numbers ? parseInt(numbers[0]) : 0;
  }

  // Fonction utilitaire pour extraire la valeur numérique maximale du salaire
  const extractMaxSalary = (salaryString: string): number => {
    const numbers = salaryString.match(/\d+/g);
    return numbers && numbers.length > 1 ? parseInt(numbers[1]) : parseInt(numbers?.[0] || '0');
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = (
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false
    );

    const matchesLocation = selectedLocation === 'all' || 
      job.location?.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesType = selectedType === 'all' || 
      job.jobType?.toLowerCase() === selectedType.toLowerCase();

    return matchesSearch && matchesLocation && matchesType;
  });

  console.log('Filtered Jobs:', filteredJobs)

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

        {isLoading ? (
          <div className="text-center">
            <p>Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : (
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
                    <span>{job.jobType}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <DollarSignIcon className="w-4 h-4 mr-2" />
                    <span>{job.salary}</span>
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
        )}

        {!isLoading && !error && filteredJobs.length === 0 && (
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
