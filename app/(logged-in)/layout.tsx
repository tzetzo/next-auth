import LogoutButton from "@/components/LogoutButton";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoggedInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;
  const isLoggedIn = !!user;

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <nav className="bg-gray-200 dark:bg-black">
        <div className="container mx-auto px-4 py-8 flex items-center justify-between">
          <div className="space-x-4">
            <Link
              href="/my-account"
              className="text-black hover:text-gray-600 font-bold"
            >
              My Account
            </Link>
            <Link
              href="/change-password"
              className="text-black hover:text-gray-600 font-bold"
            >
              Change Password
            </Link>
          </div>
          {isLoggedIn && <LogoutButton />}
        </div>
      </nav>
      {children}
    </div>
  );
}
