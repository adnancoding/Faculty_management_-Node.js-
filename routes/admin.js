var express = require("express");
var router = express.Router();
var pool = require("./pool");
var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");

router.get("/adminlogin", function (req, res, next) {
  res.render("adminlogin", { msg: "" });
});
router.get("/", function (req, res, next) {
  res.render("adminlogin", { msg: "" });
});
router.get("/logout", function (req, res, next) {
  localStorage.clear();
  res.render("adminlogin", { msg: "" });
});

router.post("/adminloggedin", function (req, res, next) {
  pool.query(
    "select * from admins where emailid=? and password=?",
    [req.body.emailid, req.body.password],
    function (error, result) {
      if (error) {
        res.render("adminlogin", { msg: "Server Error...." });
      } else {
        if (result.length == 1) {
          localStorage.setItem("ADMIN", JSON.stringify(result[0]));
          res.redirect("/faculty/showallfaculties")
          
        } else {
          res.render("adminlogin", { msg: "INVALID ADMIN ID/PASSWORD" });
        }
      }
    }
  );
});

module.exports = router;
