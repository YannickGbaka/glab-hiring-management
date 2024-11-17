'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface JobApplicationFormProps {
    jobId: string
}

export default function JobApplicationForm({ jobId }: JobApplicationFormProps) {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsSubmitting(true)

        try {
            const formData = new FormData(event.currentTarget)
            
            // Combiner firstName et lastName pour créer fullName
            const firstName = formData.get('firstName')
            const lastName = formData.get('lastName')
            formData.set('fullName', `${firstName} ${lastName}`)
            
            // Ajouter jobId au formData
            formData.set('jobId', jobId)
            
            // Supprimer les champs individuels firstName et lastName
            formData.delete('firstName')
            formData.delete('lastName')

            // Log pour débugger
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`)
            }

            const response = await fetch('http://localhost:3001/api/applications', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to submit application')
            }

            toast({
                title: "Candidature envoyée",
                description: "Nous avons bien reçu votre candidature.",
            })

            event.currentTarget.reset()

        } catch (error) {
            console.error('Error submitting application:', error)
            toast({
                title: "Erreur",
                description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi de votre candidature.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                        Prénom *
                    </label>
                    <Input
                        id="firstName"
                        name="firstName"
                        required
                        placeholder="John"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                        Nom *
                    </label>
                    <Input
                        id="lastName"
                        name="lastName"
                        required
                        placeholder="Doe"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email *
                </label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                />
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Téléphone
                </label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                />
            </div>

            <div>
                <label htmlFor="cvFile" className="block text-sm font-medium mb-1">
                    CV (PDF) *
                </label>
                <Input
                    id="cvFile"
                    name="cvFile"
                    type="file"
                    required
                    accept=".pdf"
                />
            </div>

            <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium mb-1">
                    Lettre de motivation
                </label>
                <Textarea
                    id="coverLetter"
                    name="coverLetter"
                    placeholder="Présentez-vous et expliquez votre motivation..."
                    rows={5}
                />
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma candidature'}
            </Button>
        </form>
    )
}
