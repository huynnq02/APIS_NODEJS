import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };

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
export const RestaurantController = {
  //*Create New Restaurant
  createRestaurant: async (req, res) => {
    const data = {
      id: req.body.id,
      name: req.body.name,
      address: req.body.address,
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
    restaurantDocument = db.collection("Restaurants").doc(req.params.id);
    return restaurantDocument
      .delete()
      .then(() => {
        return res
          .status(204)
          .json({ success: true, message: "Restaurant deleted" });
      })
      .catch((error) => {
        return res
          .status(500)
          .json({ success: false, message: "Error when delete restaurant" });
      });
  },
  //*End region

  //*Update Restaurant
  updateRestaurant: async (req, res) => {
    restaurantDocument = db.collection("Restaurants").doc(req.params.id);
    return restaurantDocument
      .update({
        id: req.body.id,
        name: req.body.name,
        address: req.body.address,
      })
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
};
