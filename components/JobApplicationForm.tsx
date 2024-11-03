import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneIcon, MapPinIcon, LinkedinIcon } from "lucide-react";
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from "@/components/ui/use-toast";

interface JobApplicationFormProps {
    jobTitle: string;
    jobId: string;
    userId: string;
    onSuccess?: () => void;
}

export function JobApplicationForm({ jobTitle, jobId, userId, onSuccess }: JobApplicationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        phonePrefix: '+225',
        location: '',
        linkedin: '',
        coverLetter: ''
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const { toast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handlePhonePrefixChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            phonePrefix: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resumeFile) {
            toast({
                title: "Error",
                description: "Please upload your resume",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('userId', userId);
            formDataToSend.append('jobId', jobId);
            formDataToSend.append('coverLetter', formData.coverLetter);
            formDataToSend.append('resumeFile', resumeFile);
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', `${formData.phonePrefix}${formData.phone}`);
            formDataToSend.append('location', formData.location);
            formDataToSend.append('linkedin', formData.linkedin);

            const response = await fetch(' ', {
                method: 'POST',
                body: formDataToSend,
                credentials: 'include'
            }); 

            if (!response.ok) {
                throw new Error('Failed to submit application');
            }

            toast({
                title: "Success",
                description: "Your application has been submitted successfully",
            });

            onSuccess?.();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit your application. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
                <DialogTitle>Apply for {jobTitle}</DialogTitle>
            </DialogHeader>
            <div>
                <Label htmlFor="name">Full Name</Label>
                <Input 
                    id="name" 
                    required 
                    value={formData.name}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <Label htmlFor="phone">Phone</Label>
                <div className="flex">
                    <div className="mr-2">
                        <Select onValueChange={handlePhonePrefixChange} value={formData.phonePrefix}>
                            <SelectTrigger id="phone-prefix">
                                <SelectValue placeholder="+225" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="+225">+225</SelectItem>
                                <SelectItem value="+44">+44</SelectItem>
                                <SelectItem value="+91">+91</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="relative flex-grow">
                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input 
                            id="phone" 
                            type="tel" 
                            className="pl-10"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
            </div>
            <div>
                <Label htmlFor="location">Localisation</Label>
                <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input 
                        id="location" 
                        className="pl-10" 
                        placeholder="Enter your location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </div>
            <div>
                <Label htmlFor="linkedin">LinkedIn URL (optionnel)</Label>
                <div className="relative">
                    <LinkedinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input id="linkedin" className="pl-10" placeholder="https://www.linkedin.com/in/yourprofile" />
                </div>
            </div>
            <div>
                <Label htmlFor="resume">CV</Label>
                <Input 
                    id="resume" 
                    type="file" 
                    required 
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                />
            </div>
            <div>
                <Label htmlFor="cover-letter">Lettre de motivation</Label>
                <Textarea 
                    id="coverLetter" 
                    rows={4} 
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                />
            </div>
            <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
        </form>
    );
}
