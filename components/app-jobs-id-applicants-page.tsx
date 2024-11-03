'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { MapPinIcon, MailIcon, PhoneIcon, LinkedinIcon, FileTextIcon, CalendarIcon, CheckCircleIcon, XCircleIcon, SearchIcon, ArrowLeftIcon, BrainIcon, FileIcon } from "lucide-react"

// Mock data for applicants
const applicants = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    linkedin: "https://www.linkedin.com/in/johndoe",
    resumeUrl: "https://example.com/resume/johndoe.pdf",
    appliedDate: "2023-05-15",
    status: "Under Review",
    aiScore: 85,
    resumeSummary: "Experienced software engineer with 5+ years in full-stack development. Proficient in React, Node.js, and AWS. Strong problem-solving skills and a track record of delivering high-quality projects on time.",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, CA",
    linkedin: "https://www.linkedin.com/in/janesmith",
    resumeUrl: "https://example.com/resume/janesmith.pdf",
    appliedDate: "2023-05-14",
    status: "Interviewed",
    aiScore: 92,
    resumeSummary: "Senior UX designer with 7 years of experience in creating user-centered designs for web and mobile applications. Expertise in user research, wireframing, and prototyping. Strong portfolio of successful projects in fintech and e-commerce.",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "+1 (555) 246-8135",
    location: "Chicago, IL",
    linkedin: "https://www.linkedin.com/in/alicejohnson",
    resumeUrl: "https://example.com/resume/alicejohnson.pdf",
    appliedDate: "2023-05-16",
    status: "Offered",
    aiScore: 95,
    resumeSummary: "Data scientist with a Ph.D. in Machine Learning and 3 years of industry experience. Skilled in Python, TensorFlow, and SQL. Published researcher with a focus on natural language processing and computer vision applications.",
  },
  {
    id: 4,
    name: "Bob Williams",
    email: "bob.williams@example.com",
    phone: "+1 (555) 369-2580",
    location: "Austin, TX",
    linkedin: "https://www.linkedin.com/in/bobwilliams",
    resumeUrl: "https://example.com/resume/bobwilliams.pdf",
    appliedDate: "2023-05-13",
    status: "Rejected",
    aiScore: 70,
    resumeSummary: "Marketing specialist with 2 years of experience in digital marketing. Familiar with SEO, content marketing, and social media management. Seeking to transition into a more technical role in marketing analytics.",
  },
  {
    id: 5,
    name: "Eva Brown",
    email: "eva.brown@example.com",
    phone: "+1 (555) 147-2589",
    location: "Seattle, WA",
    linkedin: "https://www.linkedin.com/in/evabrown",
    resumeUrl: "https://example.com/resume/evabrown.pdf",
    appliedDate: "2023-05-17",
    status: "Under Review",
    aiScore: 88,
    resumeSummary: "DevOps engineer with 4 years of experience in CI/CD, containerization, and cloud infrastructure. Proficient in Docker, Kubernetes, and AWS. Strong background in automating deployment processes and improving system reliability.",
  },
]

export default function PageCandidate() {
  const router = useRouter()
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredApplicants = applicants.filter(applicant => {
    const matchesFilter = filter === "all" || applicant.status.toLowerCase() === filter.toLowerCase()
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleStatusChange = (applicantId: number, newStatus: string) => {
    // In a real application, you would update the status in your backend
    console.log(`Updating status for applicant ${applicantId} to ${newStatus}`)
    // Then you would refetch or update the local state
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <Link href="/jobs" className="text-primary hover:underline flex items-center">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Job Listings
            </Link>
            <h1 className="text-3xl font-bold text-primary">Applicants List</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="under review">Under Review</SelectItem>
                  <SelectItem value="interviewed">Interviewed</SelectItem>
                  <SelectItem value="offered">Offered</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredApplicants.map((applicant) => (
                <Card key={applicant.id}>
                  <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between p-4">
                    <div className="flex items-center mb-4 md:mb-0">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${applicant.name}`} alt={applicant.name} />
                        <AvatarFallback>{applicant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{applicant.name}</h3>
                        <p className="text-sm text-gray-500">{applicant.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                      <Badge variant={applicant.status === "Rejected" ? "destructive" : "secondary"}>
                        {applicant.status}
                      </Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">View Details</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Applicant Details</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Name</Label>
                              <span className="col-span-3">{applicant.name}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right"><MailIcon className="h-4 w-4" /></Label>
                              <span className="col-span-3">{applicant.email}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right"><PhoneIcon className="h-4 w-4" /></Label>
                              <span className="col-span-3">{applicant.phone}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right"><MapPinIcon className="h-4 w-4" /></Label>
                              <span className="col-span-3">{applicant.location}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right"><LinkedinIcon className="h-4 w-4" /></Label>
                              <a href={applicant.linkedin} target="_blank" rel="noopener noreferrer" className="col-span-3 text-primary hover:underline">
                                LinkedIn Profile
                              </a>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right"><CalendarIcon className="h-4 w-4" /></Label>
                              <span className="col-span-3">Applied on {applicant.appliedDate}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right"><BrainIcon className="h-4 w-4" /></Label>
                              <div className="col-span-3">
                                <div className="flex items-center space-x-2">
                                  <span>AI Score:</span>
                                  <Progress value={applicant.aiScore} className="w-[60%]" />
                                  <span>{applicant.aiScore}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                              <Label className="text-right">Resume Summary</Label>
                              <p className="col-span-3 text-sm">{applicant.resumeSummary}</p>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right"><FileIcon className="h-4 w-4" /></Label>
                              <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer" className="col-span-3 text-primary hover:underline flex items-center">
                                <FileTextIcon className="h-4 w-4 mr-2" />
                                View Full Resume
                              </a>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Select onValueChange={(value) => handleStatusChange(applicant.id, value)}>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Update Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="under review">Under Review</SelectItem>
                                <SelectItem value="interviewed">Interviewed</SelectItem>
                                <SelectItem value="offered">Offered</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredApplicants.length === 0 && (
              <p className="text-center text-gray-500 mt-4">No applicants found.</p>
            )}
          </CardContent>
        </Card>
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