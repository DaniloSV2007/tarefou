import { useSQLiteContext } from "expo-sqlite";
import { v4 as uuidv4 } from "uuid";

export type FamilyWithAdminUser = {
  idFamily: string;
  familyName: string;
  familyCreatedAt: string;
  idUser: string;
  email: string;
  passwordHash: string;
  userName: string;
  username: string;
  userCreatedAt: string;
  birthday: string;
};

export type Family = {
  id: string;
  name: string;
  createdAt: string;
};

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  birthday: string;
  role: string;
  familyId: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deadline: string;
  isCompleted: boolean;
  userId: string;
};

export function useDatabase() {
  const database = useSQLiteContext();

  async function findUserByEmail(email: string) {
    const statement = await database.prepareAsync(
      "SELECT email FROM User WHERE email = $email"
    );
    const result = (await statement.executeAsync({
      email,
    })) as unknown as Array<{ email: string }>;
    return result[0]?.email;
  }

  async function createFamilyAndAdminUser(
    data: Omit<FamilyWithAdminUser, "idFamily" | "idUser">
  ) {
    const statementFamily = await database.prepareAsync(
      "INSERT INTO Family (id, name, createdAt) VALUES ($id, $name, $createdAt)"
    );

    const statementUser = await database.prepareAsync(
      "INSERT INTO User (id, email, passwordHash, name, userName, birthday, role, familyId) VALUES ($id, $email, $passwordHash, $name, $userName, $birthday, $role, $familyId)"
    );

    try {
      const idFamily = uuidv4();
      const resultFamily = await statementFamily.executeAsync({
        id: idFamily,
        name: data.familyName,
        createdAt: data.familyCreatedAt,
      });

      const idUser = uuidv4();
      const existingEmail = await findUserByEmail(data.email);
      if (existingEmail) {
        throw new Error("Email already exists");
      }
      const resultUser = await statementUser.executeAsync({
        id: idUser,
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.userName,
        userName: data.userName,
        birthday: data.birthday,
        role: "FAMILY_ADMIN",
        familyId: idFamily,
      });
    } catch (error) {
      throw error;
    }
  }

  async function createTask(data: Omit<Task, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO Task (id, title, description, createdAt, updatedAt, deadline, isCompleted, userId) VALUES ($id, $title, $description, $createdAt, $updatedAt, $deadline, $isCompleted, $userId)"
    );

    try {
      const id = uuidv4();
      const result = await statement.executeAsync({
        id,
        title: data.title,
        description: data.description,
        createdAt: data.createdAt,
        deadline: data.deadline ?? null,
        userId: data.userId,
      });
    } catch (error) {
      throw error;
    }
  }

  async function login(email: string, password: string) {
    const statement = await database.prepareAsync(
      "SELECT COUNT(*) as count FROM User WHERE email = $email AND passwordHash = $password"
    );

    try {
      const result = (await statement.executeAsync({
        email,
        password,
      })) as unknown as Array<{ count: number }>;
      return { success: result[0]?.count > 0 };
    } catch (error) {
      throw error;
    }
  }

  return {
    createFamilyAndAdminUser,
    createTask,
    login,
  };
}
