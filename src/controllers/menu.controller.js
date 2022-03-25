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
export const MenuController = {
  //*Create new menu
  createMenu: async (req, res) => {
    const data = {
      id: req.body.id,
      name: req.body.name,
      restaurantID: req.params.restaurantID,
    };
    try {
      try {
        const restaurant = await db
          .collection("Restaurants")
          .doc(req.params.restaurantID)
          .get();
        if (!restaurant.data()) {
          res.status(501).json({
            success: false,
            message: "Invalid Restaurant ID",
          });
        } else {
          try {
            await db.collection("Menu").doc(req.body.id).set(data);
            res.status(200).json({
              success: true,
              message: "Menu created",
            });
          } catch (err) {
            res.status(500).json({
              success: false,
              message: "Error when create menu",
            });
          }
        }
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "Error when create menu",
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error when create menu",
      });
    }
  },
  //*End region
};
