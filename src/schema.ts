import { boolean, bigint, timestamp, text, pgTable, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  user_id: varchar({ length: 255 }).unique().notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

export const messages = pgTable("messages", {
  id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  user_id: varchar({ length: 255 }).references(() => users.user_id).notNull(),
  message: text().notNull(),
  queued: boolean().notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});