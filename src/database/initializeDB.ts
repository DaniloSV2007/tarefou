import { type SQLiteDatabase } from "expo-sqlite";
export async function initializeDB(database: SQLiteDatabase) {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS Family (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    createdAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_family_name ON Family(name);

CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    name TEXT NOT NULL,
    userName TEXT NOT NULL,
    birthday TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'MEMBER' CHECK(role IN ('MEMBER', 'FAMILY_ADMIN')),
    familyId TEXT,
    FOREIGN KEY (familyId) REFERENCES Family(id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_email ON User(email);
CREATE INDEX IF NOT EXISTS idx_user_family ON User(familyId);

CREATE TABLE IF NOT EXISTS Tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT,
    deadline TEXT,
    isCompleted INTEGER NOT NULL DEFAULT 0 CHECK(isCompleted IN (0, 1)),
    userId TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tasks_user ON Tasks(userId);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON Tasks(isCompleted);
        
        `);
}
