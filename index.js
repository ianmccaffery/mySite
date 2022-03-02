// index.js

/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");
const fs = require("fs");

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use('/public', express.static(path.join(__dirname, "public")));




/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/user", (req, res) => {
  res.render("user", { title: "Profile", userProfile: { nickname: "Auth0" }});
});

const f = new Promise((resolve, reject) => {
  fs.readdir(path.join(__dirname, 'public/downloads'), (err, data) => {
    if (err) {
      reject(err)
      return
    }
    console.log(data)
    resolve(data)
  })
});

app.get("/downloads", async (req, res) => {
  f
  .then(data => res.render("downloads", { title: "Downloads", files: data }))
  // res.render("downloads", { title: "Downloads", files: f})
});

// app.get("/downloads", (req, res) => {
//   const f =  fs.readdirSync(path.join(__dirname, 'public/downloads'), function (err, files) {
//     if (err) {
//       return console.log('Unable to scan directory: ' + err) 
//     } else {
//       return files
//     }
//   })
//   res.render("downloads", { title: "Downloads", files: f})
// });
/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});