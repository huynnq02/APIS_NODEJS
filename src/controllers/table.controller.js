import admin from "firebase-admin";
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
export const TableController = {
  //*Create new table
  createTable: async (req, res) => {
    const data = {
      id: req.body.id,
      size: req.body.size,
      condition: req.body.condition,
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
            await db.collection("Table").doc(req.body.id).set(data);
            res.status(200).json({
              success: true,
              message: "Table created",
            });
          } catch (err) {
            res.status(500).json({
              success: false,
              message: "Error when create table",
            });
          }
        }
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "Error when create table",
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error when create table",
      });
    }
  },
  //*End region
  //*Update table
  updateTable: async (req, res) => {
    let table = db.collection("Table").doc(req.params.id);
    return table
      .update({
        size: req.body.size,
        condition: req.body.condition,
        restaurantID: req.params.restaurantID,
      })
      .then(() => {
        return res
          .status(200)
          .json({ success: true, message: "Table updated" });
      })
      .catch(() => {
        return res
          .status(500)
          .json({ success: false, message: "Error when update Table" });
      });
  },
  //*End region
  //*Delete table
  deleteTable: async (req, res) => {
    try {
      let table = await db.collection("Table").doc(req.params.id).get();
      if (!table.data()) {
        res.status(500).json({ success: false, message: "Invalid table id" });
      } else {
        await db.collection("Table").doc(req.params.id).delete();
        res.status(200).json({ success: true, message: "Table deleted" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Error when delete table" });
    }
  },
  //*End region
  //*Get all table
  getAllTable: async (req, res) => {
    try {
      const snapshot = await db
        .collection("Table")
        .where("restaurantID", "==", req.params.restaurantID)
        .get();
      snapshot.forEach((table) => {
        console.log(table.id, "=>", table.data());
      });
      res.status(200).json({ success: true, message: "Got all table" });
    } catch (err) {
      res
        .status(500)
        .json({ success: "false", message: "Error when get all table" });
    }
  },
  //*End region
};
