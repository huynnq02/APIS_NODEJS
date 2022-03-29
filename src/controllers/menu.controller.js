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
  //*Update menu
  updateMenu: async (req, res) => {
    let menuDocument = db.collection("Menu").doc(req.params.id);
    return menuDocument
      .update({
        id: req.body.id,
        name: req.body.name,
      })
      .then(() => {
        return res.status(200).json({ success: true, message: "Menu updated" });
      })
      .catch(() => {
        return res
          .status(500)
          .json({ success: false, message: "Error when update menu" });
      });
  },
  //*End region
  //*Delete menu
  deleteMenu: async (req, res) => {
    let menuDocument = db.collection("Menu").doc(req.params.id);
    return menuDocument
      .delete()
      .then(() => {
        return res.status(204).json({ success: true, message: "Menu deleted" });
      })
      .catch((error) => {
        return res
          .status(500)
          .json({ success: false, message: "Error when delete menu" });
      });
  },
  //*End region
  //*Get all menu
  getAllMenu: async (req, res) => {
    try {
      const snapshot = await db
        .collection("Menu")
        .where("restaurantID", "==", req.params.restaurantID)
        .get();
      snapshot.forEach((menu) => {
        console.log(menu.id, "=>", menu.data());
      });
      res.status(200).json({ success: true, message: "Got all menu" });
      // return snapshot.then(() =>
      //  res.status(200).json({ success: true, message: "Got all menu" } )
      // );
    } catch (err) {
      res
        .status(500)
        .json({ success: "false", message: "Error when get all menu" });
    }
  },
  //*End region
};
