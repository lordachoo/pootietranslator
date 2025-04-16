import { users, type User, type InsertUser, dictionaryEntries, type DictionaryEntry, type InsertDictionaryEntry } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Dictionary entries methods
  getDictionaryEntries(): Promise<DictionaryEntry[]>;
  getDictionaryEntry(id: number): Promise<DictionaryEntry | undefined>;
  searchDictionaryEntries(query: string): Promise<DictionaryEntry[]>;
  createDictionaryEntry(entry: InsertDictionaryEntry): Promise<DictionaryEntry>;
  updateDictionaryEntry(id: number, entry: Partial<InsertDictionaryEntry>): Promise<DictionaryEntry | undefined>;
  deleteDictionaryEntry(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private dictionaryEntries: Map<number, DictionaryEntry>;
  currentUserId: number;
  currentDictionaryEntryId: number;

  constructor() {
    this.users = new Map();
    this.dictionaryEntries = new Map();
    this.currentUserId = 1;
    this.currentDictionaryEntryId = 1;

    // Add admin user by default
    this.createUser({
      username: "admin",
      password: "admin123", // In a real app, this would be hashed
    });

    // Add some initial dictionary entries
    this.createDictionaryEntry({
      pootieTangPhrase: "Sa da tay",
      englishTranslation: "That's right / I understand",
      usageContext: "Common affirmative response"
    });

    this.createDictionaryEntry({
      pootieTangPhrase: "Cole me on the panny sty",
      englishTranslation: "Roll with me to the next spot",
      usageContext: "Used when you want someone to accompany you somewhere"
    });

    this.createDictionaryEntry({
      pootieTangPhrase: "Sine your pitty on the runny kine",
      englishTranslation: "Sign your name on the dotted line",
      usageContext: "Used when asking someone to sign a document"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Dictionary entries methods
  async getDictionaryEntries(): Promise<DictionaryEntry[]> {
    return Array.from(this.dictionaryEntries.values());
  }

  async getDictionaryEntry(id: number): Promise<DictionaryEntry | undefined> {
    return this.dictionaryEntries.get(id);
  }

  async searchDictionaryEntries(query: string): Promise<DictionaryEntry[]> {
    if (!query) {
      return this.getDictionaryEntries();
    }
    
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.dictionaryEntries.values()).filter(entry => 
      entry.pootieTangPhrase.toLowerCase().includes(lowercaseQuery) || 
      entry.englishTranslation.toLowerCase().includes(lowercaseQuery) ||
      (entry.usageContext && entry.usageContext.toLowerCase().includes(lowercaseQuery))
    );
  }

  async createDictionaryEntry(entry: InsertDictionaryEntry): Promise<DictionaryEntry> {
    const id = this.currentDictionaryEntryId++;
    const newEntry: DictionaryEntry = { ...entry, id };
    this.dictionaryEntries.set(id, newEntry);
    return newEntry;
  }

  async updateDictionaryEntry(id: number, updates: Partial<InsertDictionaryEntry>): Promise<DictionaryEntry | undefined> {
    const existingEntry = this.dictionaryEntries.get(id);
    
    if (!existingEntry) {
      return undefined;
    }
    
    const updatedEntry: DictionaryEntry = {
      ...existingEntry,
      ...updates
    };
    
    this.dictionaryEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteDictionaryEntry(id: number): Promise<boolean> {
    return this.dictionaryEntries.delete(id);
  }
}

export const storage = new MemStorage();
