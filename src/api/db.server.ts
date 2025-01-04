import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql";

export const db: LibSQLDatabase = drizzle({
  logger: true,
  connection: {
    url: "file:" + process.env.DATABASE_URL!,
    encryptionKey: process.env.DATABASE_ENCRYPTION_KEY!,
  },
});
