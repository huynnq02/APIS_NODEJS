import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//*Region connect to database
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_URL,
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
      const user = await db.collection("Users").doc(req.body.username).get();
      const owner = await db
        .collection("Users")
        .doc(req.params.usernameOwner)
        .get();
      console.log(user.data());
      console.log(owner.data());
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

        if (isValidPassword) {
          await db
            .collection("Users")
            .doc(req.body.username)
            .set({
              username: req.body.username,
              password: await bcrypt.hash(req.body.password, 10),
              role: req.body.role,
              restaurantID: owner.data().restaurantID,
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
            role: user.data().role,
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
        return res.status(501).json({
          success: false,
          message: "User not found",
        });
      } else {
        const isMatchPassword = await bcrypt.compare(
          req.body.oldPassword,
          user.data().password
        );
        console.log("Matched Password:" + isMatchPassword);
        if (!isMatchPassword) {
          return res.status(501).json({
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
              return res.status(501).json({
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
            return res
              .status(200)
              .json({ success: true, message: "Password changed" });
          } else {
            return res.status(501).json({
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
  forgotPassword: async (req, res) => {
    try {
      console.log(req.body.phoneNumber);
      const userlists = db.collection("Users");
      const query = await userlists
        .where("phoneNumber", "==", req.body.phoneNumber)
        .get();
      if (query.empty) {
        console.log("No matching documents.");
        res.status(501).json({
          success: false,
          message: "User not found",
        });
        return;
      }
      query.forEach(async (doc) => {
        const isValidPassword = validator.isLength(req.body.newPassword, 8, 30);
        if (!isValidPassword) {
          res.status(501).json({
            success: false,
            message: "Password length must from 8 to 30 characters",
          });
          return;
        }
        console.log(doc.id, "=>", doc.data());
        const user = await db.collection("Users").doc(doc.id).get();
        const token = jwt.sign(
          { username: user.data().username },
          "secret",
          {}
        );
        await db
          .collection("Users")
          .doc(doc.id)
          .update({
            token: token,
            password: await bcrypt.hash(req.body.newPassword, 10),
          });
        res.status(200).json({
          success: true,
          message: "Password reseted",
        });
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error,
      });
    }

    //   const query = user.where("phoneNumber", "==", req.body.phoneNumber);
    //   console.log(query.data());
    //   if (!query) {
    //     res.status(501).json({
    //       success: false,
    //       message: "User not found",
    //     });
    //   } else {
    //     const isValidPassword = validator.isLength(req.body.newPassword, 8, 30);
    //     if (!isValidPassword) {
    //       res.status(501).json({
    //         success: false,
    //         message: "Password length must from 8 to 30 characters",
    //       });
    //     }
    //     user.update({
    //       password: await bcrypt.hash(req.body.newPassword, 10),
    //     });
    //     res.status(200).json({ success: true, message: "Password changed" });
    //   }
    // } catch (error) {
    //   res.status(500).json({
    //     success: false,
    //     message: error,
    //   });
    // }
  },
  //*End Region

  //*Get all account of restaurant
  getAllUser: async (req, res) => {
    try {
      const user = await db.collection("Users").doc(req.params.username).get();
      console.log(user.data());
      if (!user) {
        res.status(501).json({
          success: false,
          message: "User not found",
        });
        return;
      }
      const snapshot = await db
          .collection("Users")
          .where("restaurantID", "==", user.data().restaurantID)
          .get();
          res.status(200).json({
            success: true,
            message: snapshot.docs.map((doc) => doc.data()),
          });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  },
  checkPhoneNumberInfo: async (req, res) => {
    try {
      const user = db.collection("Users");
      const snapshot = await user
        .where("phoneNumber", "==", req.params.phoneNumber)
        .get();
      if (snapshot.empty) {
        res.status(200).json({
          success: true,
          message: "PhoneNumber available",
        });
      } else {
        res.status(501).json({
          success: false,
          message: "PhoneNumber already exists",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  },
  checkUsernameInfo: async (req, res) => {
    try {
      const user = await db.collection("Users").doc(req.params.username).get();
      if (user.data()) {
        res.status(501).json({
          success: false,
          message: "Username already exists",
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Username available",
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
