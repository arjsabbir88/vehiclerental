import express, { Request, Response } from "express";
import cors from "cors";
import initDB from "./config/db";
import { userRouter } from "./modules/users/user.routes";
import { vehicleRouter } from "./modules/vehicles/vehicle.routes";
import { bookingRouter } from "./modules/booking/booking.route";
import { authRouter } from "./modules/auth/auth.route";
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

// all crud operation for vehicle
app.use("/api/v1/vehicles",vehicleRouter.router)

//crud operation for crud
app.use("/api/v1/bookings", bookingRouter.router)

// auth login and signin 
app.use("/api/v1/auth",authRouter.router)

// this is root path respons on server
app.get("/", (req: Request, res: Response) => {
  res.send("vehicle rental projects server is running");
});

export default app;
