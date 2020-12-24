const sharp = require("sharp");
class UploaderService {
  constructor(directory) {
    this.directory = directory;
  }

  async store(buffer) {
    const filename = UploaderService.filename();
    const filepath = this.filepath(filename);

    await sharp(buffer)
      .resize(300, 300, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toFile(filepath);

    return filename;
  }

  delete(filePath, basePath = "\\uploads") {
    if (!filePath) return Promise.reject();
    let dest = path.join(__dirname, "../../" + basePath + filePath);
    return fs.promises.unlink(dest);
  }
}

module.exports = UploaderService;
