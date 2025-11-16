import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { insertTimeBlockSchema, type TimeBlock, type InsertTimeBlock } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, parse } from "date-fns";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Calendar() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const { data: timeBlocks, isLoading } = useQuery<TimeBlock[]>({
    queryKey: ["/api/time-blocks"],
  });

  const form = useForm<InsertTimeBlock>({
    resolver: zodResolver(insertTimeBlockSchema),
    defaultValues: {
      userId: "",
      title: "",
      description: "",
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000), // 1 hour later
      color: "#414A37",
      isAllDay: false,
    },
  });

  const createTimeBlock = useMutation({
    mutationFn: async (data: InsertTimeBlock) => {
      await apiRequest("POST", "/api/time-blocks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/time-blocks"] });
      toast({
        title: "Time block created",
        description: "Your time block has been added to the calendar.",
      });
      form.reset();
      setDialogOpen(false);
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
        description: "Failed to create time block. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteTimeBlock = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/time-blocks/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/time-blocks"] });
      toast({
        title: "Time block deleted",
        description: "Time block has been removed.",
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
        description: "Failed to delete time block. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTimeBlock) => {
    createTimeBlock.mutate(data);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getBlocksForDay = (day: Date) => {
    return timeBlocks?.filter(block => {
      const blockDate = new Date(block.startTime);
      return isSameDay(blockDate, day);
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-1">
            {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
              data-testid="button-prev-week"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentWeek(new Date())}
              data-testid="button-today"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
              data-testid="button-next-week"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-new-block">
                <Plus className="h-4 w-4 mr-2" />
                New Block
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Time Block</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Block title..." {...field} data-testid="input-block-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Block details..."
                            {...field}
                            value={field.value || ""}
                            data-testid="input-block-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              value={format(field.value, "yyyy-MM-dd'T'HH:mm")}
                              onChange={(e) => field.onChange(new Date(e.target.value))}
                              data-testid="input-block-start"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              value={format(field.value, "yyyy-MM-dd'T'HH:mm")}
                              onChange={(e) => field.onChange(new Date(e.target.value))}
                              data-testid="input-block-end"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <div className="flex gap-2">
                          {["#414A37", "#99744A", "#DBC2A6", "#6B7280", "#EF4444"].map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`h-10 w-10 rounded-md border-2 ${
                                field.value === color ? "border-foreground" : "border-transparent"
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => field.onChange(color)}
                              data-testid={`color-${color}`}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createTimeBlock.isPending}
                      data-testid="button-submit-block"
                    >
                      {createTimeBlock.isPending ? "Creating..." : "Create Block"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar Grid */}
      {isLoading ? (
        <Skeleton className="h-[600px] w-full" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Day Headers */}
              <div className="grid grid-cols-8 border-b border-card-border bg-muted/30">
                <div className="p-4 font-mono text-sm font-medium text-muted-foreground">Time</div>
                {weekDays.map((day, idx) => (
                  <div
                    key={idx}
                    className="p-4 text-center border-l border-card-border"
                  >
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      {format(day, 'EEE')}
                    </div>
                    <div className={`text-lg font-semibold mt-1 ${
                      isSameDay(day, new Date()) ? 'text-primary' : 'text-card-foreground'
                    }`}>
                      {format(day, 'd')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Grid */}
              <div className="relative">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="grid grid-cols-8 border-b border-card-border"
                    style={{ minHeight: '60px' }}
                  >
                    <div className="p-2 text-right text-xs font-mono text-muted-foreground">
                      {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
                    </div>
                    {weekDays.map((day, dayIdx) => {
                      const blocks = getBlocksForDay(day).filter(block => {
                        const blockHour = new Date(block.startTime).getHours();
                        return blockHour === hour;
                      });

                      return (
                        <div
                          key={dayIdx}
                          className="border-l border-card-border p-1 relative"
                        >
                          {blocks.map((block) => {
                            const startMinutes = new Date(block.startTime).getMinutes();
                            const duration = (new Date(block.endTime).getTime() - new Date(block.startTime).getTime()) / (1000 * 60);
                            const heightPercent = (duration / 60) * 100;
                            const topPercent = (startMinutes / 60) * 100;

                            return (
                              <div
                                key={block.id}
                                className="absolute inset-x-1 rounded-md p-2 text-xs overflow-hidden group"
                                style={{
                                  backgroundColor: `${block.color}E6`,
                                  top: `${topPercent}%`,
                                  height: `${heightPercent}%`,
                                  minHeight: '24px',
                                }}
                                data-testid={`calendar-block-${block.id}`}
                              >
                                <div className="flex items-start justify-between gap-1">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-white truncate">
                                      {block.title}
                                    </p>
                                    <p className="text-xs text-white/90 font-mono">
                                      {format(new Date(block.startTime), 'h:mm a')}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => deleteTimeBlock.mutate(block.id)}
                                    data-testid={`button-delete-block-${block.id}`}
                                  >
                                    <Trash2 className="h-3 w-3 text-white" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
