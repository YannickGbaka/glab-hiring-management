import { EditJobComponent } from "@/components/app-edit-job-id-page";

export default function EditJobPage({ params }: { params: { id: string } }) {
  return <EditJobComponent params={params} />
}