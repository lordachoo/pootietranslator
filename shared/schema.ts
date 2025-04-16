import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
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
  pronunciation: text("pronunciation"),
  audioUrl: text("audio_url"),
});

export const insertDictionaryEntrySchema = createInsertSchema(dictionaryEntries).pick({
  pootieTangPhrase: true,
  englishTranslation: true,
  usageContext: true,
  pronunciation: true,
  audioUrl: true,
});

export type InsertDictionaryEntry = z.infer<typeof insertDictionaryEntrySchema>;
export type DictionaryEntry = typeof dictionaryEntries.$inferSelect;

// Site Settings table
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).pick({
  key: true,
  value: true,
});

export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;
