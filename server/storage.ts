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

    // Add initial dictionary entries from Pootie Tang Wikiquote
    this.createDictionaryEntry({
      pootieTangPhrase: "Sa da tay",
      englishTranslation: "That's right / I understand",
      usageContext: "Generally positive interpretation, an affirmative response"
    });

    this.createDictionaryEntry({
      pootieTangPhrase: "Wa da tah",
      englishTranslation: "That's for sure! / I agree",
      usageContext: "Confirmation statement, used to express agreement"
    });

    this.createDictionaryEntry({
      pootieTangPhrase: "Cole me on the panny sty",
      englishTranslation: "Call me on the phone",
      usageContext: "Said during an interview with Bob Costas"
    });

    this.createDictionaryEntry({
      pootieTangPhrase: "Sine your pitty on the runny kine",
      englishTranslation: "Sign your name on the dotted line",
      usageContext: "Used when asking someone to sign a document"
    });

    this.createDictionaryEntry({
      pootieTangPhrase: "Capatown",
      englishTranslation: "Calm down now",
      usageContext: "Used in a friendly manner to tell someone to relax"
    });

    this.createDictionaryEntry({
      pootieTangPhrase: "Ranacan",
      englishTranslation: "To party",
      usageContext: "Used when talking about socializing or celebrating"
    });

    this.createDictionaryEntry({
      pootieTangPhrase: "Bata shane, my dillie?",
      englishTranslation: "What time is the party?",
      usageContext: "Said to 'Biggie Shorty' regarding a party"
    });

    this.createDictionaryEntry({
      pootieTangPhrase: "Tipi tais",
      englishTranslation: "Kids / children",
      usageContext: "Generally accepted as referring to young people"
    });

    this.createDictionaryEntry({
      pootieTangPhrase: "Cama cama leepa chai",
      englishTranslation: "No, I refuse",
      usageContext: "Refusal on moral grounds"
    });

    this.createDictionaryEntry({
      pootieTangPhrase: "You ain't come one, but many tine tanies!",
      englishTranslation: "You came to fight me with many friends!",
      usageContext: "Said to Dirty Dee when he came to challenge Pootie Tang"
    });

    this.createDictionaryEntry({
      pootieTangPhrase: "Dirty Dee, you're a baddy daddy lamatai tabby chai!",
      englishTranslation: "Dirty Dee, you're a terrible person!",
      usageContext: "A threat or insult directed at the character Dirty Dee"
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
