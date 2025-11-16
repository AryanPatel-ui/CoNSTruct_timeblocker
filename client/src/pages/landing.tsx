import { Calendar, Clock, Sparkles, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const features = [
    {
      icon: Clock,
      title: "Time Blocking",
      description: "Organize your day with visual time blocks for maximum productivity",
    },
    {
      icon: ListChecks,
      title: "Task Management",
      description: "Manage weekly to-dos with drag-and-drop simplicity",
    },
    {
      icon: Sparkles,
      title: "AI Assistant",
      description: "Get intelligent scheduling suggestions powered by AI",
    },
    {
      icon: Calendar,
      title: "Smart Calendar",
      description: "Visualize your time and optimize your schedule efficiently",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Smart Calendar</h1>
              <p className="text-xs text-muted-foreground">Time Blocking for Productivity</p>
            </div>
          </div>
          <Button asChild data-testid="button-login">
            <a href="/api/login">Log In</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-5xl font-bold text-foreground mb-6">
              Master Your Time with
              <br />
              <span className="text-primary">Smart Time Blocking</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your productivity with AI-powered time blocking. 
              Organize tasks, schedule efficiently, and achieve more every day.
            </p>
            <Button size="lg" asChild data-testid="button-get-started">
              <a href="/api/login">
                Get Started Free
              </a>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-foreground mb-12">
              Everything You Need to Stay Productive
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground mb-4">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-semibold text-card-foreground mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Ready to Boost Your Productivity?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of users who have transformed their workflow with smart time blocking.
            </p>
            <Button size="lg" asChild data-testid="button-start-now">
              <a href="/api/login">
                Start Organizing Now
              </a>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Smart Calendar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
