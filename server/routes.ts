import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDictionaryEntrySchema, insertSiteSettingSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

// Schema for password change
const changePasswordSchema = z.object({
  userId: z.number(),
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters")
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, we would set up a session or JWT here
      res.status(200).json({ 
        success: true, 
        user: { 
          id: user.id, 
          username: user.username 
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Password change endpoint
  app.post("/api/change-password", async (req: Request, res: Response) => {
    try {
      const validatedData = changePasswordSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        return res.status(400).json({ 
          message: "Invalid password data", 
          errors: fromZodError(validatedData.error).message 
        });
      }
      
      const { userId, currentPassword, newPassword } = validatedData.data;
      
      // Verify the user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify current password
      if (user.password !== currentPassword) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      
      // Update password
      const success = await storage.updateUserPassword(userId, newPassword);
      
      if (success) {
        res.status(200).json({ 
          success: true, 
          message: "Password updated successfully" 
        });
      } else {
        res.status(500).json({ message: "Failed to update password" });
      }
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Dictionary Entry routes
  app.get("/api/dictionary", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string | undefined;
      let entries;
      
      if (query) {
        entries = await storage.searchDictionaryEntries(query);
      } else {
        entries = await storage.getDictionaryEntries();
      }
      
      res.status(200).json(entries);
    } catch (error) {
      console.error("Error fetching dictionary entries:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/dictionary/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const entry = await storage.getDictionaryEntry(id);
      
      if (!entry) {
        return res.status(404).json({ message: "Dictionary entry not found" });
      }
      
      res.status(200).json(entry);
    } catch (error) {
      console.error("Error fetching dictionary entry:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/dictionary", async (req: Request, res: Response) => {
    try {
      const validatedData = insertDictionaryEntrySchema.safeParse(req.body);
      
      if (!validatedData.success) {
        return res.status(400).json({ 
          message: "Invalid entry data", 
          errors: fromZodError(validatedData.error).message 
        });
      }
      
      const newEntry = await storage.createDictionaryEntry(validatedData.data);
      res.status(201).json(newEntry);
    } catch (error) {
      console.error("Error creating dictionary entry:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/dictionary/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      // Validate partial update data
      const partialSchema = insertDictionaryEntrySchema.partial();
      const validatedData = partialSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        return res.status(400).json({ 
          message: "Invalid entry data", 
          errors: fromZodError(validatedData.error).message 
        });
      }
      
      const updatedEntry = await storage.updateDictionaryEntry(id, validatedData.data);
      
      if (!updatedEntry) {
        return res.status(404).json({ message: "Dictionary entry not found" });
      }
      
      res.status(200).json(updatedEntry);
    } catch (error) {
      console.error("Error updating dictionary entry:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/dictionary/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const success = await storage.deleteDictionaryEntry(id);
      
      if (!success) {
        return res.status(404).json({ message: "Dictionary entry not found" });
      }
      
      res.status(200).json({ success: true, message: "Dictionary entry deleted successfully" });
    } catch (error) {
      console.error("Error deleting dictionary entry:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Site Settings routes
  app.get("/api/settings", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getSiteSettings();
      res.status(200).json(settings);
    } catch (error) {
      console.error("Error fetching site settings:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/settings/:key", async (req: Request, res: Response) => {
    try {
      const key = req.params.key;
      const setting = await storage.getSiteSetting(key);
      
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      
      res.status(200).json(setting);
    } catch (error) {
      console.error(`Error fetching site setting:`, error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/settings", async (req: Request, res: Response) => {
    try {
      // Log the request body for debugging
      console.log("Site settings update request:", req.body);
      
      const siteSettingSchema = z.object({
        key: z.string().min(1, "Key is required"),
        value: z.string().optional()
      });
      
      const validatedData = siteSettingSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        console.log("Validation error:", validatedData.error);
        return res.status(400).json({ 
          message: "Invalid setting data", 
          errors: fromZodError(validatedData.error).message 
        });
      }
      
      const { key, value = "" } = validatedData.data;
      console.log(`Updating setting: ${key} = ${value}`);
      
      try {
        const setting = await storage.setSiteSetting(key, value);
        console.log("Setting updated successfully:", setting);
        res.status(200).json(setting);
      } catch (dbError) {
        console.error("Database error during setting update:", dbError);
        res.status(500).json({ message: "Database error", error: dbError.message });
      }
    } catch (error) {
      console.error("Error updating site setting:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
