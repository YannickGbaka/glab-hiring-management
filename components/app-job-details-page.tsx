'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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

interface CallHistory {
  transcript_object: Array<{
    role: string;
    content: string;
  }>;
  call_analysis: {
    custom_analysis_data: {
      detailed_call_summary: string;
    };
  };
  recording_url: string;
}

// Composant Modal pour l'historique
const CallHistoryModal = ({ callHistory }: { callHistory: CallHistory | null }) => {
  const handleDownloadAudio = () => {
    if (callHistory?.recording_url) {
      window.open(callHistory.recording_url, '_blank');
    }
  };

  if (!callHistory) {
    return (
      <DialogContent className="sm:max-w-[425px] h-[300px]">
        <DialogHeader>
          <DialogTitle>Historique des appels</DialogTitle>
        </DialogHeader>
        <div className="text-center py-8">
          Aucun historique d'appel disponible pour ce candidat
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[725px] max-h-[550px]">
      <DialogHeader className="sticky top-0 bg-white z-10 pb-4 flex justify-between items-center">
        <DialogTitle>Historique des appels</DialogTitle>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleDownloadAudio}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <span>🎵</span>
            Audio
          </Button>
        </div>
      </DialogHeader>
      
      <div className="overflow-y-auto pr-2" style={{ maxHeight: "400px" }}>
        <div className="space-y-4">
          {/* Transcription */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 sticky top-0 bg-gray-50">Transcription</h3>
            {callHistory.transcript_object.map((item, index) => (
              <div key={index} className={`p-2 mb-2 rounded ${
                item.role === 'agent' ? 'bg-blue-50' : 'bg-gray-100'
              }`}>
                <span className="font-medium">
                  {item.role === 'agent' ? '🧑‍💼 Agent' : '👤 Candidat'}:
                </span> {item.content}
              </div>
            ))}
          </div>
          
          {/* Résumé détaillé */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Résumé de l'appel</h3>
            <p>{callHistory.call_analysis.custom_analysis_data.detailed_call_summary}</p>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  console.log('Job ID from params:', params.id)
  const [job, setJob] = useState<Job | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [callHistory, setCallHistory] = useState<CallHistory | null>({
    transcript_object: [
      {
        role: "agent",
        content: "Hello, this is [Your Name], the HR assistant at [Company Name]. I'm calling to schedule your job interview. How are you today?"
      },
      {
        role: "user",
        content: "That could"
      },
      {
        role: "agent",
        content: "Could you share your availability over the next two weeks, including your preferred days and times? This will help us find a suitable slot for your interview."
      },
      {
        role: "agent",
        content: "It seems like you might be busy at the moment. Feel free to let me know your availability when you have a chance. You can also reach out to us via email or phone. Have a great day!"
      },
      {
        role: "user",
        content: "C"
      },
      {
        role: "agent",
        content: "It seems like now might not be the best time to continue. Feel free to reach out when you're ready to discuss your interview schedule."
      }
    ],
    call_analysis: {
      custom_analysis_data: {
        detailed_call_summary: "The call was initiated by the HR assistant to schedule a job interview. The user did not provide clear availability and seemed preoccupied, leading the agent to suggest that the user could reach out later or via email. The call ended without successfully scheduling the interview."
      }
    },
    recording_url: "https://dxc03zgurdly9.cloudfront.net/call_769b667126acbab4d80de388a72/recording.wav"
  });

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

  const handleCallClick = (userId: string) => {
    router.push(`/appel?userId=${userId}`)
  }

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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCallClick(application.userId)}
                  >
                    Call
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Historique appel
                      </Button>
                    </DialogTrigger>
                    <CallHistoryModal callHistory={callHistory} />
                  </Dialog>
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