import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { auth } from "@/auth";
import { Label } from "@/components/ui/label";

export default async function MyAccount() {
  const session = await auth();

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-[350px] space-y-4 p-6 shadow-md ">
        <CardHeader>
          <CardTitle>My account</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Email address</Label>
          <div className="text-muted-foreground">{session?.user?.email}</div>
        </CardContent>
      </Card>
    </div>
  );
}
