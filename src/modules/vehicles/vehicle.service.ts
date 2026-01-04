import { pool } from "../../config/db";

// this api only for admin
const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `
        INSERT INTO vehicle(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING id,vehicle_name,type,registration_number,daily_rent_price,availability_status
        `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result;
};

// this api only for public
const getAllVehicle = async () => {
  const result = await pool.query(`
      SELECT * FROM vehicle
    `);

  return result;
};

// get single vehicle by id public access

const singleVehicle = async (id: string) => {
  const result = await pool.query(
    `
     SELECT * FROM vehicle WHERE id=$1
    `,
    [id]
  );

  return result;
};

// update api only for admin

const updateVehicle = async (
  vehicle_name: string,
  type: string,
  registration_number: string,
  daily_rent_price: number,
  availability_status: string,
  id: string
) => {
  const result = await pool.query(
    `
    UPDATE vehicle SET vehicle_name=$1,type=$2,registration_number=$3,daily_rent_price=$4,availability_status=$5 WHERE id=$6 RETURNING id,vehicle_name,type,registration_number,daily_rent_price,availability_status
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      id,
    ]
  );

  return result
};

const deleteVehicle = async(id:string)=>{
  const result = await pool.query(`DELETE FROM vehicle WHERE id=$1`,[id])

  return result
}

export const vehicleService = {
  createVehicle,
  getAllVehicle,
  singleVehicle,
  updateVehicle,
  deleteVehicle
};
