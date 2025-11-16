import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Inbox as InboxIcon, Trash2, Check, Plus } from "lucide-react";
import { insertInboxItemSchema, type InboxItem, type InsertInboxItem } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { format } from "date-fns";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Inbox() {
  const { toast } = useToast();
  const [newItemContent, setNewItemContent] = useState("");

  const { data: inboxItems, isLoading } = useQuery<InboxItem[]>({
    queryKey: ["/api/inbox"],
  });

  const createInboxItem = useMutation({
    mutationFn: async (data: InsertInboxItem) => {
      await apiRequest("POST", "/api/inbox", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inbox"] });
      toast({
        title: "Item added",
        description: "Your idea has been captured.",
      });
      setNewItemContent("");
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const markProcessed = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("PATCH", `/api/inbox/${id}`, { isProcessed: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inbox"] });
      toast({
        title: "Item processed",
        description: "Item marked as processed.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteInboxItem = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/inbox/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inbox"] });
      toast({
        title: "Item deleted",
        description: "Inbox item has been removed.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleQuickCapture = () => {
    if (!newItemContent.trim()) return;
    
    createInboxItem.mutate({
      userId: "",
      content: newItemContent,
      isProcessed: false,
    });
  };

  const unprocessedItems = inboxItems?.filter(i => !i.isProcessed) || [];
  const processedItems = inboxItems?.filter(i => i.isProcessed) || [];

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inbox</h1>
        <p className="text-muted-foreground mt-1">
          Capture ideas and tasks quickly
        </p>
      </div>

      {/* Quick Capture */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Capture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="What's on your mind?"
              value={newItemContent}
              onChange={(e) => setNewItemContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleQuickCapture();
                }
              }}
              data-testid="input-quick-capture"
            />
            <Button
              onClick={handleQuickCapture}
              disabled={createInboxItem.isPending || !newItemContent.trim()}
              data-testid="button-capture"
            >
              <Plus className="h-4 w-4 mr-2" />
              Capture
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Unprocessed Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Unprocessed Items</span>
            <Badge variant="secondary">{unprocessedItems.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : unprocessedItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <InboxIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Your inbox is empty</p>
              <p className="text-sm mt-1">Capture your ideas and tasks above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {unprocessedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-md border border-card-border hover-elevate"
                  data-testid={`inbox-item-${item.id}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-card-foreground flex-1">{item.content}</p>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => markProcessed.mutate(item.id)}
                        data-testid={`button-process-${item.id}`}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => deleteInboxItem.mutate(item.id)}
                        data-testid={`button-delete-inbox-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {item.notes && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.notes}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(item.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Items */}
      {processedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Processed Items</span>
              <Badge variant="secondary">{processedItems.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {processedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-md bg-muted/30 opacity-60"
                  data-testid={`inbox-processed-${item.id}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-card-foreground flex-1 line-through">
                      {item.content}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => deleteInboxItem.mutate(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
