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
    const data = {
      id: req.body.id,
      orderID: req.params.orderID,
      price: req.body.price,
    };
    try {
      try {
        const order = await db
          .collection("Order")
          .doc(req.params.orderID)
          .get();
        if (!order.data()) {
          res.status(501).json({
            success: false,
            message: "Invalid order id",
          });
        } else {
          try {
            await db.collection("Bill").doc(req.body.id).set(data);
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
        }
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "Error when create bill",
        });
      }
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
        price: req.params.price,
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
