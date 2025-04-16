import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDictionaryEntrySchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

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

  const httpServer = createServer(app);
  return httpServer;
}
