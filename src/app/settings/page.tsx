import prisma from "@/lib/db";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const user = await prisma.user.findFirst();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">No user found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and preferences.
        </p>
      </div>
      <SettingsForm user={user} />
    </div>
  );
}
