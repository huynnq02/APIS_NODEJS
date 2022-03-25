import admin from "firebase-admin";
import serviceAccount from '../serviceAccountKey.json'  assert {type: "json"};



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  const db = admin.firestore();

export const AuthController = {
    createUser : async(req,res)=>{
        const data={
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        }
        try {
          await db.collection('Users').doc(req.body.username).set(data);
          res.status(200).json({
            success: true,
            message: "User created"
          })
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error,
          });
        }
        
    },
    loginUser : async(req,res)=>{
        const user= await db.collection('Users').doc(req.body.username).get();
        try {
          if(!user){
              res.status(501).json({
                success: false,
                message: "User not found"
              })
          }else{
            if (req.body.password==user.data().password) {
              res.status(200).json({
                success: true,
                message: "User Logged in"
              })
            } else {
              res.status(501).json({
                success: false,
                message: "Incorrect username or password",
              });           
            }
          }
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error,
          });
        }
    }
      
}