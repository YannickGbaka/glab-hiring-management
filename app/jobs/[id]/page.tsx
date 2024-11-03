import JobDetailsPage from '@/components/app-jobs-id-page';

export default function Page({ params }: { params: { id: string } }) {
    return <JobDetailsPage params={params} />;
}
