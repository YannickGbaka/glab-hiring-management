import JobDetailsPage from '@/components/app-jobs-id-page';
import JobApplicationForm from '@/components/JobApplicationForm'

export default function JobPage({ params }: { params: { id: string } }) {
    return (
        <div>
            <JobDetailsPage params={params} />
            
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Postuler à cette offre</h2>
                <JobApplicationForm jobId={params.id} />
            </div>
        </div>
    );
}
