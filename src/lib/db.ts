import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql";

export const db: LibSQLDatabase = drizzle({
  connection: {
    url: process.env.DATABASE_URL!,
    // encryptionKey: process.env.DATABASE_ENCRYPTION_KEY!, // or encryptionKey, depending on your library version
    //authToken: process.env.DATABASE_ENCRYPTION_KEY!,
  },
  logger: true,
});
