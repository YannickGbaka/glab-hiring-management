'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { JobApplicationForm } from '@/components/JobApplicationForm'
import { BriefcaseIcon, MapPinIcon, DollarSignIcon, ClockIcon } from "lucide-react"
import axios from 'axios'

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  description: string;
  requirements?: string;
}

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
  userId: string;
}

export default function JobDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [job, setJob] = useState<Job | null>(null);
    const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:3001/api/jobs/${params.id}`);
                setJob(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching job:', err);
                setError('Failed to load job details');
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchJob();
        }
    }, [params.id]);

    const handleApply = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Application submitted');
        setIsApplyDialogOpen(false);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error || !job) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error || 'Job not found'}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <nav className="flex justify-between items-center">
                        <Link href="/jobs" className="text-primary hover:underline">
                            ← Back to Job Listings
                        </Link>
                        <h1 className="text-3xl font-bold text-primary">{job.title}</h1>
                        <div className="w-24" /> {/* Spacer */}
                    </nav>
                </div>
            </header>

            <motion.main
                className="flex-grow container mx-auto px-4 py-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
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
                                        <span>{job.jobType}</span>
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
                                {job.requirements && (
                                    <>
                                        <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                                        <p className="mb-4">{job.requirements}</p>
                                    </>
                                )}
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
                                        <JobApplicationForm 
                                            jobId={job.id} 
                                            jobTitle={job.title}
                                            userId="placeholder-user-id" // À remplacer par l'ID réel de l'utilisateur connecté
                                        />
                                    </DialogContent>
                                </Dialog>
                                <Button 
                                    variant="outline" 
                                    className="w-full" 
                                    onClick={() => router.push('/jobs')}
                                >
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
    );
}
