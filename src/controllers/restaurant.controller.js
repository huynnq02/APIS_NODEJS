import admin from "firebase-admin";
import { get } from "http";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };

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
export const RestaurantController = {
  //*Create New Restaurant
  createRestaurant: async (req, res) => {
    const data = {
      id: req.body.id,
      name: req.body.name,
      address: req.body.address,
      hotline: req.body.hotline,
    };
    try {
      await db.collection("Restaurants").doc(req.body.id).set(data);
      res.status(200).json({
        success: true,
        message: "Restaurant created",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error when create restaurant",
      });
    }
  },
  //*End region

  //*Delete Restaurant
  deleteRestaurant: async (req, res) => {
    try {
      // let restaurant = await db
      //   .collection("Restaurants")
      //   .doc(req.params.id)
      //   .get();
      // let restaurant = await db
      //   .collection("Restaurants")
      //   .where("id", "==", req.params.id)
      //   .get();
      // restaurant
      //   .then(function (doc) {
      //     if (doc.exists) {
      //       console.log("Document data:", doc.data());
      //     } else {
      //       // doc.data() will be undefined in this case
      //       console.log("No such document!");
      //     }
      //   })
      //   .catch(function (error) {
      //     console.log("Error getting document:", error);
      //   });
      // if (!restaurant.data()) {
      //   res.status(500).json({
      //     success: false,
      //     message: "Restaurant not found",
      //   });
      // }
      let restaurant = await db
        .collection("Restaurants")
        .doc(req.params.id)
        .get();
      if (!restaurant.data()) {
        res
          .status(500)
          .json({ success: false, message: "Invalid restaurant id" });
      } else {
        var count = 0;
        if (true) {
          await db
            .collection("Restaurants")
            .where("id", "==", req.params.id)
            .get()
            .then((res) =>
              res.forEach((element) => element.ref.delete().then(count++))
            );
          // delete all menu of restaurant
          await db
            .collection("Menu")
            .where("restaurantID", "==", req.params.id)
            .get()
            .then((res) => res.forEach((element) => element.ref.delete()));
          // delete all table of restaurant
          await db
            .collection("Table")
            .where("restaurantID", "==", req.params.id)
            .get()
            .then((res) => res.forEach((element) => element.ref.delete()));
          if (count != 0) {
            res
              .status(200)
              .json({ success: true, message: "Restaurant deleted " });
          }
        }

        // if count = 0 then no restaurant was deleted
        if (count == 0) {
          res
            .status(500)
            .json({ success: false, message: "Restaurant not found" });
        }
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: "false", message: "Error when delete restaurant" });
    }
  },
  //*End region

  //*Update Restaurant
  updateRestaurant: async (req, res) => {
    let user = await db.collection("Users").doc(req.params.username).get();
    if (!user.data()) {
      res.status(500).json({
        success: false,
        message: "User not found",
      });
    }
    let restaurantDocument = db.collection("Restaurants").doc(user.data().restaurantID);
    return restaurantDocument
      .set({
        name: req.body.name,
        address: req.body.address,
        hotline: req.body.hotline,
        imagePath: req.body.imagePath,
      }, { merge: true })
      .then(() => {
        return res
          .status(200)
          .json({ success: true, message: "Restaurant updated" });
      })
      .catch(() => {
        return res
          .status(500)
          .json({ success: false, message: "Error when update restaurant" });
      });
  },
  //*End region
  //*Region check if restaurant exists
  checkRestaurantNotExists: async (req, res) => {
    try {
      console.log(req.body.id);
      const restaurant = await db
        .collection("Restaurants")
        .doc(req.body.id)
        .get();
      console.log(restaurant.data());
      if (!restaurant.data()) {
        res
          .status(200)
          .json({ success: true, message: "Restaurant not found" });
      } else {
        res.status(201).json({ success: false, message: "Restaurant found" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Error when check restaurant" });
    }
  },

  //*End region
};
