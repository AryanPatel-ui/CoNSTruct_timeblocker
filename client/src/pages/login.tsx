import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { setDemoUser, isLoading, isAuthenticated } = useAuth() as any;

  useEffect(() => {
    if (isAuthenticated) setLocation('/');
  }, [isAuthenticated, setLocation]);

  const startDemo = () => {
    const demo = {
      id: "demo",
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
    };
    setDemoUser(demo);
    setLocation('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-2">Sign in</h2>
          <p className="text-sm text-muted-foreground mb-6">Use your Replit account or try the demo immediately.</p>

          <div className="flex flex-col gap-3">
            <Button asChild>
              <a href="/api/login">Sign in with Replit</a>
            </Button>

            <Button variant="outline" onClick={startDemo}>
              Continue as Demo
            </Button>

            <Button variant="ghost" asChild>
              <a href="/">Back</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
