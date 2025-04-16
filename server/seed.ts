import { db } from "./db";
import { users, dictionaryEntries } from "@shared/schema";
import { log } from "./vite";

/**
 * This script seeds the database with initial data.
 * It should be run once when the application starts.
 */
export async function seedDatabase() {
  try {
    // Check if we already have users (to avoid creating duplicates)
    const existingUsers = await db.select().from(users);
    if (existingUsers.length === 0) {
      log("No users found, creating admin user");
      
      // Add admin user
      await db.insert(users).values({
        username: "admin",
        password: "admin123", // In a real app, this would be hashed
      });
    }

    // Check if we already have dictionary entries
    const existingEntries = await db.select().from(dictionaryEntries);
    if (existingEntries.length === 0) {
      log("No dictionary entries found, seeding initial entries");
      
      // Add initial dictionary entries from Pootie Tang Wikiquote
      await db.insert(dictionaryEntries).values([
        {
          pootieTangPhrase: "Sa da tay",
          englishTranslation: "That's right / I understand",
          usageContext: "Generally positive interpretation, an affirmative response"
        },
        {
          pootieTangPhrase: "Wa da tah",
          englishTranslation: "That's for sure! / I agree",
          usageContext: "Confirmation statement, used to express agreement"
        },
        {
          pootieTangPhrase: "Cole me on the panny sty",
          englishTranslation: "Call me on the phone",
          usageContext: "Said during an interview with Bob Costas"
        },
        {
          pootieTangPhrase: "Sine your pitty on the runny kine",
          englishTranslation: "Sign your name on the dotted line",
          usageContext: "Used when asking someone to sign a document"
        },
        {
          pootieTangPhrase: "Capatown",
          englishTranslation: "Calm down now",
          usageContext: "Used in a friendly manner to tell someone to relax"
        },
        {
          pootieTangPhrase: "Ranacan",
          englishTranslation: "To party",
          usageContext: "Used when talking about socializing or celebrating"
        },
        {
          pootieTangPhrase: "Bata shane, my dillie?",
          englishTranslation: "What time is the party?",
          usageContext: "Said to 'Biggie Shorty' regarding a party"
        },
        {
          pootieTangPhrase: "Tipi tais",
          englishTranslation: "Kids / children",
          usageContext: "Generally accepted as referring to young people"
        },
        {
          pootieTangPhrase: "Cama cama leepa chai",
          englishTranslation: "No, I refuse",
          usageContext: "Refusal on moral grounds"
        },
        {
          pootieTangPhrase: "You ain't come one, but many tine tanies!",
          englishTranslation: "You came to fight me with many friends!",
          usageContext: "Said to Dirty Dee when he came to challenge Pootie Tang"
        },
        {
          pootieTangPhrase: "Dirty Dee, you're a baddy daddy lamatai tabby chai!",
          englishTranslation: "Dirty Dee, you're a terrible person!",
          usageContext: "A threat or insult directed at the character Dirty Dee"
        }
      ]);
    }
    
    log("Database seeding complete");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}