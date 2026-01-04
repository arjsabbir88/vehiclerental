import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {

  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  console.log(payload)

  const vehicleRes = await pool.query(
    `
    SELECT vehicle_name,daily_rent_price FROM vehicle WHERE id=$1
    
    `,
    [vehicle_id]
  );

  console.log(vehicleRes.rows[0])

  if (vehicleRes.rowCount === 0) {
    return { success: false, message: "No vehicles found" };
  }

  const { daily_rent_price } = vehicleRes.rows[0];

  const days =
  (new Date(rent_end_date as any).getTime() -
   new Date(rent_start_date as any).getTime()) /
  (1000 * 60 * 60 * 24);

    console.log("days", days)

  const total_price = days * daily_rent_price;

  console.log("total_price",total_price)

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

  console.log("bookig",bookingRes.rows[0])

  return {
    ...bookingRes.rows[0],
    vehicle: vehicleRes.rows[0],
  };
};

export const bookingService = {
  createBooking,
};
