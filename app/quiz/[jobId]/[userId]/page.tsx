'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { QuizComponent } from '@/components/QuizComponent'

interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
}

interface QuizData {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    jobId: string;
    difficulty: string;
    createdAt: string;
}

export default function QuizPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [quizData, setQuizData] = useState<QuizData | null>(null)

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/quizzes/job/${params.jobId}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch quiz data')
                }
                const data = await response.json()
                setQuizData(data[0])
            } catch (error) {
                console.error('Error fetching quiz:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchQuizData()
    }, [params.jobId])

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Chargement du quiz...</div>
    }

    if (!quizData) {
        return <div className="flex justify-center items-center min-h-screen">Quiz non trouvé</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">{quizData.title}</h1>
            <p className="mb-6 text-gray-600">{quizData.description}</p>
            <QuizComponent 
                questions={quizData.questions}
                jobId={params.jobId as string}
                userId={params.userId as string}
            />
        </div>
    )
} 