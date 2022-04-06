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
export const FoodController = {
  //*Create new menu
  addFood: async (req, res) => {
    const data = {
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      menuID: req.params.menuID,
    };
    try {
      try {
        const food = await db.collection("Menu").doc(req.params.menuID).get();
        if (!food.data()) {
          res.status(501).json({
            success: false,
            message: "Invalid Menu ID",
          });
        } else {
          try {
            await db.collection("Food").doc(req.body.id).set(data);
            res.status(200).json({
              success: true,
              message: "Food added",
            });
          } catch (err) {
            res.status(500).json({
              success: false,
              message: "Error when add food",
            });
          }
        }
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "Error when add food",
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error when add food",
      });
    }
  },
  //*End region
  //*Update menu
  updateFood: async (req, res) => {
    // try {
    //   let food = await db.collection("Food").doc(req.params.id).get();
    //   if (!food.data()) {
    //     res.status(500).json({ success: false, message: "Invalid food id" });
    //   } else {
    //     db.collection("Food").doc(req.params.id).get().update({
    //       name: req.body.name,
    //       price: req.body.price,
    //       menuID: req.body.menu,
    //     });
    //     res.status(200).json({ success: true, message: "Food updated" });
    //   }
    // } catch (err) {
    //   res
    //     .status(500)
    //     .json({ success: false, message: "Error when update food" });
    // }
    let foodDocument = db.collection("Food").doc(req.params.id);
    return foodDocument
      .update({
        name: req.body.name,
        price: req.body.price,
        menuID: req.body.menuID,
      })
      .then(() => {
        return res.status(200).json({ success: true, message: "Food updated" });
      })
      .catch(() => {
        return res
          .status(500)
          .json({ success: false, message: "Error when update food" });
      });
  },
  //*End region
  //*Delete menu
  deleteFood: async (req, res) => {
    try {
      let food = await db.collection("Food").doc(req.params.id).get();
      if (!food.data()) {
        res.status(500).json({ success: false, message: "Invalid food id" });
      } else {
        await db.collection("Food").doc(req.params.id).delete();
        res.status(200).json({ success: true, message: "Food deleted" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Error when delete food" });
    }
    // return menuDocument
    //   .delete()
    //   .then(() => {
    //     return res.status(204).json({ success: true, message: "Food deleted" });
    //   })
    //   .catch((error) => {
    //     return res
    //       .status(500)
    //       .json({ success: false, message: "Error when delete food" });
    //   });
  },

  //*End region
};
