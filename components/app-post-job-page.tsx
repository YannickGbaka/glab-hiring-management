'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BriefcaseIcon, Loader2 } from "lucide-react"
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI("AIzaSyB2ho3rcsrs0ZWgElyNUkegB1fyY2yG5c0");

const generateJobContent = async (jobTitle) => {
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

export function PostJobPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    type: '',
    requirements: '',
  })
  const [errors, setErrors] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, type: value }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title) newErrors.title = 'Job title is required'
    if (!formData.description) newErrors.description = 'Job description is required'
    if (!formData.location) newErrors.location = 'Job location is required'
    if (!formData.type) newErrors.type = 'Job type is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      console.log('Job posted:', formData)
      alert('Job posted successfully!')
    }
  }

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
            <Label htmlFor="type">Job Type</Label>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
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
    </div>
  )
}