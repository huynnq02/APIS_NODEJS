import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };
import dotenv from "dotenv";

dotenv.config();
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
const storage = admin.storage();
//*End region
export const FoodController = {
  //*Create new menu
  uploadFoodImage: async (req, res) => {
   
  },
  addFood: async (req, res) => {
    const data = {
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      menuID: req.body.menuID,
    };
    try {
      var flag = true;
      for (let i = 0; i < req.body.menuID.length; i++) {
        console.log(req.body.menuID[i]);
        let menu = await db.collection("Menu").doc(req.body.menuID[i]).get();
        console.log(menu.data());
        if (!menu.data()) {
          res.status(501).json({
            success: false,
            message: "Invalid Menu ID",
          });
          flag = false;
          break;
        }
      }
      if (flag == true) {
        await db.collection("Food").doc(req.body.id).set(data);
        res.status(200).json({ success: true, message: "Food added" });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error when add food",
      });
    }
  },
  //*End region
  //*Update menu
  updateFood: async (req, res) => {
    // try {
    //   let food = await db.collection("Food").doc(req.params.id).get();
    //   if (!food.data()) {
    //     res.status(500).json({ success: false, message: "Invalid food id" });
    //   } else {
    //     db.collection("Food").doc(req.params.id).get().update({
    //       name: req.body.name,
    //       price: req.body.price,
    //       menuID: req.body.menu,
    //     });
    //     res.status(200).json({ success: true, message: "Food updated" });
    //   }
    // } catch (err) {
    //   res
    //     .status(500)
    //     .json({ success: false, message: "Error when update food" });
    // }
    let foodDocument = db.collection("Food").doc(req.params.id);
    return foodDocument
      .update({
        name: req.body.name,
        price: req.body.price,
        menuID: req.body.menuID,
      })
      .then(() => {
        return res.status(200).json({ success: true, message: "Food updated" });
      })
      .catch(() => {
        return res
          .status(500)
          .json({ success: false, message: "Error when update food" });
      });
  },
  //*End region
  //*Delete food
  deleteFood: async (req, res) => {
    try {
      let food = await db.collection("Food").doc(req.params.id).get();
      if (!food.data()) {
        res.status(500).json({ success: false, message: "Invalid food id" });
      } else {
        await db.collection("Food").doc(req.params.id).delete();
        res.status(200).json({ success: true, message: "Food deleted" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Error when delete food" });
    }
    // return menuDocument
    //   .delete()
    //   .then(() => {
    //     return res.status(204).json({ success: true, message: "Food deleted" });
    //   })
    //   .catch((error) => {
    //     return res
    //       .status(500)
    //       .json({ success: false, message: "Error when delete food" });
    //   });
  },

  //*End region
  //*Get all food of restaurant
  getAllFoodOfRestaurant: async (req, res) => {
    try {
      var foods = [];
      const menu = await db
        .collection("Menu")
        .where(restaurantID, "==", req.params.restaurantID)
        .get();
      menu.forEach((tempMenu) => {
        console.log(tempMenu.id, "=>", tempMenu.data());
        let foodQuery = db
          .collection("Food")
          .where("tableID", "==", tempMenu.id)
          .get();
        foodQuery.then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            foods.push(doc.data());
          });
        });
      });
      res
        .status(200)
        .json({ success: true, message: "Got all food of a restaurant" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Error when get all food" });
    }
  },
  //*End region
  //*Get all food of restaurant
  getAllFoodOfMenu: async (req, res) => {
    try {
      var foods = [];
      let foodQuery = db
        .collection("Food")
        .where("tableID", "==", req.params.tableID)
        .get();
      foodQuery.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          foods.push(doc.data());
        });
      });
      res
        .status(200)
        .json({ success: true, message: "Got all food of a restaurant" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Error when get all food" });
    }
  },
  //*End region
};
