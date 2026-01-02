import { Request, Response } from "express";
import { userService } from "./user.service";

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
    });
  }
};

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
    });
  }
};

export const userController = {
  createUser,
  getUsers,
};
