import * as FileSystem from "expo-file-system";

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
