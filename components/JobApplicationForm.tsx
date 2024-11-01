import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneIcon, MapPinIcon, LinkedinIcon } from "lucide-react";
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'; // {{ edit_1 }}

interface JobApplicationFormProps {
    jobTitle: string;
    onSubmit: (event: React.FormEvent) => void;
}

export function JobApplicationForm({ jobTitle, onSubmit }: JobApplicationFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <DialogHeader>
                <DialogTitle>Apply for {jobTitle}</DialogTitle>
            </DialogHeader>
            <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" required />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required />
            </div>
            <div>
                <Label htmlFor="phone">Phone</Label>
                <div className="flex">
                    <div className="mr-2">
                        <Select>
                            <SelectTrigger id="phone-prefix">
                                <SelectValue placeholder="+1" />
                            </SelectTrigger>
                        </Select>
                        <Select>
                            <SelectContent>
                                <SelectItem value="+225">+225</SelectItem>
                                <SelectItem value="+44">+44</SelectItem>
                                <SelectItem value="+91">+91</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>
                    <div className="relative flex-grow">
                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input id="phone" type="tel" className="pl-10" />
                    </div>
                </div>
            </div>
            <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input id="location" className="pl-10" placeholder="Enter your location" />
                </div>
            </div>
            <div>
                <Label htmlFor="linkedin">LinkedIn URL (optional)</Label>
                <div className="relative">
                    <LinkedinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input id="linkedin" className="pl-10" placeholder="https://www.linkedin.com/in/yourprofile" />
                </div>
            </div>
            <div>
                <Label htmlFor="resume">Resume</Label>
                <Input id="resume" type="file" required />
            </div>
            <div>
                <Label htmlFor="cover-letter">Cover Letter</Label>
                <Textarea id="cover-letter" rows={4} />
            </div>
            <Button type="submit" className="w-full">Submit Application</Button>
        </form>
    );
}
