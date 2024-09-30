'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BriefcaseIcon, PencilIcon, TrashIcon } from "lucide-react"

// Mock data for job listings
const initialJobs = [
  { id: 1, title: 'Software Engineer', location: 'San Francisco, CA', type: 'Full-time', postedDate: '2023-06-01' },
  { id: 2, title: 'Product Manager', location: 'New York, NY', type: 'Full-time', postedDate: '2023-06-02' },
  { id: 3, title: 'UX Designer', location: 'Remote', type: 'Contract', postedDate: '2023-06-03' },
  { id: 4, title: 'Data Analyst', location: 'Chicago, IL', type: 'Part-time', postedDate: '2023-06-04' },
]

export function Jobs() {
  const [jobs, setJobs] = useState(initialJobs)
  const [searchTerm, setSearchTerm] = useState('')

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      setJobs(jobs.filter(job => job.id !== id))
    }
  }

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center space-x-4">
          <BriefcaseIcon className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-primary">JobPostPro</span>
        </div>
        <nav className="hidden md:flex space-x-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-primary">Dashboard</Link>
          <Link href="/jobs" className="text-gray-600 hover:text-primary">Manage Jobs</Link>
          <Link href="/post-job" className="text-gray-600 hover:text-primary">Post a Job</Link>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Manage Job Postings</h1>
        
        <div className="mb-6 flex justify-between items-center">
          <Input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button asChild>
            <Link href="/post-job">Post New Job</Link>
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Posted Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{job.type}</TableCell>
                <TableCell>{job.postedDate}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/edit-job/${job.id}`}>
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(job.id)}>
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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