import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
                  role: "employee",
                  restaurantID: req.body.restaurantID,
                  token: jwt.sign(
                    { username: req.body.username },
                    process.env.TOKEN_KEY,
                    { expiresIn: "2h" }
                  ),
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
    try {
      const user = await db.collection("Users").doc(req.body.username).get();

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
        if (!isMatchPassword) {
          res.status(501).json({
            success: false,
            message: "Incorrect username or password",
          });
        } else {
          const loginToken = jwt.sign(
            { username: req.body.username },
            "secret",
            { expiresIn: "2h" }
          );
          await db
            .collection("Users")
            .doc(req.body.username)
            .update({ token: loginToken });
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
              token: jwt.sign({ username: req.body.username }, "secret", {
                expiresIn: "2h",
              }),
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
  //*Region update user restaurant id
  updateUser: async (req, res) => {
    try {
      const user = await db.collection("Users").doc(req.body.username).get();
      if (user.data() != undefined) {
        await db.collection("Users").doc(req.body.username).update({
          restaurantID: req.body.restaurantID,
        });
        res.status(200).json({
          success: true,
          message: "User updated",
        });
      } else {
        res.status(501).json({
          success: false,
          message: "User not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  },
  //*End Region
  //* Region check if user has restaurant
  hasNoRestaurant: async (req, res) => {
    try {
      const user = await db.collection("Users").doc(req.body.username).get();
      console.log(user.data());
      if (!user) {
        res.status(501).json({
          success: false,
          message: "User not found",
        });
      } else {
        if (user.data().restaurantID == null) {
          res.status(200).json({
            success: true,
            message: "User has no restaurant",
          });
        } else {
          res.status(200).json({
            success: false,
            message: "User has restaurant",
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
  //*Region change password
  changePassword: async (req, res) => {
    try {
      const user = await db.collection("Users").doc(req.body.username).get();
      console.log(user.data());
      if (!user) {
        res.status(501).json({
          success: false,
          message: "User not found",
        });
      } else {
        const isMatchPassword = await bcrypt.compare(
          req.body.oldPassword,
          user.data().password
        );
        if (!isMatchPassword) {
          res.status(501).json({
            success: false,
            message: "Incorrect password",
          });
        } else {
          if (req.body.newPassword === req.body.confirmPassword) {
            const isValidPassword = validator.isLength(
              req.body.newPassword,
              8,
              30
            );
            const isValidPassword1 = validator.isLength(
              req.body.confirmPassword,
              8,
              30
            );

            if (!isValidPassword || !isValidPassword1) {
              res.status(501).json({
                success: false,
                message: "Password length must from 8 to 30 characters",
              });
            }
            console.log(req.body.newPassword + ". " + req.body.confirmPassword);
            const bcryptPassword = await bcrypt.hash(
              req.body.confirmPassword,
              10
            );
            console.log(bcryptPassword);
            await db.collection("Users").doc(req.body.username).update({
              password: bcryptPassword,
            });
            console.log("OK");
            res
              .status(200)
              .json({ success: true, message: "Password changed" });
          } else {
            res.status(501).json({
              success: false,
              message: "Password confirm not match",
            });
          }
        }
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  },
  //*End Region
  //*Region forgot password
  // forgotPassword: async (req, res) => {
  //   try {
  //     const user = await db.collection("Users").doc(req.body.username).get();
  //     const {username, email, password} = req.body;
  //     console.log(user.data());
  //     if (!user) {
  //       res.status(501).json({
  //         success: false,
  //         message: "User not found",
  //       });
  //     } else {
  //       const token = jwt.sign
  //     }
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: error,
  //     });
  //   }
  //*Get all account of restaurant
  getAllUser: async (req, res) => {
    try {
      const user = db.collection("Users");
      const snapshot = await user
        .where("restaurantID", "==", req.body.restaurantID)
        .get();
      snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
      res.status(200).json({
        success: true,
        message: snapshot,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  },
  //*End Region
};
