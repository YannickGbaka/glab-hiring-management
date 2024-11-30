'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { QuizDisplay } from './QuizDisplay';

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
    id: string;
    userId: string;
    jobId: string;
    transcript: number;
    callDuration: Array<{
        role: string;
        content: string;
        words?: Array<{
            word: string;
            start: number;
            end: number;
        }>;
        metadata?: {
            response_id: number;
        };
    }>;
    createdAt: string;
}

// Composant Modal pour l'historique
const CallHistoryModal = ({ callHistory }: { callHistory: CallHistory | null }) => {
    if (!callHistory || !callHistory.callDuration) {
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
            <DialogHeader className="sticky top-0 bg-white z-10 pb-4">
                <DialogTitle>Historique des appels</DialogTitle>
            </DialogHeader>

            <div className="overflow-y-auto pr-2" style={{ maxHeight: "400px" }}>
                <div className="space-y-4">
                    {/* Transcription */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2 sticky top-0 bg-gray-50">Transcription</h3>
                        {Array.isArray(callHistory.callDuration) && callHistory.callDuration.map((item, index) => (
                            <div key={index} className={`p-2 mb-2 rounded ${item.role === 'agent' ? 'bg-blue-50' : 'bg-gray-100'}`}>
                                <span className="font-medium">
                                    {item.role === 'agent' ? '🧑‍💼 Agent' : '👤 Candidat'}:
                                </span> {item.content}
                            </div>
                        ))}
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
    const [callHistory, setCallHistory] = useState<CallHistory | null>(null);
    const [isQuizOpen, setIsQuizOpen] = useState(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const [jobResponse, applicationsResponse] = await Promise.all([
                    fetch(`http://localhost:3001/api/jobs/${params.id}`),
                    fetch('http://localhost:3001/api/applications')
                ])

                const jobData = await jobResponse.json()
                const applicationsData = await applicationsResponse.json()

                console.log('Current job ID:', params.id)
                console.log('Available applications:', applicationsData.map((app: Application) => ({
                    jobId: app.jobId,
                    matches: app.jobId === params.id
                })))

                setJob(jobData)

                const filteredApplications = applicationsData.filter((app: Application) => {
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
        router.push(`/appel?userId=${userId}&jobId=${params.id}&nextStep=entretien`)
    }

    const fetchCallHistory = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/api/phone-interviews/${phoneId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Call history data:', data);
            setCallHistory(data);
        } catch (error) {
            console.error('Error fetching call history:', error);
            setCallHistory(null);
        }
    };

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
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
                        <Button
                            variant="outline"
                            onClick={() => setIsQuizOpen(true)}
                            className="ml-4"
                        >
                            Afficher Quiz
                        </Button>
                    </div>
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
                                <span className={`px-2 py-1 rounded-full text-sm ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
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
                                        CV
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
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => fetchCallHistory(application.userId)}
                                            >
                                                Historique appel
                                            </Button>
                                        </DialogTrigger>
                                        <CallHistoryModal callHistory={callHistory} />
                                    </Dialog>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            // Copier le lien dans le presse-papier
                                            const quizLink = `${window.location.origin}/quiz/${params.id}/${application.userId}`;
                                            navigator.clipboard.writeText(quizLink);
                                            // Vous pourriez ajouter une notification pour informer l'utilisateur que le lien a été copié
                                            alert('Lien du quiz copié dans le presse-papier !');
                                        }}
                                    >
                                        Générer lien quiz
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

            <QuizDisplay 
                jobId={params.id as string}
                isOpen={isQuizOpen}
                onClose={() => setIsQuizOpen(false)}
            />
        </div>
    )
} 