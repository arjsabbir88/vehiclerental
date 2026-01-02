import { pool } from "../../config/db";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const result = await pool.query(
    `INSERT INTO users(name,email,password,phone,role) VALUES($1,LOWER($2),$3,$4,$5) RETURNING id,name,email,phone,role`,
    [name, email, password, phone, role]
  );

  return result;
};

const getUsers = async () => {
  const result = await pool.query(`SELECT * FROM public_users`);

  return result;
};

export const userService = {
  createUser,
  getUsers,
};
