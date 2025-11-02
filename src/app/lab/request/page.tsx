import { auth } from "~/server/auth";
import { AppLayout } from "~/components/app-layout";
import { RequestLabClient } from "./request-lab-client";

export default async function RequestLabPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <AppLayout
      user={session.user}
      breadcrumbs={[
        { label: "Lab Management", href: "/labs" },
        { label: "Request Lab" },
      ]}
    >
      <RequestLabClient />
    </AppLayout>
  );
}
