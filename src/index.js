//#region import package
import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import { specs } from "./utils/docs.js";
import http from "http";
//#end region

//#region import router
import exampleRoutes from './routers/example.router.js';

//

//#region initialize server
const app = express(); 
const server = http.createServer(app);
dotenv.config();
//#end region

//#region setup middleware
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
//#end region

//#region setup router
app.use('/test', exampleRoutes);
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
  
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server API listening at http://localhost:${port}`);
  });
//#end region 

//#server testing region
// app.get('/test',(req,res)=>{
//   res.send('Success')
// });

//#end region