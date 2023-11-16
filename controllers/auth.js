const User = require("../models/user");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign Up",
    isAuthenticated: false,
  });
};

exports.PostSignUp = async (req, res, next) => {
  const { email, password, confirmpassword } = req.body;
  console.log("Payload is: ", email, password, confirmpassword);
  User.findOne({ email: email })
    .then((userDoc) => {
      if (!userDoc) {
        return bcrypt.hash(password, saltRounds).then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: {
              items: [],
            },
          });
          user.save();
          res.redirect("/login");
        });
        // return userDoc.save();
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      console.log(err);
    });
  // res.render("auth/signup", {
  //   path: "/signup",
  //   pageTitle: "Sign Up",
  //   isAuthenticated: false,
  // });
};

exports.postLogin = (req, res, next) => {
  User.findById("5bab316ce0a7c75f783cb8a8")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
