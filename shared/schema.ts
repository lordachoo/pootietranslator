import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Dictionary entries table
export const dictionaryEntries = pgTable("dictionary_entries", {
  id: serial("id").primaryKey(),
  pootieTangPhrase: text("pootie_tang_phrase").notNull(),
  englishTranslation: text("english_translation").notNull(),
  usageContext: text("usage_context"),
});

export const insertDictionaryEntrySchema = createInsertSchema(dictionaryEntries).pick({
  pootieTangPhrase: true,
  englishTranslation: true,
  usageContext: true,
});

export type InsertDictionaryEntry = z.infer<typeof insertDictionaryEntrySchema>;
export type DictionaryEntry = typeof dictionaryEntries.$inferSelect;
