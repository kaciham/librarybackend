const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const originalName = file.originalname.replace(path.extname(file.originalname), '');
    const newFilename = `${originalName}-${uniqueSuffix}.jpg`;
    cb(null, newFilename);
  }
});

const upload = multer({ storage: storage }).single('image');

const convertToWebP = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const inputPath = path.join(__dirname, "../uploads", req.file.filename);
  const outputPath = inputPath.replace(".jpg", ".webp");

  sharp(inputPath)
    .webp({ quality: 80 })
    .toFile(outputPath, (err, info) => {
      if (err) {
        return next(err);
      }

      fs.unlink(inputPath, (err) => {
        if (err) {
          return next(err);
        }

        req.file.filename = path.basename(outputPath);
        req.file.path = outputPath;
        next();
      });
    });
};


module.exports = { storage, upload, convertToWebP };