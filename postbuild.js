const fs = require('fs-extra');
console.log("Moving non TS files")

try {
  console.log("Moving Files");
  let files = [
    //    "ecosystem.config.js",
    //    "ecosystem.TEST.config.js",
    //    "ecosystem.PROD.config.js",
    ".env.production",
    //    "Dockerfile",
    //    "docker-compose.yml",
    //    "package.json",
    //    "firebase-service-account.json",
    //    "yarn.lock",
    //    "pnpm-lock.yaml"
  ]
  for (let i = 0; i < files.length; i++) {
    const single = files[i]
    fs.copySync('./' + single, './build/' + single)
  }

  if (fs.existsSync("./src/version.json")) {
    fs.copySync('./src/version.json', './build/src/version.json')
  }
  console.log("Moving Keys");
  fs.mkdirsSync("./build/src/server/keys");
  fs.copySync('./src/server/keys', "./build/src/server/keys")

  console.log("Moving Resurces");
  fs.mkdirsSync("./build/src/resources");
  fs.copySync('./src/resources', "./build/src/resources")

  console.log("Moving Public");
  fs.mkdirsSync("./build/public/images");
  fs.copySync('./public/images', "./build/public/images")

  console.log("Finished")
} catch (e) {
  console.error("There were some errors", e)
  throw e;
}


