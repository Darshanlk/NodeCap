#!/usr/bin/env node
// console.log('Hello');

const fs = require("fs");
const yargs = require("yargs");
const exec = require("node-async-exec");

yargs.command({
  command: "make",
  describe: "Add a new project",
  builder: {
    title: { describe: "make folder", demandOption: true, type: "string" },
    body: {
      describe: "Note body",
      demandOption: true,
      type: "string",
    },
  },
  handler: function (argv) {
    console.log(argv);

    const data = fs.readFileSync(argv.body);
    const dataObj = JSON.parse(data);

    makeFolder(dataObj);
  },
});

const subDir = function (dataObj) {
  const { dirArr, path } = dataObj;

  dirArr.map((dir) => {
    let folderName = path + `/${dir}`;
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(folderName);
        subDirFile(dir, folderName);
        // fs.writeFileSync(folderName + "/index.js", "console.log('hola user')");
      }
    } catch (err) {
      console.error(err);
    }
  });
};

const makeFolder = function (obj) {
  const { name, packages, dirArr } = obj;

  console.log(name, packages, "Your packages packages");

  let folderName = `/Users/DarshanMMistry/Desktop/${name}`;

  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);

      (async (packages) => {
        packages = packages.join(" ");
        console.log(packages);

        fs.writeFileSync(folderName + "/.gitignore", "node_modules");
        try {
          const commands = [`npm init -y`, `npm i ${packages}`, `git init`];
          console.log(
            "====================================================================="
          );

          await exec({
            path: folderName,
            cmd: commands,
          });
          console.log(
            "====================================================================="
          );
        } catch (err) {
          console.log(err);
        }
      })(packages);

      folderName = folderName + "/src";
      fs.mkdirSync(folderName);

      fs.writeFileSync(folderName + "/index.js", "console.log('hola user')");
      fs.writeFileSync(folderName + "/app.js", "console.log('app.js')");

      subDir({ dirArr, path: folderName });
    }
  } catch (err) {
    console.error(err);
  }
};

const subDirFile = function (dir, folderName) {
  switch (dir) {
    case "config":
      fileGenerator(folderName, ["dev.js", "test.js"]);
      break;
    case "helpers":
      fileGenerator(folderName, ["helpers.js", "note.txt"]);
      break;
    case "routes":
      fileGenerator(folderName, ["userRoutes.js", "notes.txt"]);
      break;
    case "middleware":
      fileGenerator(folderName, ["auth.js", "notes.txt"]);
      break;
    case "db":
      fileGenerator(folderName, ["usersDb.js", "notes.txt"]);
      break;

    default:
      console.log("Give proper input");
  }
};

const fileGenerator = (folderName, fileName) => {
  fileName.map((file) => {
    fs.writeFileSync(folderName + `/${file}`, "console.log('hola user')");
  });
};

console.log(yargs.argv);
