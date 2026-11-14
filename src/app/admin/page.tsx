import { isAdminAuthenticated } from "@/lib/auth";
import { readContent } from "@/lib/contentStore";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [authenticated, content] = await Promise.all([
    isAdminAuthenticated(),
    readContent(),
  ]);

  return (
    <AdminDashboard
      initialAuthenticated={authenticated}
      initialContent={content}
    />
  );
}

