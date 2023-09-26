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
  


app.post('/SignupSubmit', async (req, res) => {
  const name = req.body.Fullname;
  const email = req.body.Email;
  const password = req.body.Password;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection('signup')
      .where("Email", "==", email)
      .get();

    if (!result.empty) {
      const alert = "You already have an account. Please Login.";
      return res.render("signup.ejs", { alert });
    }

    await db.collection('signup').add({
      Fullname: name,
      Email: email,
      Password: hashedPassword
    });

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing your request.");
  }
});




app.post('/LoginSubmit', (req, res) => {
  const email = req.body.Email;
  const password = req.body.Password;

  db.collection('signup')
    .where("Email", "==", email)
    .get()
    .then((docs) => {
      if (docs.size > 0) {
        
        const user = docs.docs[0].data();
        bcrypt.compare(password, user.Password, (err, result) => {
          if (result) {
            res.redirect("/restaurant-dashboard");
          } else {
            const alert = "Invalid E-Mail or Password";
            res.render("login.ejs", { alert });
          }
        });
      } else {
        const alert = "Invalid E-Mail or Password";
        res.render("login.ejs", { alert });
      }
    });
});


app.get('/restaurant-order',(req,res)=>{
  res.redirect("/menu-order");
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})