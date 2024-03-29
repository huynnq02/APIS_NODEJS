//#region import package
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import { specs } from "./utils/docs.js";
import http, { get } from "http";
import admin from "firebase-admin";
import cookieparser from "cookie-parser";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

//#end region

//#region import router
import exampleRoutes from "./routers/example.router.js";
import authRouters from "./routers/auth.router.js";
import restaurantRouters from "./routers/restaurant.router.js";
import profileRouters from "./routers/profile.router.js";
import menuRouters from "./routers/menu.router.js";
import foodRouters from "./routers/food.router.js";
import otpRouters from "./routers/otp.router.js";
import tableRouters from "./routers/table.router.js";
import orderRouters from "./routers/order.router.js";
import billRouters from "./routers/bill.router.js";
import orderInfoRouters from "./routers/orderInfo.router.js";
//#region initialize server and database
const app = express();
const server = http.createServer(app);
dotenv.config();
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_URL,
  });
} else {
  admin.app();
}

//#end region

//#region setup middleware
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieparser());

//#end region

//#region setup router
app.use("/api/test", exampleRoutes);
app.use("/api/auth", authRouters);
app.use("/api/restaurant", restaurantRouters);
app.use("/api/profile", profileRouters);
app.use("/api/menu", menuRouters);
app.use("/api/food", foodRouters);
app.use("/api/otp", otpRouters);
app.use("/api/table", tableRouters);
app.use("/api/order", orderRouters);
app.use("/api/bill", billRouters);
app.use("/api/orderInfo", orderInfoRouters);

//#end region

//#region start server
// app.use((req, res, next) => {
//     const error = new Error("NOT FOUND!");
//     error.status = 403;
//     next(error);
//   });

//   app.use((error, req, res, next) => {
//     res.status(error.status || 500);
//     res.send({
//       msg: "INVALID DATA!",
//       detail: error.message,
//     });
//   });

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Our app is running on port ${PORT}`);
});
//#end region
//#server testing region

// let userRef = db.collection('Users');
// userRef.get().then((querySnapshot)=>{
//   querySnapshot.forEach(document=>{
//     console.log(document.data());
//   })
// })

//#end region
