'use client'

import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BriefcaseIcon, Loader2 } from "lucide-react"
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
// Importez les composants Dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const genAI = new GoogleGenerativeAI("AIzaSyB2ho3rcsrs0ZWgElyNUkegB1fyY2yG5c0");

const generateJobContent = async (jobTitle: string) => {
  const prompt = `Generate a job description, requirements, and salary range for the position of ${jobTitle}. Format the response as JSON with keys "description", "requirements", and "salary".`

  
  try {
    // Use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    const jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON content');
    }

    const jsonContent = JSON.parse(jsonMatch[1]);

    return {
      description: jsonContent.description || "Failed to generate description",
      requirements: Array.isArray(jsonContent.requirements) 
        ? jsonContent.requirements.join('\n') 
        : jsonContent.requirements || "Failed to generate requirements",
      salary: jsonContent.salary 
        ? `${jsonContent.salary.currency} ${jsonContent.salary.min} - ${jsonContent.salary.max} per year`
        : "Competitive salary based on experience",
    };
  } catch (error) {
    console.error('Error generating job content:', error);
    return {
      description: "An error occurred while generating the job description.",
      requirements: "An error occurred while generating the job requirements.",
      salary: "Competitive salary based on experience",
    };
  }
}

// Définissez une interface pour formData
interface FormData {
  title: string;
  description: string;
  location: string;
  salary: string;
  jobType: string;
  requirements: string;
}

// Définissez une interface pour les erreurs
interface FormErrors {
  title?: string;
  description?: string;
  location?: string;
  jobType?: string;
}

export function PostJobPage() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    location: '',
    salary: '',
    jobType: '',
    requirements: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, jobType: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title) newErrors.title = 'Job title is required';
    if (!formData.description) newErrors.description = 'Job description is required';
    if (!formData.location) newErrors.location = 'Job location is required';
    if (!formData.jobType) newErrors.jobType = 'Job type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsGenerating(true);
        
        const jobData = {
          ...formData,
          jobType: formData.jobType.toLowerCase(),
          company: "Not Specified",
          salary: formData.salary || "Competitive salary",
        };

        console.log('Sending data to server:', jobData);
        const response = await axios.post('http://localhost:3001/api/jobs', jobData);
        console.log('Job posted:', response.data);

        // Générer le quiz après la création de l'offre
        try {
          const quizResponse = await axios.post('http://localhost:3001/api/quizzes/generate', {
            jobId: response.data.id, // Utilise l'ID du job créé
            difficulty: "medium"
          });
          console.log('Quiz generated:', quizResponse.data);
        } catch (quizError) {
          console.error('Error generating quiz:', quizError);
        }

        setIsModalOpen(true);
        
        setFormData({
          title: '',
          description: '',
          location: '',
          salary: '',
          jobType: '',
          requirements: '',
        });
        setErrors({});
      } catch (error) {
        console.error('Error posting job:', error);
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
            alert(`Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
          } else if (error.request) {
            console.error('No response received:', error.request);
            alert('Error: No response received from the server. Please check your network connection.');
          } else {
            console.error('Error setting up the request:', error.message);
            alert(`Error: ${error.message}`);
          }
        } else {
          console.error('Non-Axios error:', error);
          alert('An unexpected error occurred. Please try again.');
        }
      } finally {
        setIsGenerating(false);
      }
    } else {
      console.log("Form validation failed. Errors:", errors);
    }
  };

  const handleGenerate = async () => {
    if (!formData.title) {
      setErrors(prev => ({ ...prev, title: 'Job title is required for generation' }))
      return
    }

    setIsGenerating(true)
    const generatedContent = await generateJobContent(formData.title)
    setIsGenerating(false)

    setFormData(prev => ({
      ...prev,
      description: generatedContent.description,
      requirements: generatedContent.requirements,
      salary: generatedContent.salary,
    }))
  }

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
        <h1 className="text-3xl font-bold text-center mb-8">Post a New Job</h1>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <div className="flex space-x-2">
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={errors.title ? 'border-red-500' : ''}
              />
              <Button type="button" onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Generate'}
              </Button>
            </div>
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={errors.description ? 'border-red-500' : ''}
              rows={6}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={errors.location ? 'border-red-500' : ''}
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="e.g. $50,000 - $70,000 per year"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobType">Job Type</Label>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className={errors.jobType ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            {errors.jobType && <p className="text-red-500 text-sm">{errors.jobType}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              rows={4}
              placeholder="List key qualifications or skills required for this position"
            />
          </div>

          <Button type="submit" className="w-full">Post Job</Button>
        </form>
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success!</DialogTitle>
            <DialogDescription>
              Your job has been posted successfully.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
