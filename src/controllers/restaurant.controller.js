import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
export const RestaurantController = {
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
  deleteRestaurant: async (req, res) => {
    userDocument = db.collection("Restaurants").doc(req.params.id);
    return userDocument
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
  updateRestaurant: async (req, res) => {
    userDocument = db.collection("Restaurants").doc(req.params.id);
    return userDocument
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
};
