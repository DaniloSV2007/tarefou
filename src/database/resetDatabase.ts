import * as FileSystem from "expo-file-system";

export async function resetDatabase() {
  try {
    await FileSystem.deleteAsync(`${FileSystem.documentDirectory}SQLite`, {
      idempotent: true,
    });
    console.log("Banco de dados SQLite foi apagado.");
  } catch (error) {
    console.error("Erro ao apagar banco de dados:", error);
  }
}
