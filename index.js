require('dotenv').config();
require ("./db/conn")

const Register = require("./models/register");
const contact_info = require("./models/contact");
const HotelContact = require("./models/hotels");
// const Review = require ("./models/review")
const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const port = process.env.PORT || 3000;
const hbs = require ("hbs")
hbs.registerPartials(__dirname+'/templates/partials');
const Razorpay= require("razorpay")
const razorpay = new Razorpay({
  key_id :"rzp_test_yOwSqY2Ruq4ivb",
  key_secret:"t6kBFBKDp9JWQzXoluIlohFd"
})


app.use(session({
  resave: false,
  saveUninitialized: true,
  secret:" process.env.SESSION_SECRET"
}));






app.use((req,res,next)=>{
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.set('view engine', 'hbs');
// app.set('views', '/views');

// app.use(express.static('public')); 
// app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const userRoutes = require('./routes/userRoute');
const { Template } = require('hbs');
const { log } = require('console');

app.use('/', userRoutes);

// app.get('/index', (req, res) => {
//   console.log("gm");
//   res.render("index");
// });
app.use(express.static(path.join(__dirname, 'templates')));
app.get('/index', (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/templates' });
});

  app.use( express.static( __dirname + '/templates' ));
  app.get('/about', (req, res) => {
      res.sendFile('templates/about.html',{root: __dirname}); 
    });



  app.get('/goahotelsbooking', (req, res) => {
      res.sendFile('templates/booking-goa.html',{root: __dirname}); 
    });
  app.get('/darjeelinghotelsbooking', (req, res) => {
      res.sendFile('templates/booking-darjeeling.html',{root: __dirname}); 
    });
  app.get('/udaipurhotelsbooking', (req, res) => {
      res.sendFile('templates/booking-udaipur.html',{root: __dirname}); 
    });
  app.get('/varansihotelsbooking', (req, res) => {
      res.sendFile('templates/booking-varansi.html',{root: __dirname}); 
    });
  app.get('/manalihotelsbooking', (req, res) => {
      res.sendFile('templates/booking-manali.html',{root: __dirname}); 
    });
  app.get('/ootyhotelsbooking', (req, res) => {
      res.sendFile('templates/booking-ooty.html',{root: __dirname}); 
    });
  app.get('/affordablehotel', (req, res) => {
      res.sendFile('templates/affordable-hotel.html',{root: __dirname}); 
    });
  // app.use( express.static( __dirname + '/templates' ));
  // app.get('/contact', (req, res) => {
  //     res.sendFile('templates/contact.html',{root: __dirname});  
  //   });


  app.set("views",__dirname +"/templates/views")


  app.get('/form', (req, res) => {
      res.render("auth") 
    });
    app.post('/form', async(req, res) => {
      try {
        // const register = new Register(req.body);
        // await register.save();
        // res.redirect('/index');
        // alert(`Thank you for registering by, ${req.body.email}!`);
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if (password === cpassword){
   
        const customer = new Register({
          email : req.body.email,
          password : req.body.password,
          cpassword : req.body.cpassword


        })
       const c_info = await customer.save();
       res.redirect("/index");


        }else{
          res.send("password are not matching")
        }

        
      } catch(error) {
        res.status(400).send(error);
      }
    });




  app.get("/contact",(req,res)=>{
    res.render("contact")
  });
  app.post("/contact",async(req,res)=>{
    try{
      const contact = new contact_info({
        name:req.body.name,
        pnumber:req.body.pnumber,
        adate:req.body.adate,
        lday:req.body.lday,
        conemail:req.body.conemail,
        connumber:req.body.connumber
    })
    const con_info = await contact.save();
    res.redirect("/index")
  }
    catch(error){
      
      res.status(400).send(error);

    }
   
  });




  app.get("/hotelcontact",(req,res)=>{
    res.render("hotelcontact")
  });
  app.post("/hotelcontact", async (req, res) => {
  try {
    
const hotelcontact = new HotelContact({
  hname: req.body.hname,
  hpnumber: req.body.hpnumber,
  hadate: req.body.hadate,
  hlday: req.body.hlday,
  hconemail: req.body.hconemail,
  hconnumber: req.body.hconnumber
});
const hotelContactResult = await hotelcontact.save();
    res.redirect("/index");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});
   
 





  




   app.use("",require("./routes/revRoute"))

  // app.get("/reviews",(req,res)=>{
  //   res.render("reviews")
  // });











  app.post('/contact', (req, res) => {
    let options = {
      amount: 50000, 
      currency: "INR"
    };
    razorpay.order.create(options, function(err, order) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create order' });
      } else {
        console.log(order);
        res.json(order);
      }
    });
  });

  // app.use("",require("./routes/payRoute"))


  
  app.post('/hotelcontact', (req, res) => {
    let options = {
      amount: 50000, 
      currency: "INR"
    };
    razorpay.order.create(options, function(err, order) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create order' });
      } else {
        console.log(order);
        res.json(order);
      }
    });
  });























app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});