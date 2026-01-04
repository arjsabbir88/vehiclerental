import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

// vehicle created api only admin
const createVehicle = async (req: Request, res: Response) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    // required fields
    if (
      !vehicle_name ||
      !type ||
      !registration_number ||
      !daily_rent_price ||
      !availability_status
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const allowedTypes = ["car", "bike", "van", "SUV"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle type",
      });
    }

    const result = await vehicleService.createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

// get all vehicle public access
const getAllVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getAllVehicle();

    if (result.rows.length === 0) {
      res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: result.rows,
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

// get vehicle by id public access

const singleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.singleVehicle(req.params.id!);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
        data: result.rows,
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

// update vehicle admine only

const updateVehicle = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  try {
    const result = await vehicleService.updateVehicle(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      req.params.id!
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

// delete vehicle admin only

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.deleteVehicle(req.params.id!);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

export const vehicleController = {
  createVehicle,
  getAllVehicle,
  singleVehicle,
  updateVehicle,
  deleteVehicle
};
