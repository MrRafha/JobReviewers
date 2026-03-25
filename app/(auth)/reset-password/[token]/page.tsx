import ResetPasswordForm from "./ResetPasswordForm";

interface ResetPasswordPageProps {
  params: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const { token } = await params;

  return <ResetPasswordForm token={token} />;
}
