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
  isExistingOder: async (req, res) => {
    try {
      const order = await db.collection("Order").doc(req.body.orderID).get();
      if (order.data()) {
        return res
          .status(200)
          .json({ success: true, message: "Order is existing" });
      }
      return res
        .status(202)
        .json({ success: false, message: "Order is not existing" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Error when check order" });
    }
  },
  //* Get open order
  getCurrentOrderID: async (req, res) => {
    try {
      const snapshot = await db
        .collection("Order")
        .where("tableID", "==", req.body.tableID)
        .get();
      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          if (doc.data().isClose == false) {
            const orderID = doc.data().id;
            return res.status(200).json({ success: true, message: orderID });
          }
        });
      } else {
        res.status(202).json({ success: false, message: "No open order" });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error",
      });
    }
  },
  //* End region
  createOrder: async (req, res) => {
    try {
      await db
        .collection("Restaurants")
        .doc(req.params.restaurantID)
        .collection("Table")
        .doc(req.body.tableName)
        .set({ order: req.body.order, isBusy: true }, { merge: true });
      return res.status(200).json({
        success: true,
        message: "Order created",
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err });
    }
  },
  checkoutOrder: async (req, res) => {
    try {
      function generateRandomString() {
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";

        for (let i = 0; i < 8; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }

        return result;
      }
      const tableRef = await db
        .collection("Restaurants")
        .doc(req.params.restaurantID)
        .collection("Table")
        .doc(req.body.tableName)
        .get();
      if (!tableRef.data()) {
        return res
          .status(202)
          .json({ success: false, message: "Can not find this table" });
      }
      const totalPrice = () => {
        var totalPrice = 0;
        tableRef.data().order.map((item) => {
          totalPrice = totalPrice + item.price * item.quantity;
        });
        return totalPrice;
      };
      await db.collection("Orders").doc(generateRandomString()).set({
        name: tableRef.data().name,
        order: tableRef.data().order,
        restaurantID: tableRef.data().restaurantID,
        totalPrice: totalPrice(),
        date: req.body.date,
      });
      await db
        .collection("Restaurants")
        .doc(req.params.restaurantID)
        .collection("Table")
        .doc(req.body.tableName)
        .set(
          {
            isBusy: false,
            order: [],
          },
          { merge: true }
        );
      return res
        .status(200)
        .json({ success: true, message: "Table checked out" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Error when check out table" });
    }
  },
  //*End region
  //*Region get orderID
  getOrderInfo: async (req, res) => {
    try {
      console.log("ok0");
      const OrderInfoo = [];
      await db
        .collection("Order")
        .doc(req.params.tableID)
        .collection("OrderInfo")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.data());
          });
        });
      console.log(OrderInfoo);
      console.log("ok");
      return res.status(200).json({ success: true, message: "Success" });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error when get order" });
    }
  },
  //*End region
  //*Update order
  updateOrder: async (req, res) => {
    let orderDocument = db.collection("Order").doc(req.body.id);
    return orderDocument
      .update({
        isClose: true,
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
        res.status(202).json({ success: false, message: "Invalid order id" });
      } else {
        await db.collection("Order").doc(req.params.id).delete();
        res.status(200).json({ success: true, message: "Order deleted" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Error when delete order" });
    }
  },
  //*End region
  //*Get all order of table
  getAllOrderOfRestaurant: async (req, res) => {
    try {
      const snapshot = await db
        .collection("Orders")
        .where("restaurantID", "==", req.params.restaurantID)
        .get();
      const orderArray = snapshot.docs.map((doc) => doc.data());
      var jan = [];
      var feb = [];
      var mar = [];
      var apr = [];
      var may = [];
      var jun = [];
      var jul = [];
      var aug = [];
      var sep = [];
      var oct = [];
      var nov = [];
      var dec = [];
      orderArray.map((item) => {
        const month = item.date.slice(3, 5);
        if (month === "01") {
          jan.push(item);
        }
        if (month === "02") {
          feb.push(item);
        }
        if (month === "03") {
          mar.push(item);
        }
        if (month === "04") {
          apr.push(item);
        }
        if (month === "05") {
          may.push(item);
        }
        if (month === "06") {
          jun.push(item);
        }
        if (month === "07") {
          jul.push(item);
        }
        if (month === "08") {
          aug.push(item);
        }
        if (month === "09") {
          sep.push(item);
        }
        if (month === "10") {
          oct.push(item);
        }
        if (month === "11") {
          nov.push(item);
        }
        if (month === "12") {
          dec.push(item);
        }
      });
      const sortedObject = {
        jan: jan,
        feb: feb,
        mar: mar,
        apr: apr,
        may: may,
        jun: jun,
        jul: jul,
        aug: aug,
        sep: sep,
        oct: oct,
        nov: nov,
        dec: dec,
      };
      if (!snapshot.empty) {
        return res.status(200).json({
          success: true,
          message: "Get all order of restaurant",
          data: sortedObject,
        });
      }
      return res.status(202).json({
        success: false,
        message: "No order found",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error when get all food of restaurant",
      });
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
