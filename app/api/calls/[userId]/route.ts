import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        // Logique pour récupérer l'historique des appels depuis votre base de données
        // Utiliser params.userId pour filtrer les résultats
        
        // Exemple de réponse
        return NextResponse.json({
            id: "call_123",
            userId: params.userId,
            jobId: "job_456",
            callDuration: [
                {
                    role: "agent",
                    content: "Bonjour, comment allez-vous ?"
                },
                {
                    role: "candidate",
                    content: "Très bien, merci."
                }
            ],
            createdAt: new Date().toISOString()
        })
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch call history" },
            { status: 500 }
        )
    }
} 