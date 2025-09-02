import * as SQLite from "expo-sqlite";
import "react-native-get-random-values";
import { type SQLiteDatabase } from "expo-sqlite";

type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  deadline?: string;
  isCompleted: number;
  userId: string;
};

export function useDatabase() {
  let dbInstance: SQLiteDatabase | null = null;

  async function getDatabase() {
    if (!dbInstance) {
      dbInstance = await SQLite.openDatabaseAsync("tarefou.db");
    }
    return dbInstance;
  }

  async function createTask(data: Task) {
    const db = await getDatabase();
    const statement = await db.prepareAsync(
      `INSERT INTO Task (id, title, description, createdAt, updatedAt, deadline, isCompleted, userId)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    try {
      await statement.executeAsync([
        data.id,
        data.title,
        data.description ?? null,
        data.createdAt ?? new Date().toISOString(),
        data.updatedAt ?? null,
        data.deadline ?? null,
        data.isCompleted ?? 0,
        data.userId,
      ]);

      await statement.finalizeAsync();
      return { success: true };
    } catch (error) {
      console.error("Error creating user: ", error);
      return { success: false, error };
    }
  }

  async function getTasks() {
    try {
      const db = await getDatabase();
      const res = await db.getAllAsync("SELECT * FROM Task");
      return res;
    } catch (error) {
      console.error("Error getting tasks: ", error);
      return { success: false, error };
    }
  }

  async function getTasksByUser(userId: string) {
    try {
      const db = await getDatabase();
      const res = await db.getAllAsync(
        `SELECT * FROM Task WHERE userId = ?`,
        userId,
      );
      return res;
    } catch (error) {
      console.error("Error getting tasks: ", error);
      return { success: false, error };
    }
  }

  async function getTaskById(id: string) {
    const db = await getDatabase();
    const statement = await db.prepareAsync(`SELECT * FROM Task WHERE id = ?`);
    try {
      const result = await statement.executeAsync([id]);
      return result;
    } catch (error) {
      console.error("Error getting task by id: ", error);
      return { success: false, error };
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function updateTask(id: string, data: Task) {
    try {
      const db = await getDatabase();
      const statement = await db.prepareAsync(
        `UPDATE Task SET title = ?, description = ?, updatedAt = ?, deadline = ?, isCompleted = ? WHERE userId = ?`,
      );
      await statement.executeAsync([
        data.title,
        data.description ?? null,
        data.updatedAt ?? null,
        data.deadline ?? null,
        data.isCompleted ?? 0,
        id,
      ]);
      await statement.finalizeAsync();
      return { success: true };
    } catch (error) {
      console.error("Error updating task: ", error);
      return { success: false, error };
    }
  }

  async function deleteTask(id: string) {
    try {
      const db = await getDatabase();
      const statement = await db.prepareAsync(`DELETE FROM Task WHERE id = ?`);
      await statement.executeAsync([id]);
      await statement.finalizeAsync();
      return { success: true };
    } catch (error) {
      console.error("Error deleting task: ", error);
      return { success: false, error };
    }
  }

  const deleteAllTasks = async (userId: string) => {
    try {
      const db = await getDatabase();
      const statement = await db.prepareAsync(
        "DELETE FROM Task WHERE userId = ?",
      );
      await statement.executeAsync([userId]);
      await statement.finalizeAsync();
      return { success: true };
    } catch (error) {
      console.error("Erro deleting tasks: ", error);
      return { success: false };
    }
  };

  return {
    getDatabase,
    createTask,
    getTasks,
    getTasksByUser,
    getTaskById,
    updateTask,
    deleteTask,
    deleteAllTasks,
  };
}
