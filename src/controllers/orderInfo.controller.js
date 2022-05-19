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
export const OrderInfoController = {
  //*Create new order info
  createOrderInfo: async (req, res) => {
    const data = {
      id: req.body.id,
      orderID: req.params.orderID,
      foodID: req.params.foodID,
      quantity: req.body.quantity,
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
            try {
              var flag = true;
              for (let i = 0; i < req.body.foodID.length; i++) {
                console.log(req.body.foodID[i]);
                let food = await db
                  .collection("Food")
                  .doc(req.body.foodID[i])
                  .get();
                console.log(food.data());
                if (!food.data()) {
                  res.status(501).json({
                    success: false,
                    message: "Invalid food ID",
                  });
                  flag = false;
                  break;
                }
              }
              if (flag == true) {
                await db.collection("OrderInfo").doc(req.body.id).set(data);
                res
                  .status(200)
                  .json({ success: true, message: "Order info created" });
              }
            } catch (err) {
              res.status(500).json({
                success: false,
                message: "Error when create order info",
              });
            }
          } catch (err) {
            res.status(500).json({
              success: false,
              message: "Error when create order info",
            });
          }
        }
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "Error when create order info",
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error when create order info",
      });
    }
  },
  //*End region
  //*Update order info
  updateOrderInfo: async (req, res) => {
    let orderInfoDocument = db.collection("OrderInfo").doc(req.params.id);
    return orderInfoDocument
      .update({
        foodID: req.params.foodID,
        quantity: req.params.quantity,
      })
      .then(() => {
        return res
          .status(200)
          .json({ success: true, message: "Order info updated" });
      })
      .catch(() => {
        return res
          .status(500)
          .json({ success: false, message: "Error when update order info" });
      });
  },
  //*End region
  //*Delete order info
  deleteOrderInfo: async (req, res) => {
    try {
      let orderInfo = await db.collection("OrderInfo").doc(req.params.id).get();
      if (!orderInfo.data()) {
        res
          .status(500)
          .json({ success: false, message: "Invalid order info id" });
      } else {
        await db.collection("OrderInfo").doc(req.params.id).delete();
        res.status(200).json({ success: true, message: "Order info deleted" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Error when delete order info" });
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
  //*Get all order info of restaurant
  getAllOrderInfoOfRestaurant: async (req, res) => {
    try {
      var orderInfos = [];
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
          let orderInfo = db
            .collection("OrderInfo")
            .where("orderID", "==", tempOrder.id)
            .get();
          orderInfo.forEach((tempOrderInfo) => {
            orderInfos.push(tempOrderInfo.data());
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
