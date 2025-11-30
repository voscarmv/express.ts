import { beforeEach } from "vitest";
import { drizzle } from "drizzle-orm/node-postgres";
import { users, messages } from "../src/schema.js";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

// Auto-cleanup tables before each test
beforeEach(async () => {
    await db.delete(messages).where(eq(messages.id, messages.id)); // delete all
    await db.delete(users).where(eq(users.id, users.id));         // delete all
});
