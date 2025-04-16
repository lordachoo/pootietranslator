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
    
    // Normalize the query to handle case insensitivity
    const normalizedQuery = query.trim().toLowerCase();
    
    // Get all entries 
    const allEntries = await this.getDictionaryEntries();
    
    // First, try to find exact matches (entries containing the full query as a substring)
    const exactMatches = allEntries.filter(entry => {
      const pootieTangPhrase = entry.pootieTangPhrase.toLowerCase();
      const englishTranslation = entry.englishTranslation.toLowerCase();
      const usageContext = (entry.usageContext || '').toLowerCase();
      
      return (
        pootieTangPhrase.includes(normalizedQuery) || 
        englishTranslation.includes(normalizedQuery) || 
        usageContext.includes(normalizedQuery)
      );
    });
    
    // If we found exact matches, return them
    if (exactMatches.length > 0) {
      return exactMatches;
    }
    
    // Otherwise, split the query into words and look for partial matches
    const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 1);
    
    // If no valid terms after filtering, return all entries
    if (queryTerms.length === 0) {
      return allEntries;
    }
    
    // Filter entries where ALL terms match at least one field
    return allEntries.filter(entry => {
      const pootieTangPhrase = entry.pootieTangPhrase.toLowerCase();
      const englishTranslation = entry.englishTranslation.toLowerCase();
      const usageContext = (entry.usageContext || '').toLowerCase();
      
      // Check if each term is included in at least one of the fields
      return queryTerms.every(term => 
        pootieTangPhrase.includes(term) || 
        englishTranslation.includes(term) || 
        usageContext.includes(term)
      );
    });
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