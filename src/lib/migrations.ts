import { createClient } from "@libsql/client";
import path from "path";
import { Glob } from "bun";

export async function runMigrations() {
  // Set up the database client
  const db = createClient({
    url: process.env.DATABASE_URL!,
    encryptionKey: process.env.DATABASE_ENCRYPTION_KEY!,
  });

  const glob = new Glob("*.sql");

  const migrationsPath = path.resolve("./drizzle/migrations"); // Path to migration files

  try {
    for await (const file of glob.scan(migrationsPath)) {
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

await runMigrations();
