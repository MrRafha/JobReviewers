import ForgotPasswordForm from "./ForgotPasswordForm";

interface ForgotPasswordPageProps {
  searchParams: Promise<{ success?: string }>;
}

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <ForgotPasswordForm success={resolvedSearchParams.success === "true"} />
  );
}
