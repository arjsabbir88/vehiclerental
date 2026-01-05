import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { pool } from "../../config/db";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.createBooking(req.body);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: "No vehicles found",
      });
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const getBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.getBooking();

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unothorized",
      });
    }

    const bookingData = result.rows;

    const data = [];
    for (const b of bookingData) {
      const customerResult = await pool.query(
        `SELECT name,email FROM public_users WHERE id=$1`,
        [b.customer_id]
      );

      const vehicleResult = await pool.query(
        `
        SELECT vehicle_name,registration_number,type FROM vehicle WHERE id=$1
        `,
        [b.vehicle_id]
      );

      const { vehicle_name, registration_number, type } = vehicleResult.rows[0];

      if (user?.role === "admin") {
        data.push({
          ...b,
          customer: customerResult.rows[0],
          vehicle: {
            vehicle_name: vehicle_name,
            registration_number: registration_number,
          },
        });
      } else {
        data.push({
          ...b,
          vehicle: {
            vehicle_name: vehicle_name,
            registration_number: registration_number,
            type: type,
          },
        });
      }
    }

    if (user.role !== "admin") {
      const customerRes = data.filter((d) => d.customer_id === user.id);

      if (customerRes.length === 0) {
        res.status(404).json({
          success: false,
          message: "No booking data found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Booking retrieved successfully",
        data: customerRes,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking retrived successfully",
      data: data,
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const bookingId = req.params.id;
  const { status } = req.body;

  const user = req.user;

  console.log(user)

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    // find booking
    const bookingRes = await bookingService.findBookingById(bookingId!);


    if (bookingRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking no found",
      });
    }

    const booking = bookingRes.rows[0];

    // customer er jonno update method
    if (user.role === "customer") {
      if (status !== "cancelled") {
        return res.status(403).json({
          success: false,
          message: "Customer can only cancle booking",
        });
      }
      if (booking.customer_id === user.id) {
        return res.status(403).json({
          success: false,
          message: "You can cancle only your own booking",
        });
      }
      const updateBooking = await bookingService.updateBooking(bookingId!);

      return res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: updateBooking.rows[0],
      });
    }

    // admin er jonno update method
    if (user.role === "admin") {
      if (status !== "returned") {
        return res.status(403).json({
          success: false,
          message: "Admin can only mark booking as returned",
        });
      }

      console.log("admin knocked")

      const adminUpdateBooking = await bookingService.adminUpdateBooking(
        bookingId!
      );

      console.log({adminUpdateBooking:adminUpdateBooking.rows})

      const updatedVehicle = await bookingService.updateVehicle(
        booking.vehicle_id
      );


      console.log({updatedVehicle:updatedVehicle.rows})
      return res.status(200).json({
        success: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: {
          ...adminUpdateBooking.rows[0],
          vehicle: updatedVehicle.rows[0],
        },
      });
    }

    return res.status(403).json({
      success: false,
      message: "Invalid role",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

export const bookingController = {
  createBooking,
  getBooking,
  updateBooking
};
