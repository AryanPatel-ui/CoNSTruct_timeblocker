import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, LogOut } from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const { user } = useAuth();

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || "U";
  };

  const profileInfo = [
    {
      icon: User,
      label: "Full Name",
      value: user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : "Not set",
      testId: "text-profile-name",
    },
    {
      icon: Mail,
      label: "Email",
      value: user?.email || "Not set",
      testId: "text-profile-email",
    },
    {
      icon: Calendar,
      label: "Member Since",
      value: user?.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : "Unknown",
      testId: "text-profile-joined",
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account information
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.profileImageUrl || ""} className="object-cover" />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-card-foreground">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email || "User"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="space-y-4 pt-4 border-t">
            {profileInfo.map((info, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                  <info.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {info.label}
                  </p>
                  <p className="text-base text-card-foreground mt-1" data-testid={info.testId}>
                    {info.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t flex gap-3">
            <Button variant="destructive" asChild data-testid="button-logout">
              <a href="/api/logout">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-card-foreground">-</div>
              <p className="text-sm text-muted-foreground mt-1">Total Tasks</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-card-foreground">-</div>
              <p className="text-sm text-muted-foreground mt-1">Time Blocks</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-card-foreground">-</div>
              <p className="text-sm text-muted-foreground mt-1">Hours Scheduled</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
