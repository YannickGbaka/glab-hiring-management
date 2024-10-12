import { Page } from "@/components/app-jobs-id-page"

export default function JobIdPage({ params }: { params: { id: string } }) {
  return <Page params={params} />
}
