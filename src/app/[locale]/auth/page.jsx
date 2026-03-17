import { sanitizeRedirectPath } from "@/shared/lib";
import AuthFormLayout from "@/features/auth/ui/AuthFormLayout";

export default async function LoginPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const redirectTo = sanitizeRedirectPath(resolvedSearchParams?.redirectTo);

  return (
    <div className="min-h-screen w-full px-4 py-4 sm:px-6 lg:px-10">
      <AuthFormLayout redirectTo={redirectTo} />
    </div>
  );
}
