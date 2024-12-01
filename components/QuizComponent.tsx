'use client'

import { useState, useEffect } from 'react'
import { Button } from "./ui/button"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { Progress } from "./ui/progress"

interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
}

interface QuizComponentProps {
    questions: Question[];
    jobId: string;
    userId: string;
}

export function QuizComponent({ questions, jobId, userId }: QuizComponentProps) {
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [submitted, setSubmitted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1); // -1 signifie que le quiz n'a pas commencé
    const [timeLeft, setTimeLeft] = useState<number>(30);
    const [quizStarted, setQuizStarted] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        
        if (quizStarted && currentQuestionIndex >= 0 && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleNextQuestion();
                        return 30;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [quizStarted, currentQuestionIndex, timeLeft]);

    const startQuiz = () => {
        setQuizStarted(true);
        setCurrentQuestionIndex(0);
        setTimeLeft(30);
    };

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setTimeLeft(30);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/quizzes/job/${jobId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobId,
                    userId,
                    answers: Object.entries(answers).map(([questionId, answer]) => ({
                        questionId,
                        selectedAnswer: answer
                    })),
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

    if (!quizStarted) {
        return (
            <div className="text-center py-8">
                <h2 className="text-xl font-bold mb-4">Êtes-vous prêt à commencer le quiz ?</h2>
                <p className="mb-4">Vous aurez 30 secondes pour répondre à chaque question.</p>
                <Button onClick={startQuiz} className="px-8 py-4">
                    Commencer le Quiz
                </Button>
            </div>
        );
    }

    if (currentQuestionIndex === -1 || currentQuestionIndex >= questions.length) {
        return null;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-4">
                <span className="font-bold">
                    Question {currentQuestionIndex + 1}/{questions.length}
                </span>
                <span className="text-red-600 font-bold">
                    Temps restant: {timeLeft}s
                </span>
            </div>

            <Progress value={(timeLeft / 30) * 100} className="w-full h-2" />

            <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
                <RadioGroup
                    value={answers[currentQuestion.id]}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                >
                    {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-4">
                            <RadioGroupItem 
                                value={index.toString()} 
                                id={`q${currentQuestion.id}-${index}`} 
                            />
                            <Label htmlFor={`q${currentQuestion.id}-${index}`}>{option}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            <Button 
                onClick={handleNextQuestion}
                className="w-full"
            >
                {currentQuestionIndex === questions.length - 1 ? 'Terminer' : 'Question suivante'}
            </Button>
        </div>
    );
} 