'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { QuizComponent } from '../../../../components/QuizComponent'

export default function QuizPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [quizData, setQuizData] = useState(null)

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/jobs/${params.jobId}/quiz`)
                if (!response.ok) {
                    throw new Error('Failed to fetch quiz data')
                }
                const data = await response.json()
                setQuizData(data)
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
            <h1 className="text-2xl font-bold mb-6">Quiz d'évaluation</h1>
            <QuizComponent 
                questions={quizData.questions}
                jobId={params.jobId as string}
                userId={params.userId as string}
            />
        </div>
    )
} 