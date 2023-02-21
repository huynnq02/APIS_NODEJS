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
      const restaurant = await db
        .collection("Restaurants")
        .doc(req.params.restaurantID)
        .get();
      if (!restaurant.data()) {
        return res
          .status(202)
          .json({ success: false, message: "Restaurant not found" });
      }
      const restaurantRef = db
        .collection("Restaurants")
        .doc(req.params.restaurantID)
        .collection("Food");
      const snapshot = await restaurantRef
        .where("name", "==", req.body.name)
        .get();
      if (!snapshot.empty) {
        return res
          .status(202)
          .json({ success: false, message: "This food already existed" });
      }
      const data = {
        name: req.body.name,
        price: req.body.price,
        imagePath: req.body.imagePath,
        foodType: req.body.foodType,
        discount: req.body.discount,
        restaurantID: req.params.restaurantID,
      };
      await db
        .collection("Restaurants")
        .doc(req.params.restaurantID)
        .collection("Food")
        .doc(req.body.name)
        .set(data);
      return res.status(200).json({ success: true, message: "Food added" });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error when create food" });
    }
  },
  //*End region
  //*Update menu
  updateFood: async (req, res) => {
    try {
      const tableRef = await db
        .collection("Restaurants")
        .doc(req.params.restaurantID)
        .collection("Food")
        .doc(req.body.oldFoodName)
        .get();
      if (!tableRef.data()) {
        return res
          .status(202)
          .json({ success: false, message: "Can not find this food" });
      }
      await db
        .collection("Restaurants")
        .doc(req.params.restaurantID)
        .collection("Food")
        .doc(req.body.foodName)
        .set({
          ...tableRef.data(),
          name: req.body.foodName,
          price: req.body.price,
          discount: req.body.discount,
          imagePath: req.body.imagePath,
        });
      await db
        .collection("Restaurants")
        .doc(req.params.restaurantID)
        .collection("Food")
        .doc(req.body.oldFoodName)
        .delete();
      return res.status(200).json({ success: true, message: "Food updated" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Error when create Food" });
    }
  },
  //*End region
  //*Delete food
  deleteFood: async (req, res) => {
    try {
      let table = await db
        .collection("Restaurants")
        .doc(req.params.restaurantID)
        .collection("Food")
        .doc(req.body.foodName)
        .get();
      if (!table.data()) {
        res
          .status(202)
          .json({ success: false, message: "Can not find this food" });
      } else {
        await db
          .collection("Restaurants")
          .doc(req.params.restaurantID)
          .collection("Food")
          .doc(req.body.foodName)
          .delete();
        res.status(200).json({ success: true, message: "Food deleted" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Error when delete food" });
    }
  },

  //*End region
  //*Get all food of restaurant
  getAllFoodOfRestaurant: async (req, res) => {
    try {
      const snapshot = await db
        .collection("Restaurants")
        .doc(req.params.restaurantID)
        .collection("Food")
        .get();
      const foodArray = snapshot.docs.map((doc) => doc.data());
      if (!snapshot.empty) {
        return res.status(200).json({
          success: true,
          message: "Get all food of restaurant",
          data: foodArray,
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
      var foods = [];
      const foodQuery = await db
        .collection("Restaurants")
        .doc(req.params.restaurantID)
        .collection("Food")
        .where("foodType", "==", req.body.foodType)
        .get();
      if (!foodQuery.empty) {
        foodQuery.forEach((doc) => {
          foods.push(doc.data());
        });
        return res.status(200).json({ success: true, message: foods });
      }
      return res.status(202).json({ success: false, message: "No food found" });
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
