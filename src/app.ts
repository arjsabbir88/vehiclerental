import express, { Request, Response } from "express";
import cors from "cors";
import initDB, { pool } from "./config/db";
import { userController } from "./modules/users/user.controller";
import { userRouter } from "./modules/users/user.routes";
const app = express();

// this is cors middleware right allaw all query
app.use(cors());

// this is body parser
app.use(express.json());

initDB();

// created user in db
// app.use("/api/v1/auth/signup", userRouter.router);

// get all user from the db and this is admin accessable api
app.use("/api/v1/users", userRouter.router);

// this is root path respons on server
app.get("/", (req: Request, res: Response) => {
  res.send("vehicle rental projects server is running");
});

export default app;
