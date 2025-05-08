import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { auth } from "@/auth";
import { Label } from "@/components/ui/label";
import TwoFactorAuthForm from "@/components/TwoFactorAuthForm";
import { users } from "@/db/userSchema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";

export default async function MyAccount() {
  const session = await auth();

  const [user] = await db
    .select({ twoFactorActivated: users.twoFactorActivated })
    .from(users)
    .where(eq(users.email, session?.user?.email || ""))
    .limit(1);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-[350px] space-y-4 p-6 shadow-md ">
        <CardHeader>
          <CardTitle>My account</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Email address</Label>
          <div className="text-muted-foreground">{session?.user?.email}</div>
          <TwoFactorAuthForm twoFactorActivated={user.twoFactorActivated} />
        </CardContent>
      </Card>
    </div>
  );
}
