import { type SQLiteDatabase } from "expo-sqlite";

export async function setupDB(database: SQLiteDatabase) {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS Task (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT,
      deadline TEXT,
      isCompleted INTEGER DEFAULT 0,
      userId TEXT NOT NULL
    );
  `);
}
