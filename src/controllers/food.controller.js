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
  addFood: async (req, res) => {
    try {
      console.log(req.params.username);
      const User = await db.collection("Users").doc(req.params.username).get();
      if (!User) {
        res.status(202).json({
          success: false,
          message: "User not found",
        });
        return;
      }
      const restaurant = await db
        .collection("Restaurants")
        .doc(User.data().restaurantID)
        .get();
      console.log(restaurant.data());
      if (!restaurant.data()) {
        res.status(202).json({
          success: false,
          message: "Restaurant not found",
        });
        return;
      }

      const tempID =
        User.data().restaurantID + "_" + req.body.name.replace(/\s/g, "");
      console.log(tempID);
      const data = {
        id: tempID,
        name: req.body.name,
        price: req.body.price,
        restaurantID: User.data().restaurantID,
        foodType: req.body.foodType,
        discount: req.body.discount,
        imagePath: req.body.imagePath,
      };
      await db.collection("Food").doc(tempID).set(data);
      return res
        .status(200)
        .json({ success: true, message: "Add food success" });
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
        res.status(202).json({ success: false, message: "Invalid food id" });
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
      const user = await db.collection("Users").doc(req.body.username).get();
      console.log(user.data());
      const food = await db.collection("Food");
      const snapshot = await food
        .where("restaurantID", "==", user.data().restaurantID)
        .get();
      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          console.log(doc.data());
        });
        var foodArray = [];
        console.log("ok1");
        // conver snapshot to array
        snapshot.forEach((doc) => {
          foodArray.push(doc.data());
        });
        console.log(foodArray);
        console.log("ok2");

        return res.status(200).json({
          success: true,
          message: foodArray,
        });
      }
      return res.status(202).json({
        success: false,
        message: "No food found",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error when get all food of restaurant",
      });
    }
  },
  //*End Region
  //*Get all food with type
  getAllFoodWithType: async (req, res) => {
    try {
      const user = await db.collection("Users").doc(req.body.username).get();
      console.log(user.data());
      if (user.data()) {
        var foods = [];
        const foodQuery = await db
          .collection("Food")
          .where("restaurantID", "==", user.data().restaurantID)
          .where("foodType", "==", req.body.foodType)
          .get();
        if (!foodQuery.empty) {
          console.log("OK2");
          foodQuery.forEach((doc) => {
            foods.push(doc.data());
          });
          console.log(foods);
          return res.status(200).json({ success: true, message: foods });
        }
        return res
          .status(202)
          .json({ success: false, message: "No food found" });
      }
      return res.status(202).json({ success: false, message: "No user found" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Error when get all food" });
    }
  },
  //*End region
  //* Region of food discount
  foodDiscount: async (req, res) => {
    try {
      const food = await db.collection("Food").doc(req.body.id).get();
      console.log(food.data());
      if (food.data()) {
        console.log(req.body.discount);
        if (req.body.discount > 0) {
          console.log("OK1");
          const newPrice =
            food.data().price -
            (food.data().price * food.data().discount) / 100;
          await db.collection("Food").doc(req.body.id).update({
            discount: req.body.discount,
            price: newPrice,
          });
          console.log(newPrice);
          console.log("OK2");
          return res
            .status(200)
            .json({ success: true, message: "Food discount" });
        } else if (req.body.discount == 0) {
          const basePrice =
            (food.data().price * 100) / (100 - food.data().discount);
          await db.collection("Food").doc(req.body.id).update({
            discount: req.body.discount,
            price: basePrice,
          });
          return res
            .status(200)
            .json({ success: true, message: "Food discount" });
        }
      }
      return res.status(202).json({ success: false, message: "No food found" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Error when update food discount" });
    }
  },

  //*End region
};
