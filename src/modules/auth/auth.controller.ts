import { Request, Response } from "express";
import { authService } from "./auth.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const signup = async (req: Request, res: Response) => {
  console.log(req.body);
  const { name, email, password, phone, role } = req.body;

  try {
    const existingUser = await authService.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await authService.createuser(
      name,
      email,
      hashedPassword,
      phone,
      role
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password required",
    });
  }
  try {
    const existsUser = await authService.findByEmail(email.toLowerCase());

    if (!existsUser) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    const isMatch = await bcrypt.compare(password, existsUser.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // now create the jwt token

    const token = jwt.sign(
      {
        id: existsUser.id,
        name: existsUser.name,
        email: existsUser.email,
        role: existsUser.role,
      },
      config.jwtSecret as string,
      { expiresIn: "7d" }
    );

    console.log(token);

    res.status(200).json({
      success: true,
      message: "User login successfully",
      data: {
        token,
        user: {
          id: existsUser.id,
          name: existsUser.name,
          email: existsUser.email,
          phone: existsUser.phone,
          role: existsUser.role,
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const authController = {
  signup,
  signin,
};
