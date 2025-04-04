import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import bun from "bun";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { Glob } from "bun";

export const db: LibSQLDatabase = drizzle({
  connection: {
    url: process.env.DATABASE_URL!,
    encryptionKey: process.env.DATABASE_ENCRYPTION_KEY!,
  },
  logger: true,
});

export async function runSeed() {
  const db = createClient({
    url: process.env.DATABASE_URL!,
    encryptionKey: process.env.DATABASE_ENCRYPTION_KEY!,
  });

  try {
    await db.execute({
      sql: "INSERT INTO admins (id, email, password) VALUES (:id, :email, :password)",
      args: {
        id: uuidv4(),
        email: process.env.ADMIN_EMAIL!,
        password: await bun.password.hash(process.env.ADMIN_PASSWORD!),
      },
    });
    await db.execute({
      sql: "INSERT INTO users (id, email, password) VALUES (:id, :email, :password)",
      args: {
        id: uuidv4(),
        email: process.env.USER_EMAIL!,
        password: await bun.password.hash(process.env.USER_PASSWORD!),
      },
    });
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export async function runMigrations() {
  // Set up the database client
  const db = createClient({
    url: process.env.DATABASE_URL!,
    encryptionKey: process.env.DATABASE_ENCRYPTION_KEY!,
  });

  const glob = new Glob("*.sql");

  const migrationsPath = path.resolve("./drizzle/migrations"); // Path to migration files
  const files = (await Array.fromAsync(glob.scan(migrationsPath))).sort();
  try {
    for (const file of files) {
      const filePath = path.join(migrationsPath, file);

      // Read the SQL content of the file
      const sql = Bun.file(filePath);

      console.log(`Running migration: ${file}`);

      try {
        // Execute the SQL content within a transaction
        await db.migrate((await sql.text()).split("--> statement-breakpoint"));
      } catch (migrationError) {
        console.error(`Migration failed for ${file}:`, migrationError);
        // Continue with the next migration
        continue;
      }
    }
    console.log("All migrations executed successfully!");
  } catch (error) {
    console.error("Error executing migrations:", error);
  }
}
