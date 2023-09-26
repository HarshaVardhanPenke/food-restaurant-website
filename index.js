const express = require('express')
const app = express()
const bodyParser=require('body-parser')
const port=3000
const ejs=require("ejs")
app.set('view engine','ejs');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
var serviceAccount = require("./key.json");
const bcrypt = require('bcrypt');

var serviceAccount = require("./key.json");
initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

app.use("/images",express.static('images'));


app.use(bodyParser.urlencoded({ extended: true }))

//signup route

app.get('/signup', (req, res) => {
    res.render( __dirname + "/views/" + "signup.ejs",{alert:""} );
})

//login route

app.get('/login', (req, res) => {
  res.render( __dirname + "/views/" + "login.ejs",{alert:""} );
});

//restaurant route

app.get('/restaurant-dashboard',(req,res)=>{
  res.sendFile(__dirname + "/restaurant.html");
})


//main route

app.get('/menu-order',(req,res) => {
  res.sendFile(__dirname+"/main.html");
})

//checkout route

app.get('/checkout',(req,res)=>{
  res.sendFile(__dirname+"/checkout.html");
})

app.get('/done',(req,res)=>{
  res.sendFile(__dirname+"/done.html")
})
  



//signup page

app.get('/SignupSubmit', async(req, res) => {
  const name=req.query.Fullname;
  console.log(name);
  const email = req.query.Email;
  const password = req.query.Password;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.collection('signup')
    .where("Email", "==", email)
    .where("Password", "==", password)
    .get()
    .then((docs) => {
      if (docs.size > 0) {
        const alert = "You already have an Account.Please Login";
        res.render("signup.ejs",{alert});
        
      } else {
        db.collection('signup').add({
          Fullname: req.query.Fullname,
          Email: email,
          Password: password
        }).then(() => {
          res.redirect("/login");
        });
      }
    })
 
});



app.get('/LoginSubmit', (req, res) => {
  
  db.collection('signup')
  .where("Email","==",req.query.Email)
  .where("Password","==",req.query.Password)
  .get()
  .then((docs)=>{
    if(docs.size>0){
      res.redirect("/restaurant-dashboard")
    }
    else{
      const alert="Invalid E-Mail or Password";
      res.render("login.ejs",{alert});
    }
    console.log(docs.size);
    });
  });
  

app.get('/restaurant-order',(req,res)=>{
  res.redirect("/menu-order");
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})