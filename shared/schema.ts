import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Process status enum
export const ProcessStatus = {
  PENDING_REVIEW: "pending_review",
  INCOMPLETE: "incomplete",
  CORRECTED: "corrected",
  IN_REVIEW: "in_review",
  FINALIZED: "finalized",
} as const;

export type ProcessStatusType = typeof ProcessStatus[keyof typeof ProcessStatus];

// Taxpayer (Contribuyente) - Client information
export const taxpayers = pgTable("taxpayers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rfc: text("rfc").notNull().unique(),
  name: text("name").notNull(),
  regime: text("regime").notNull(),
  email: text("email"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTaxpayerSchema = createInsertSchema(taxpayers).omit({
  id: true,
  createdAt: true,
});

export type InsertTaxpayer = z.infer<typeof insertTaxpayerSchema>;
export type Taxpayer = typeof taxpayers.$inferSelect;

// Process (Proceso de devolución)
export const processes = pgTable("processes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taxpayerId: varchar("taxpayer_id").notNull().references(() => taxpayers.id),
  name: text("name").notNull(),
  year: integer("year").notNull(),
  status: text("status").notNull().default(ProcessStatus.PENDING_REVIEW),
  feedbackComment: text("feedback_comment"),
  hasNewInfo: text("has_new_info").default("false"),
  isLocked: text("is_locked").default("false"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProcessSchema = createInsertSchema(processes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProcess = z.infer<typeof insertProcessSchema>;
export type Process = typeof processes.$inferSelect;

// Upload (Carga/Entrega)
export const uploads = pgTable("uploads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  processId: varchar("process_id").notNull().references(() => processes.id),
  uploadNumber: integer("upload_number").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUploadSchema = createInsertSchema(uploads).omit({
  id: true,
  createdAt: true,
});

export type InsertUpload = z.infer<typeof insertUploadSchema>;
export type Upload = typeof uploads.$inferSelect;

// XML File (Archivo XML)
export const xmlFiles = pgTable("xml_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  uploadId: varchar("upload_id").notNull().references(() => uploads.id),
  processId: varchar("process_id").notNull().references(() => processes.id),
  uuid: text("uuid").notNull(),
  fileName: text("file_name").notNull(),
  issuerRfc: text("issuer_rfc"),
  receiverRfc: text("receiver_rfc"),
  amount: text("amount"),
  issueDate: text("issue_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertXmlFileSchema = createInsertSchema(xmlFiles).omit({
  id: true,
  createdAt: true,
});

export type InsertXmlFile = z.infer<typeof insertXmlFileSchema>;
export type XmlFile = typeof xmlFiles.$inferSelect;

// Users table (for accountants)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Audit trail entry for tracking process state changes and uploads
export type AuditAction = "status_change" | "upload" | "document_request";

export interface AuditLogEntry {
  id: string;
  processId: string;
  action: AuditAction;
  previousStatus: string | null;
  newStatus: string | null;
  feedbackComment: string | null;
  uploadedFiles: string[] | null;
  requestedDocTypes: string[] | null;
  createdAt: Date;
}

// Extended types for frontend
export interface TaxpayerWithProcess extends Taxpayer {
  activeProcess?: Process;
  lastUploadDate?: Date;
}

export interface ProcessWithUploads extends Process {
  uploads: Upload[];
  totalFiles: number;
  uniqueFiles: number;
}

export interface UploadWithFiles extends Upload {
  files: XmlFile[];
}
