'use client'

interface JobDetailsPageProps {
  params: {
    id: string
  }
}

export default function JobDetailsPage({ params }: JobDetailsPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Détails de l'offre {params.id}</h1>
      {/* Ajoutez ici le contenu des détails de l'offre */}
    </div>
  )
}
