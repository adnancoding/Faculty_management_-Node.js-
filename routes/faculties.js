var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");
var LocalStorage = require("node-localstorage").LocalStorage;





localStorage = new LocalStorage("./scratch");
/* GET home page. */
router.get("/facultyinterface", function (req, res, next) {
  var result = JSON.parse(localStorage.getItem("ADMIN"));
  if (result) res.render("facultiesinterface", { msg: "", result: result });
  else res.redirect("/admin/adminlogin");
});

router.get("/dashboard", function (req, res, next) {
  var result = JSON.parse(localStorage.getItem("ADMIN"));
  if (result) res.render("dashboard", { result: result });
  else res.redirect("/admin/adminlogin");
});

router.get("/showimage", function (req, res, next) {
  res.render("showimage", { result: req.query });
});

router.post("/editpicture", upload.single("Image"), function (req, res, next) {
  console.log("BODY:", req.body);
  console.log("FILE", req.file);
  pool.query(
    "update faculty set image=? where facultyid=?",
    [req.file.originalname, req.body.facultyid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.redirect("/faculty/showallfaculties");
      } else {
        res.redirect("/faculty/showallfaculties");
      }
    }
  );
});

router.get("/searchfaculty", function (req, res, next) {
  var aresult = JSON.parse(localStorage.getItem("ADMIN"));
  if (!aresult) res.redirect("/admin/adminlogin");
  else res.render("searchbyid", { result: aresult, msg: "" });
});

router.get("/displaybyid", function (req, res, next) {
  var aresult = JSON.parse(localStorage.getItem("ADMIN"));
  if (!aresult) res.redirect("/admin/adminlogin");

  pool.query(
    "select F.*,(select S.statename from states S where S.stateid=F.state)as statename,(select C.cityname from cities C where C.zipcode=F.zipcode)as cityname from faculty F where F.facultyid=?",
    [req.query.fid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.render("displaybyid", { result: false });
      } else {
        if (result.length >= 1)
          res.render("displaybyid", { data: result[0], aresult: aresult });
        else
          res.render("searchbyid", {
            msg: "this faculty does not exist",
            result: aresult,
          });
      }
    }
  );
});

router.get('/edit', function(req, res, next) {
  
  pool.query("update faculty set firstname=?,lastname=?,birthdate=?,gender=?,mobileno=?,email=?,address=?,state=?,city=?,zipcode=?,qualification=?,department=? where facultyid=?",[req.query.firstname,req.query.lastname,req.query.birthdate,req.query.gender,req.query.mobileno,req.query.email,req.query.address,req.query.state,req.query.city,req.query.zipcode,req.query.qualification,req.query.department,req.query.facultyid],function(error,result){

    if(error)
    { console.log(error)
      res.redirect("/faculty/showallfaculties")
    }
    else
    {
      res.redirect("/faculty/showallfaculties")
    }
 
   })

});
router.get('/deletefaculty', function(req, res, next) {
  pool.query("delete from faculty where facultyid=?",[req.query.facultyid],function(error,result){
    if(error)
    { console.log(error)
      res.redirect("/faculty/showallfaculties")
    }
    else
    {
      res.redirect("/faculty/showallfaculties")
    }
  
}) 


});


router.get("/showallfaculties", function (req, res, next) {
  var aresult = JSON.parse(localStorage.getItem("ADMIN"));
  if (!aresult) res.redirect("/admin/adminlogin");
  pool.query(
    "select F.*,(select S.statename from states S where S.stateid=F.state)as statename,(select C.cityname from cities C where C.zipcode=F.zipcode)as cityname from faculty F",
    function (error, result) {
      if (error) {
        console.log(error);
        res.render("displayfaculties", { result: false });
      } else {
        console.log(result);
        res.render("displayfaculties", { result: result, aresult: aresult });
      }
    }
  );
});

router.get("/fetchallcities", function (req, res, next) {
  pool.query(
    "select*from cities where stateid=?",
    [req.query.stateid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json([]);
      } else {
        res.status(200).json(result);
      }
    }
  );
});

router.get("/fetchallstates", function (req, res, next) {
  pool.query("select*from states", function (error, result) {
    if (error) {
      res.status(500).json([]);
    } else {
      res.status(200).json(result);
    }
  });
});

router.post(
  "/submitfaculty",
  upload.single("Image"),
  function (req, res, next) {
    console.log("BODY:", req.body);
    console.log("FILE", req.file);
    pool.query(
      "insert into faculty(firstname,lastname,birthdate,gender,mobileno,email,address,state,city,zipcode,qualification,department,image)values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        req.body.firstname,
        req.body.Lastname,
        req.body.date,
        req.body.gender,
        req.body.mobileno,
        req.body.Email,
        req.body.address,
        req.body.state,
        req.body.city,
        req.body.zipcode,
        req.body.qualification,
        req.body.department,
        req.file.filename,
      ],
      function (error, result) {
        if (error) {
          console.log(error);
          res.render("facultiesinterface", { msg: "Server Error" });
        } else {
          res.render("facultiesinterface", {
            result: result,
            msg: "Record Inserted",
          });
        }
      }
    );
  }
);

module.exports = router;
