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
export const OrderController = {
  //*Create new order
  createOrder: async (req, res) => {
    try {
      // function randomNumber() {
      //   return Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
      // }
      // var tempID = randomNumber().toString();
      // var order = await db.collection("Order").doc(tempID.toString()).get();
      // while (order.data()) {
      //   tempID = randomNumber();
      //   console.log(tempID);
      //   order = await db.collection("Order").doc(tempID).get();
      // }
      const data = {
        id: req.body.id,
        orderInfo: req.body.orderInfo,
        status: req.body.status,
      };
      // const table = await db.collection("Table").doc(req.params.tableID).get();
      // if (!table.data()) {
      //   res.status(501).json({
      //     success: false,
      //     message: "Invalid Table ID",
      //   });
      // } else {
      console.log("oke");

      async function addOrderInfo() {
        for (let i = 0; i < req.body.orderInfo.length; i++) {
          await db
            .collection("Order")
            .doc(req.body.id)
            .collection("OrderInfo")
            .doc(req.body.orderInfo[i].id)
            .set(req.body.orderInfo[i]);
          console.log(req.body.orderInfo[i].idd);
        }
      }
      addOrderInfo();
      return res.status(200).json({
        success: true,
        message: "Order created",
      });
      // }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error when create order",
      });
    }
  },
  //*End region
  //*Update order
  updateOrder: async (req, res) => {
    let orderDocument = db.collection("Order").doc(req.params.id);
    return orderDocument
      .update({
        time: req.body.time,
        tableID: req.params.tableID,
        status: req.body.status,
      })
      .then(() => {
        return res
          .status(200)
          .json({ success: true, message: "Order updated" });
      })
      .catch(() => {
        return res
          .status(500)
          .json({ success: false, message: "Error when update order" });
      });
  },
  //*End region
  //*Delete order
  deleteOrder: async (req, res) => {
    try {
      let order = await db.collection("Order").doc(req.params.id).get();
      if (!order.data()) {
        res.status(500).json({ success: false, message: "Invalid order id" });
      } else {
        await db.collection("Order").doc(req.params.id).delete();
        res.status(200).json({ success: true, message: "Order deleted" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Error when delete order" });
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
  //*Get all order of table
  getAllOrderOfRestaurant: async (req, res) => {
    try {
      var orders = [];
      const table = await db
        .collection("Table")
        .where(restaurantID, "==", req.params.restaurantID)
        .get();
      table.forEach((temp) => {
        console.log(temp.id, "=>", temp.data());
        let orderQuery = db
          .collection("Order")
          .where("tableID", "==", temp.id)
          .get();
        orderQuery.then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            orders.push(doc.data());
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
  //*Get all order
  // getAllOrder: async (req, res) => {
  //   try {
  //     const snapshot = await db.collection("Order").get();
  //     snapshop.forEach((order) => {
  //       console.log(order.id, "=>", order.data());
  //     });
  //     res.status(200).json({ success: true, message: "Got all order" });
  //   } catch (err) {
  //     res
  //       .status(500)
  //       .json({ success: false, message: "Error when get all order" });
  //   }
  // },
  //*End region
};
