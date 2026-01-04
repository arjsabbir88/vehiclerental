import { Request, Response } from "express";
import { userService } from "./user.service";

// this is create user api and this api public
const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

// get all user from the db and this api only for admin
const getUsers = async (req: Request, res: Response) => {
  try {
    const getUsers = await userService.getUsers();

    if (getUsers.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "No user found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User founded",
      data: getUsers.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getSingleUser(req.params.id!);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
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

const updateUser = async (req: Request, res: Response) => {
  const { name, email, phone } = req.body;


  try {
    const result = await userService.updateUser(
      name,
      email,
      phone,
      req.params.id!
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
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

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.deleteUser(id!);

  if (result.rowCount === 0) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
  success: true,
  message: "User deleted successfully"
});
};

export const userController = {
  createUser,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser
};
