import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { isArray } from 'util';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Quiz {
  title: string;
  description: string;
  questions: Question[];
  jobId: string;
  difficulty: string;
}

export function QuizDisplay({ jobId, isOpen, onClose }: { 
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/quizzes/job/${jobId}`);
        if (!response.ok) throw new Error('Failed to fetch quiz');
        const data = await response.json();
        if(Array.isArray(data) && data.length > 0){
        setQuiz(data[0]);
    }
        console.log('Quiz data:', data);
      } catch (err) {
        setError('Failed to load quiz');
        console.error('Error fetching quiz:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && jobId) {
      fetchQuiz();
    }
  }, [jobId, isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{quiz?.title || 'Technical Quiz'}</DialogTitle>
        </DialogHeader>
        
        {loading && <div className="text-center py-4">Loading quiz...</div>}
        {error && <div className="text-red-500 text-center py-4">{error}</div>}
        
        {quiz && (
          <div className="space-y-6">
            <p className="text-gray-600">{quiz.description}</p>
            
            {quiz.questions.map((question, index) => (
              <Card key={question.id} className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Question {index + 1}: {question.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup>
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={optIndex.toString()} id={`q${question.id}-opt${optIndex}`} />
                        <Label htmlFor={`q${question.id}-opt${optIndex}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 