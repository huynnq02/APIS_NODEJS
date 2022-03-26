import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };
import validator from "validator";
import bcrypt from "bcrypt";

//*Region connect to database
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  admin.app();
}
const db = admin.firestore();
//*End region
export const AuthController = {
  //*Create Employee Account by Owner API
  createUser: async (req, res) => {
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
            const isValidPassword = validator.isLength(
              req.body.password,
              8,
              30
            );
            if (!isValidPassword) {
              res.status(501).json({
                success: false,
                message: "Password length must from 8 to 30 characters",
              });
            }
            const isValidPhoneNumber = validator.isNumeric(
              req.body.phoneNumber
            );
            if (!isValidPhoneNumber) {
              res.status(501).json({
                success: false,
                message: "Invalid phonenumber",
              });
            }
            if (isValidPassword && isValidPhoneNumber) {
              await db
                .collection("Users")
                .doc(req.body.username)
                .set({
                  fullname: req.body.fullname,
                  phoneNumber: req.body.phoneNumber,
                  username: req.body.username,
                  password: await bcrypt.hash(req.body.password, 10),
                  role: "owner",
                });
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
      console.log(user.data());
      if (!user) {
        res.status(501).json({
          success: false,
          message: "User not found",
        });
      } else {
        const isMatchPassword = await bcrypt.compare(
          req.body.password,
          user.data().password
        );
        console.log(isMatchPassword);
        if (!isMatchPassword) {
          res.status(501).json({
            success: false,
            message: "Incorrect username or password",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "User Logged in",
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
    try {
      const user = await db.collection("Users").doc(req.body.username).get();
      console.log(user.data());
      if (user.data() != undefined) {
        res.status(501).json({
          success: false,
          message: "Username existed",
        });
      } else {
        const isValidPassword = validator.isLength(req.body.password, 8, 30);
        if (!isValidPassword) {
          res.status(501).json({
            success: false,
            message: "Password length must from 8 to 30 characters",
          });
        }
        const isValidPhoneNumber = validator.isNumeric(req.body.phoneNumber);
        if (!isValidPhoneNumber) {
          res.status(501).json({
            success: false,
            message: "Invalid phonenumber",
          });
        }
        if (isValidPassword && isValidPhoneNumber) {
          await db
            .collection("Users")
            .doc(req.body.username)
            .set({
              fullname: req.body.fullname,
              phoneNumber: req.body.phoneNumber,
              username: req.body.username,
              password: await bcrypt.hash(req.body.password, 10),
              role: "owner",
            });
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

  //Update User Information
};
