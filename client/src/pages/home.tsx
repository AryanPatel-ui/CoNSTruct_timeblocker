import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock, Inbox, TrendingUp } from "lucide-react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import type { Task, TimeBlock, InboxItem } from "@shared/schema";

export default function Home() {
  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: timeBlocks, isLoading: blocksLoading } = useQuery<TimeBlock[]>({
    queryKey: ["/api/time-blocks"],
  });

  const { data: inboxItems, isLoading: inboxLoading } = useQuery<InboxItem[]>({
    queryKey: ["/api/inbox"],
  });

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  const stats = [
    {
      title: "Tasks This Week",
      value: tasksLoading ? "..." : tasks?.filter(t => t.status !== "completed").length || 0,
      icon: CheckCircle2,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
      testId: "stat-tasks-week",
    },
    {
      title: "Time Blocks Today",
      value: blocksLoading ? "..." : timeBlocks?.filter(b => {
        const blockDate = new Date(b.startTime);
        return format(blockDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
      }).length || 0,
      icon: Calendar,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      testId: "stat-blocks-today",
    },
    {
      title: "Inbox Items",
      value: inboxLoading ? "..." : inboxItems?.filter(i => !i.isProcessed).length || 0,
      icon: Inbox,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      testId: "stat-inbox",
    },
    {
      title: "Completion Rate",
      value: tasksLoading ? "..." : tasks && tasks.length > 0
        ? `${Math.round((tasks.filter(t => t.status === "completed").length / tasks.length) * 100)}%`
        : "0%",
      icon: TrendingUp,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      testId: "stat-completion",
    },
  ];

  const upcomingTasks = tasks?.filter(t => t.status !== "completed").slice(0, 5) || [];
  const todayBlocks = timeBlocks?.filter(b => {
    const blockDate = new Date(b.startTime);
    return format(blockDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground" data-testid="text-welcome">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                {stat.title}
              </CardTitle>
              <div className={`flex h-8 w-8 items-center justify-center rounded-md ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground" data-testid={stat.testId}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today's Schedule
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/calendar">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {blocksLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : todayBlocks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No time blocks scheduled for today</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/calendar">Schedule your day</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {todayBlocks.slice(0, 5).map((block) => (
                  <div
                    key={block.id}
                    className="flex items-start gap-3 p-3 rounded-md hover-elevate"
                    style={{ borderLeft: `4px solid ${block.color}` }}
                    data-testid={`block-${block.id}`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-card-foreground">{block.title}</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {format(new Date(block.startTime), 'h:mm a')} - {format(new Date(block.endTime), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Upcoming Tasks
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/todo">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : upcomingTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No pending tasks</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/todo">Add a task</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-md hover-elevate"
                    data-testid={`task-${task.id}`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-card-foreground">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          task.priority === "high" ? "bg-destructive/10 text-destructive" :
                          task.priority === "medium" ? "bg-accent/10 text-accent-foreground" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {task.priority}
                        </span>
                        {task.estimatedMinutes && (
                          <span className="text-xs text-muted-foreground">
                            {task.estimatedMinutes}min
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2" data-testid="button-add-task">
              <Link href="/todo">
                <CheckCircle2 className="h-5 w-5" />
                <span>Add Task</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2" data-testid="button-schedule-block">
              <Link href="/calendar">
                <Calendar className="h-5 w-5" />
                <span>Schedule Block</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2" data-testid="button-capture-idea">
              <Link href="/inbox">
                <Inbox className="h-5 w-5" />
                <span>Capture Idea</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2" data-testid="button-ai-optimize">
              <Link href="/ai">
                <TrendingUp className="h-5 w-5" />
                <span>AI Optimize</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
