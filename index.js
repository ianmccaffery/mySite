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


/*
Takes in a directory (relative to '/'), and creates a promise for
all the file (NOT DIRS) locations that are inside of it (recursively if requested).

Returns that promise.
*/


async function readFiles(dir, isRecursive) {
  let directory = path.join(__dirname, dir);
  let output = new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      let all_child_promises = []; //will be empty if not recursive. else filled with child readFiles promises.
      if (isRecursive) {
        files.forEach(file => {
          if (fs.lstatSync(path.resolve(directory, file)).isDirectory()) {
            let internal_files = readFiles(path.join(dir, file), isRecursive); //promise for these internal files.
            all_child_promises.push(internal_files); //container for all the promises in this recursion.
          }
        })
      }
      let files2 = [];
      Promise.all(all_child_promises).then((arrays) => {
        //Add all child arrays to this array.
        arrays.forEach(array => {
          for (let i of array) {
            files2.push(i);
          }
        })
        files.forEach(file => {
          file2=path.join(dir, file);
          files2.push(file2);
        })
        files = files2;
        resolve(files);
      })
    })
  })
  return output;
}

app.get("/downloads", async (req, res) => {
  f = readFiles('public', 1);
  f.then(data => {
    // console.log("final output: ");
    // console.log(data)
    res.render("downloads", { title: "Downloads", files: data });
  })
});

app.get("/photography", (req, res) => {
  res.render("photography", {title: "Photography", files: data});
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