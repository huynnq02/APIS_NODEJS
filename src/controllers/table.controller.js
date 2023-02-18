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
        .collection("Table");
      const snapshot = await restaurantRef
        .where("name", "==", req.body.name)
        .get();
      if (!snapshot.empty) {
        return res
          .status(202)
          .json({ success: false, message: "This table already existed" });
      }
      const data = {
        name: req.body.name,
        isBusy: req.body.isBusy ?? false,
        restaurantID: req.params.restaurantID,
      };
      await db
        .collection("Restaurants")
        .doc(req.params.restaurantID)
        .collection("Table")
        .doc(req.body.name)
        .set(data);
      return res.status(200).json({ success: true, message: "Table created" });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error when create table" });
    }
  },
  //*End region
  //*Update table
  updateTable: async (req, res) => {
    let table = db.collection("Table").doc(req.params.id);
    return table
      .update({
        name: req.body.name,
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
  //*Region update busy table
  updateBusyTable: async (req, res) => {
    let orderDocument = db.collection("Table").doc(req.body.id);
    return orderDocument
      .update({
        isBusy: req.body.isBusy,
      })
      .then(() => {
        return res
          .status(200)
          .json({ success: true, message: "Table updated" });
      })
      .catch(() => {
        return res
          .status(500)
          .json({ success: false, message: "Error when update order" });
      });
  },
  //*End region
  //*End region
  //*Delete table
  deleteTable: async (req, res) => {
    try {
      let table = await db.collection("Table").doc(req.params.id).get();
      if (!table.data()) {
        res.status(202).json({ success: false, message: "Invalid table id" });
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
        .collection("Restaurants")
        .doc(req.params.restaurantID)
        .collection("Table")
        .get();
      const listTable = snapshot.docs.map((doc) => doc.data());
      if (listTable.length === 0) {
        return res.status(202).json({
          success: false,
          message: "No table",
          data: listTable,
        });
      }
      res.status(200).json({
        success: true,
        message: "Got all table",
        data: listTable,
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: "false", message: "Error when get all table" });
    }
  },
  //*End region
  //*Get all table of restaurant
  getAllTableOfRestaurant: async (req, res) => {
    try {
      const user = await db.collection("Users").doc(req.body.username).get();
      console.log(user.data());
      const table = await db.collection("Table");
      const snapshot = await table
        .where("restaurantID", "==", user.data().restaurantID)
        .get();
      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          console.log(doc.data());
        });
        var tableArray = [];
        console.log("ok1");
        // conver snapshot to array
        snapshot.forEach((doc) => {
          tableArray.push(doc.data());
        });
        console.log(tableArray);
        console.log("ok2");

        return res.status(200).json({
          success: true,
          message: tableArray,
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
  //*End region
};
