import { db } from "./db";
import { users, dictionaryEntries } from "@shared/schema";
import { type User, type InsertUser, type DictionaryEntry, type InsertDictionaryEntry } from "@shared/schema";
import { eq, like, or } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Dictionary entries methods
  async getDictionaryEntries(): Promise<DictionaryEntry[]> {
    return await db.select().from(dictionaryEntries);
  }

  async getDictionaryEntry(id: number): Promise<DictionaryEntry | undefined> {
    const [entry] = await db
      .select()
      .from(dictionaryEntries)
      .where(eq(dictionaryEntries.id, id));
    return entry || undefined;
  }

  async searchDictionaryEntries(query: string): Promise<DictionaryEntry[]> {
    if (!query) {
      return this.getDictionaryEntries();
    }
    
    const likeQuery = `%${query}%`;
    
    return await db
      .select()
      .from(dictionaryEntries)
      .where(
        or(
          like(dictionaryEntries.pootieTangPhrase, likeQuery),
          like(dictionaryEntries.englishTranslation, likeQuery),
          like(dictionaryEntries.usageContext || '', likeQuery)
        )
      );
  }

  async createDictionaryEntry(entry: InsertDictionaryEntry): Promise<DictionaryEntry> {
    // Make sure usageContext is null if it's undefined to match the database schema
    const entryToInsert = {
      ...entry,
      usageContext: entry.usageContext || null
    };
    
    const [newEntry] = await db
      .insert(dictionaryEntries)
      .values(entryToInsert)
      .returning();
    
    return newEntry;
  }

  async updateDictionaryEntry(id: number, updates: Partial<InsertDictionaryEntry>): Promise<DictionaryEntry | undefined> {
    // Make sure usageContext is null if it's undefined to match the database schema
    const updatesToApply = {
      ...updates,
      usageContext: updates.usageContext === undefined ? undefined : (updates.usageContext || null)
    };
    
    const [updatedEntry] = await db
      .update(dictionaryEntries)
      .set(updatesToApply)
      .where(eq(dictionaryEntries.id, id))
      .returning();
    
    return updatedEntry || undefined;
  }

  async deleteDictionaryEntry(id: number): Promise<boolean> {
    const result = await db
      .delete(dictionaryEntries)
      .where(eq(dictionaryEntries.id, id))
      .returning({ id: dictionaryEntries.id });
    
    return result.length > 0;
  }
}