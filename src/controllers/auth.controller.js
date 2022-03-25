import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };
import validator from "validator";

//*Region connect to database
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
//   });
//   const db = admin.firestore();
//*End region
export const AuthController = {
  //*Create Employee Account by Owner API
  createUser: async (req, res) => {
    const data = {
      fullname: req.body.fullname,
      phoneNumber: req.body.phoneNumber,
      username: req.body.username,
      password: req.body.password,
      role: "employee",
    };
    try {
      if (req.params.role == "owner") {
        try {
          const user = await db
            .collection("Users")
            .doc(req.body.username)
            .get();
          console.log(user.data());
          if (user.data() != undefined) {
            res.status(501).json({
              success: false,
              message: "Username existed",
            });
          } else {
            const isValidPhoneNumber = validator.isNumeric(
              req.body.phoneNumber
            );
            if (!isValidPhoneNumber) {
              res.status(501).json({
                success: false,
                message: "Invalid phonenumber",
              });
            } else {
              await db.collection("Users").doc(req.body.username).set(data);
              res.status(200).json({
                success: true,
                message: "User created",
              });
            }
          }
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error,
          });
        }
      } else {
        res.status(501).json({
          success: false,
          message: "You are not authorized",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  },
  //*End region

  //*Login Owner Account API
  loginUser: async (req, res) => {
    const user = await db.collection("Users").doc(req.body.username).get();
    try {
      if (!user) {
        res.status(501).json({
          success: false,
          message: "User not found",
        });
      } else {
        if (req.body.password == user.data().password) {
          res.status(200).json({
            success: true,
            message: "User Logged in",
          });
        } else {
          res.status(501).json({
            success: false,
            message: "Incorrect username or password",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  },
  //*End Region

  //*Region Register Owner Account
  registerUser: async (req, res) => {
    const data = {
      fullname: req.body.fullname,
      phoneNumber: req.body.phoneNumber,
      username: req.body.username,
      password: req.body.password,
      role: "owner",
    };
    try {
      const user = await db.collection("Users").doc(req.body.username).get();
      console.log(user.data());
      if (user.data() != undefined) {
        res.status(501).json({
          success: false,
          message: "Username existed",
        });
      } else {
        const isValidPhoneNumber = validator.isNumeric(req.body.phoneNumber);
        if (!isValidPhoneNumber) {
          res.status(501).json({
            success: false,
            message: "Invalid phonenumber",
          });
        } else {
          await db.collection("Users").doc(req.body.username).set(data);
          res.status(200).json({
            success: true,
            message: "User created",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  },
  //*End Region
};
