import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/features/auth/model/authOptions";
import SettingsShell from "./components/SettingsShell";

export default async function SettingsPage({ params }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/${locale}/auth`);
  }

  return <SettingsShell />;
}
