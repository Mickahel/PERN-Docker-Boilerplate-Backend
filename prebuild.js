const { execSync } = require('child_process')
const fs = require("fs")

console.log("Getting GIT data")

const out = {}
out.commit = execSync('git rev-parse --short HEAD').toString().replace("\n","")
//out.tag = execSync('git describe --abbrev=0 --tags').toString().replace("\n","")
out.date = execSync('git show -s --format=%cd --date=local').toString().replace("\n","")

fs.writeFileSync('./src/version.json', JSON.stringify(out))
console.log("Deleting build folder")
try{
    execSync('rimraf build/*')
}catch(e){
    console.log(e)
}

console.log("Finished, starting build")
