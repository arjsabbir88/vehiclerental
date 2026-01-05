import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  console.log({ payload: payload });

  const vehicleRes = await pool.query(
    `
    SELECT vehicle_name,daily_rent_price FROM vehicle WHERE id=$1
    
    `,
    [vehicle_id]
  );

  console.log({ vehicleRes: vehicleRes });

  if (vehicleRes.rowCount === 0) {
    return { success: false, message: "No vehicles found" };
  }

  const { daily_rent_price } = vehicleRes.rows[0];

  const days =
    (new Date(rent_end_date as any).getTime() -
      new Date(rent_start_date as any).getTime()) /
    (1000 * 60 * 60 * 24);

  const total_price = days * daily_rent_price;

  console.log("total_price", total_price);

  const bookingRes = await pool.query(
    `
    INSERT INTO booking (
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status
    )
    VALUES ($1,$2,$3,$4,$5,'active')
    RETURNING *
    `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  console.log("bookig", bookingRes.rows[0]);

  return {
    success: true,
    ...bookingRes.rows[0],
    vehicle: vehicleRes.rows[0],
  };
};

const getBooking = async () => {
  const result = await pool.query(`
    SELECT * FROM booking
    `);
  return result;
};

const findBookingById = async (id: string) => {
  const result = await pool.query(`SELECT * FROM booking WHERE id=$1`, [id]);

  return result;
};

const updateBooking = async (id: string) => {
  const result = await pool.query(
    `UPDATE booking SET status ='cancelled' WHERE id=$1 RETURNING *`,
    [id]
  );

  return result;
};

const adminUpdateBooking = async (id: string) => {
  const result = await pool.query(
    `UPDATE booking SET status='returned' WHERE id=$1 RETURNING status`,
    [id]
  );

  return result;
};

const updateVehicle = async (id: any) => {
  const result = await pool.query(
    `UPDATE vehicle SET availability_status = 'available' WHERE id=$1 RETURNING availability_status`,
    [id]
  );

  return result;
};

export const bookingService = {
  createBooking,
  getBooking,
  findBookingById,
  updateBooking,
  adminUpdateBooking,
  updateVehicle
};
