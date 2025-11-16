// Reference: javascript_log_in_with_replit, javascript_database, and javascript_openai integrations
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { getAIResponse } from "./openai";
import {
  insertTaskSchema,
  insertTimeBlockSchema,
  insertInboxItemSchema,
  insertUserSettingsSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Task routes
  app.get("/api/tasks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertTaskSchema.parse({ ...req.body, userId });
      const task = await storage.createTask(validatedData);
      res.json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(400).json({ message: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const updates = req.body;
      const task = await storage.updateTask(id, userId, updates);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(400).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      await storage.deleteTask(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(400).json({ message: "Failed to delete task" });
    }
  });

  // Time Block routes
  app.get("/api/time-blocks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const blocks = await storage.getTimeBlocks(userId);
      res.json(blocks);
    } catch (error) {
      console.error("Error fetching time blocks:", error);
      res.status(500).json({ message: "Failed to fetch time blocks" });
    }
  });

  app.post("/api/time-blocks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertTimeBlockSchema.parse({ ...req.body, userId });
      const block = await storage.createTimeBlock(validatedData);
      res.json(block);
    } catch (error) {
      console.error("Error creating time block:", error);
      res.status(400).json({ message: "Failed to create time block" });
    }
  });

  app.patch("/api/time-blocks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const updates = req.body;
      const block = await storage.updateTimeBlock(id, userId, updates);
      if (!block) {
        return res.status(404).json({ message: "Time block not found" });
      }
      res.json(block);
    } catch (error) {
      console.error("Error updating time block:", error);
      res.status(400).json({ message: "Failed to update time block" });
    }
  });

  app.delete("/api/time-blocks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      await storage.deleteTimeBlock(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting time block:", error);
      res.status(400).json({ message: "Failed to delete time block" });
    }
  });

  // Inbox routes
  app.get("/api/inbox", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const items = await storage.getInboxItems(userId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching inbox items:", error);
      res.status(500).json({ message: "Failed to fetch inbox items" });
    }
  });

  app.post("/api/inbox", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertInboxItemSchema.parse({ ...req.body, userId });
      const item = await storage.createInboxItem(validatedData);
      res.json(item);
    } catch (error) {
      console.error("Error creating inbox item:", error);
      res.status(400).json({ message: "Failed to create inbox item" });
    }
  });

  app.patch("/api/inbox/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const updates = req.body;
      const item = await storage.updateInboxItem(id, userId, updates);
      if (!item) {
        return res.status(404).json({ message: "Inbox item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error updating inbox item:", error);
      res.status(400).json({ message: "Failed to update inbox item" });
    }
  });

  app.delete("/api/inbox/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      await storage.deleteInboxItem(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting inbox item:", error);
      res.status(400).json({ message: "Failed to delete inbox item" });
    }
  });

  // User Settings routes
  app.get("/api/settings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const settings = await storage.getUserSettings(userId);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertUserSettingsSchema.parse({ ...req.body, userId });
      const settings = await storage.upsertUserSettings(validatedData);
      res.json(settings);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(400).json({ message: "Failed to update settings" });
    }
  });

  // AI Chat route
  app.post("/api/ai/chat", isAuthenticated, async (req: any, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await getAIResponse(message);
      res.json({ response });
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
