import { type User, type InsertUser, type DictionaryEntry, type InsertDictionaryEntry } from "@shared/schema";
import { DatabaseStorage } from "./dbStorage";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: number, newPassword: string): Promise<boolean>;

  // Dictionary entries methods
  getDictionaryEntries(): Promise<DictionaryEntry[]>;
  getDictionaryEntry(id: number): Promise<DictionaryEntry | undefined>;
  searchDictionaryEntries(query: string): Promise<DictionaryEntry[]>;
  createDictionaryEntry(entry: InsertDictionaryEntry): Promise<DictionaryEntry>;
  updateDictionaryEntry(id: number, entry: Partial<InsertDictionaryEntry>): Promise<DictionaryEntry | undefined>;
  deleteDictionaryEntry(id: number): Promise<boolean>;
}

// We're now using the DatabaseStorage class instead of MemStorage
export const storage = new DatabaseStorage();
