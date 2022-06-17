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
export const BillController = {
  //*Create new bill
  createBill: async (req, res) => {
    try {
      function randomNumber() {
        return Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
      }
      var tempID = randomNumber().toString();
      const bill = await db.collection("Bill").doc(tempID).get();
      while (bill.data()) {
        tempID = randomNumber().toString();
        bill = await db.collection("Bill").doc(tempID).get();
      }
      const data = {
        id: tempID,
        orderID: req.body.orderID,
        total: req.body.total,
        status: req.body.status,
      };
      await db.collection("Bill").doc(tempID).set(data);
      res.status(200).json({
        success: true,
        message: "Bill created",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error when create bill",
      });
    }
  },
  //*End region
  //*Update bill
  updateBill: async (req, res) => {
    let billDocument = db.collection("Bill").doc(req.params.id);
    return billDocument
      .update({
        total: req.params.total,
      })
      .then(() => {
        return res.status(200).json({ success: true, message: "Bill updated" });
      })
      .catch(() => {
        return res
          .status(500)
          .json({ success: false, message: "Error when update bill" });
      });
  },
  //*End region
  //*Delete bill
  deleteBill: async (req, res) => {
    try {
      let bill = await db.collection("Bill").doc(req.params.id).get();
      if (!bill.data()) {
        res.status(500).json({ success: false, message: "Invalid bill id" });
      } else {
        await db.collection("Bill").doc(req.params.id).delete();
        res.status(200).json({ success: true, message: "Bill deleted" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Error when delete bill" });
    }
    // let menuDocument = db.collection("Menu").doc(req.params.id);
    // return menuDocument
    //   .delete()
    //   .then(() => {
    //     return res.status(204).json({ success: true, message: "Menu deleted" });
    //   })
    //   .catch((error) => {
    //     return res
    //       .status(500)
    //       .json({ success: false, message: "Error when delete menu" });
    //   });
  },
  //*End region
  //*Get all bill of restaurant
  getAllBillOfRestaurant: async (req, res) => {
    try {
      var bills = [];
      const table = await db
        .collection("Table")
        .where(restaurantID, "==", req.params.restaurantID)
        .get();
      table.forEach((tempTable) => {
        console.log(tempTable.id, "=>", tempTable.data());
        let order = db
          .collection("Order")
          .where("tableID", "==", tempTable.id)
          .get();
        order.forEach((tempOrder) => {
          console.log(tempOrder.id, "=>", tempOrder.data());
          let bill = db
            .collection("Bill")
            .where("orderID", "==", tempOrder.id)
            .get();
          bill.forEach((tempBill) => {
            bills.push(tempBill.data());
          });
        });
      });
      res
        .status(200)
        .json({ success: true, message: "Got all bill of a restaurant" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Error when get all bill" });
    }
  },
  //*End region
};
