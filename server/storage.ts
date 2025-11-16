// Reference: javascript_log_in_with_replit and javascript_database integrations
import {
  users,
  tasks,
  timeBlocks,
  inboxItems,
  userSettings,
  type User,
  type UpsertUser,
  type Task,
  type InsertTask,
  type TimeBlock,
  type InsertTimeBlock,
  type InboxItem,
  type InsertInboxItem,
  type UserSettings,
  type InsertUserSettings,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Task operations
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: string, userId: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, userId: string, updates: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string, userId: string): Promise<void>;

  // Time Block operations
  getTimeBlocks(userId: string): Promise<TimeBlock[]>;
  getTimeBlock(id: string, userId: string): Promise<TimeBlock | undefined>;
  createTimeBlock(block: InsertTimeBlock): Promise<TimeBlock>;
  updateTimeBlock(id: string, userId: string, updates: Partial<InsertTimeBlock>): Promise<TimeBlock | undefined>;
  deleteTimeBlock(id: string, userId: string): Promise<void>;

  // Inbox operations
  getInboxItems(userId: string): Promise<InboxItem[]>;
  getInboxItem(id: string, userId: string): Promise<InboxItem | undefined>;
  createInboxItem(item: InsertInboxItem): Promise<InboxItem>;
  updateInboxItem(id: string, userId: string, updates: Partial<InsertInboxItem>): Promise<InboxItem | undefined>;
  deleteInboxItem(id: string, userId: string): Promise<void>;

  // User Settings operations
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Task operations
  async getTasks(userId: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
  }

  async getTask(id: string, userId: string): Promise<Task | undefined> {
    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return task;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: string, userId: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const [updated] = await db
      .update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    return updated;
  }

  async deleteTask(id: string, userId: string): Promise<void> {
    await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  }

  // Time Block operations
  async getTimeBlocks(userId: string): Promise<TimeBlock[]> {
    return await db
      .select()
      .from(timeBlocks)
      .where(eq(timeBlocks.userId, userId))
      .orderBy(timeBlocks.startTime);
  }

  async getTimeBlock(id: string, userId: string): Promise<TimeBlock | undefined> {
    const [block] = await db
      .select()
      .from(timeBlocks)
      .where(and(eq(timeBlocks.id, id), eq(timeBlocks.userId, userId)));
    return block;
  }

  async createTimeBlock(block: InsertTimeBlock): Promise<TimeBlock> {
    const [newBlock] = await db.insert(timeBlocks).values(block).returning();
    return newBlock;
  }

  async updateTimeBlock(id: string, userId: string, updates: Partial<InsertTimeBlock>): Promise<TimeBlock | undefined> {
    const [updated] = await db
      .update(timeBlocks)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(timeBlocks.id, id), eq(timeBlocks.userId, userId)))
      .returning();
    return updated;
  }

  async deleteTimeBlock(id: string, userId: string): Promise<void> {
    await db.delete(timeBlocks).where(and(eq(timeBlocks.id, id), eq(timeBlocks.userId, userId)));
  }

  // Inbox operations
  async getInboxItems(userId: string): Promise<InboxItem[]> {
    return await db
      .select()
      .from(inboxItems)
      .where(eq(inboxItems.userId, userId))
      .orderBy(desc(inboxItems.createdAt));
  }

  async getInboxItem(id: string, userId: string): Promise<InboxItem | undefined> {
    const [item] = await db
      .select()
      .from(inboxItems)
      .where(and(eq(inboxItems.id, id), eq(inboxItems.userId, userId)));
    return item;
  }

  async createInboxItem(item: InsertInboxItem): Promise<InboxItem> {
    const [newItem] = await db.insert(inboxItems).values(item).returning();
    return newItem;
  }

  async updateInboxItem(id: string, userId: string, updates: Partial<InsertInboxItem>): Promise<InboxItem | undefined> {
    const [updated] = await db
      .update(inboxItems)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(inboxItems.id, id), eq(inboxItems.userId, userId)))
      .returning();
    return updated;
  }

  async deleteInboxItem(id: string, userId: string): Promise<void> {
    await db.delete(inboxItems).where(and(eq(inboxItems.id, id), eq(inboxItems.userId, userId)));
  }

  // User Settings operations
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));
    return settings;
  }

  async upsertUserSettings(settingsData: InsertUserSettings): Promise<UserSettings> {
    const [settings] = await db
      .insert(userSettings)
      .values(settingsData)
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: {
          ...settingsData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return settings;
  }
}

export const storage = new DatabaseStorage();
