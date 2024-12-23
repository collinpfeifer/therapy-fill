export default {
  dialect: "sqlite",
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations/",
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
};
