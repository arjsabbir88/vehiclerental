import { pool } from "../../config/db";

const findByEmail = async (email: string) => {
  const result = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        
        `,
    [email]
  );

  return result.rows[0];
};

const createuser = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string
) => {
    const result = await pool.query(`
        INSERT INTO users (name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role
        `,[name,email,password,phone,role])

        return result;
};

export const authService = {
  findByEmail,
  createuser,
};
