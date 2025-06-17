import * as SQLite from "expo-sqlite";
import "react-native-get-random-values";
import uuid from "react-native-uuid";
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
    try {
      const db = await getDatabase();
      const statement = await db.prepareAsync(
        `INSERT INTO Task (id, title, description, createdAt, updatedAt, deadline, isCompleted, userId)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      );

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
      return { success: true, taskId: data.id };
    } catch (error) {
      console.error("Error creating user:", error);
      return { success: false, error };
    }
  }

  async function getTasks() {
    try {
      const db = await getDatabase();
      const statement = await db.prepareAsync(`SELECT * FROM Task`);
      const result = await statement.executeAsync();
      return result;
    } catch (error) {
      console.error("Error getting tasks:", error);
      return { success: false, error };
    }
  }

  async function getTaskById(id: string) {
    try {
      const db = await getDatabase();
      const statement = await db.prepareAsync(
        `SELECT * FROM Task WHERE id = ?`
      );
      const result = await statement.executeAsync([id]);
      return result;
    } catch (error) {
      console.error("Error getting task by id:", error);
      return { success: false, error };
    }
  }

  async function updateTask(id: string, data: Task) {
    try {
      const db = await getDatabase();
      const statement = await db.prepareAsync(
        `UPDATE Task SET title = ?, description = ?, updatedAt = ?, deadline = ?, isCompleted = ? WHERE id = ?`
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
      return { success: true, taskId: id };
    } catch (error) {
      console.error("Error updating task:", error);
      return { success: false, error };
    }
  }

  async function deleteTask(id: string) {
    try {
      const db = await getDatabase();
      const statement = await db.prepareAsync(`DELETE FROM Task WHERE id = ?`);
      await statement.executeAsync([id]);
      await statement.finalizeAsync();
      return { success: true, taskId: id };
    } catch (error) {
      console.error("Error deleting task:", error);
      return { success: false, error };
    }
  }

  return {
    getDatabase,
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
  };
}
