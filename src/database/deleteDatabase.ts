import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";

export const deleteDatabase = async () => {
  const dbName = "family-tasks.db";
  const dbPath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileExists = await FileSystem.getInfoAsync(dbPath);
  if (fileExists.exists) {
    await FileSystem.deleteAsync(dbPath);
    console.log("Banco deletado com sucesso");
  } else {
    console.log("Banco não encontrado");
  }
};
