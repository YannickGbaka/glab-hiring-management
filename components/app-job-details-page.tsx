'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Job {
  id: string;
  title: string;
  description: string;
  salary: string;
  location: string;
  requirements: string;
  jobType: string;
}

interface Application {
  _id: string;
  userId: string;
  jobId: string;
  resumeFile: string | null;
  coverLetter: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function JobDetailsPage() {
  const params = useParams()
  console.log('Job ID from params:', params.id)
  const [job, setJob] = useState<Job | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const [jobResponse, applicationsResponse] = await Promise.all([
          fetch(`http://localhost:3001/api/jobs/${params.id}`),
          fetch('http://localhost:3001/api/applications')
        ])

        const jobData = await jobResponse.json()
        const applicationsData = await applicationsResponse.json()

        console.log('Current job ID:', params.id )
        console.log('Available applications:', applicationsData.map(app => ({
          jobId: app.jobId,
          matches: app.jobId === params.id
        })))

        setJob(jobData)
        
        const filteredApplications = applicationsData.filter((app) =>{
            console.log('Comparing:', app.jobId, params.id)
            return app.jobId == params.id
        })
        setApplications(filteredApplications)
        
        // Afficher le nombre de candidatures trouvées
        console.log(`Found ${filteredApplications.length} applications for job ${params.id}`)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobDetails()
  }, [params.id])

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>
  }

  if (!job) {
    return <div className="text-center py-4">Job not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{job.location}</p>
            </div>
            <div>
              <h3 className="font-semibold">Job Type</h3>
              <p>{job.jobType}</p>
            </div>
            <div>
              <h3 className="font-semibold">Salary</h3>
              <p>{job.salary}</p>
            </div>
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="whitespace-pre-wrap">{job.description}</p>
            </div>
            <div>
              <h3 className="font-semibold">Requirements</h3>
              <p className="whitespace-pre-wrap">{job.requirements}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Applications</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Application ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application._id}>
              <TableCell>{application._id}</TableCell>
              <TableCell>{application.userId}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {application.status}
                </span>
              </TableCell>
              <TableCell>{new Date(application.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    Download Resume
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {applications.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No applications yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
} 