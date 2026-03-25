import LoginForm from "./LoginForm";

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string; registered?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <LoginForm
      callbackUrl={resolvedSearchParams.callbackUrl}
      registered={resolvedSearchParams.registered}
    />
  );
}
