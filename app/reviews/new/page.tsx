import NewReviewClient from "./NewReviewClient";

interface NewReviewPageProps {
  searchParams: Promise<{ companyId?: string; companyName?: string }>;
}

export default async function NewReviewPage({ searchParams }: NewReviewPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <NewReviewClient
      initialCompanyId={resolvedSearchParams.companyId}
      initialCompanyName={resolvedSearchParams.companyName}
    />
  );
}
