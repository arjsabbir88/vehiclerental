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

const getSingleUser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM public_users WHERE id=$1`, [
    id,
  ]);
  return result;
};

const updateUser = async (
  name: string,
  email: string,
  phone: unknown,
  id: string
) => {
  const result = await pool.query(
    `UPDATE users SET name=$1,email=$2,phone=$3 WHERE id=$4 RETURNING id,name,email,phone,role`,
    [name, email, phone, id]
  );

  return result
};

const deleteUser = async(id:string)=>{
    const result = await pool.query(`DELETE FROM users WHERE id=$1`,[id])

    return result
}

export const userService = {
  createUser,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser
};
