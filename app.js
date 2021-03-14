const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true}, {useUnifiedTopology: true});

const userSchema = {
    email: String,
    password: String
};

const User = new mongoose.model("user", userSchema);

app.get("/", (req, res) => {
    res.render('home');
});

app.get("/login", (req, res) => {
    res.render('login');
});

app.get("/register", (req, res) => {
    res.render('register');
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save((err) => {
        if (!err) {
            res.render('secrets');
        } else {
            res.render(err);
        }
    });
});

app.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({email: username}, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    });
});





app.listen(3000, () => {
    console.log("Running on port 3000");
});