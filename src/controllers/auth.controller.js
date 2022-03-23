import admin from "firebase-admin";
import serviceAccount from '../serviceAccountKey.json'  assert {type: "json"};



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  const db = admin.firestore();

export const AuthController = {
    createUser : async(req,res)=>{
        let users = db.collection('Users');
        return users
            .doc("/" + req.body.id + "/")
            .create({
                email: req.body.email,
                password: req.body.password,
            })
            .then(() => {
                return res.status(201).json({ response: "user successfully created" });
              })
              .catch(error => {
                return res.status(500).json({ error: error });
              });
    }

    
}