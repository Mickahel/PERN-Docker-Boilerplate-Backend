const { execSync } = require('child_process')
const fs = require("fs")

if (fs.existsSync('.git')) {
    console.log("Getting GIT data")
    const out = {}
    out.commit = execSync('git rev-parse --short HEAD').toString().replace("\n", "")
    //out.tag = execSync('git describe --abbrev=0 --tags').toString().replace("\n","")
    out.date = execSync('git show -s --format=%cd --date=local').toString().replace("\n", "")

    fs.writeFileSync('./src/version.json', JSON.stringify(out))
}

if (fs.existsSync('build')) {
    console.log("Deleting build folder")
    try {
        if (process.platform == "win32") execSync('rmdir /s build')
        else if (process.platform == "linux") execSync('rimraf build/*')

    } catch (e) {
        console.log(e)
    }
}
console.log("Finished Prebuild, starting build")
