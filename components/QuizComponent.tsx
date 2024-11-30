'use client'

import { useState } from 'react'
import { Button } from "./ui/button"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer?: string;
}

interface QuizComponentProps {
    questions: Question[];
    jobId: string;
    userId: string;
}

export function QuizComponent({ questions, jobId, userId }: QuizComponentProps) {
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [submitted, setSubmitted] = useState(false);

    const handleAnswerChange = (questionId: number, answer: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/quizzes/job/${jobId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobId,
                    userId,
                    answers,
                    submittedAt: new Date().toISOString()
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit quiz');
            }

            setSubmitted(true);
            alert('Quiz soumis avec succès !');
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Erreur lors de la soumission du quiz. Veuillez réessayer.');
        }
    };

    if (submitted) {
        return (
            <div className="text-center py-8">
                <h2 className="text-xl font-bold mb-4">Merci d'avoir complété le quiz !</h2>
                <p>Vos réponses ont été enregistrées.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {questions.map((question) => (
                <div key={question.id} className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
                    <RadioGroup
                        value={answers[question.id]}
                        onValueChange={(value) => handleAnswerChange(question.id, value)}
                    >
                        {question.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`q${question.id}-${index}`} />
                                <Label htmlFor={`q${question.id}-${index}`}>{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            ))}

            <Button 
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== questions.length}
                className="w-full"
            >
                Soumettre le quiz
            </Button>
        </div>
    );
} 