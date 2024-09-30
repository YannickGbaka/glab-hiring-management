'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BriefcaseIcon, UsersIcon, EyeIcon, BarChart3Icon } from "lucide-react"

// Mock data for dashboard statistics
const initialStats = {
  activeJobs: 15,
  totalApplicants: 237,
  viewsLastMonth: 1542,
  averageApplicantsPerJob: 15.8
}

export default function Dashboard() {
  const [stats, setStats] = useState(initialStats)

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
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Job Postings</CardTitle>
              <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplicants}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Job Views (Last Month)</CardTitle>
              <EyeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.viewsLastMonth}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Applicants per Job</CardTitle>
              <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageApplicantsPerJob}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Job Postings</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>Software Engineer - Posted 2 days ago</li>
                <li>Product Manager - Posted 3 days ago</li>
                <li>UX Designer - Posted 5 days ago</li>
              </ul>
              <Button asChild className="w-full mt-4">
                <Link href="/jobs">View All Jobs</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Job Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>Frontend Developer - 45 applicants</li>
                <li>Data Scientist - 38 applicants</li>
                <li>Marketing Manager - 32 applicants</li>
              </ul>
              <Button asChild className="w-full mt-4">
                <Link href="/analytics">View Detailed Analytics</Link>
              </Button>
            </CardContent>
          </Card>
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