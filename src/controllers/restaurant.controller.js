import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  admin.app();
}
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
};
