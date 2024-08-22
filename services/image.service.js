const sharp = require("sharp");
const fs = require("fs");

const ensureUploadsDirExists = () => {
    if (!fs.existsSync("./uploads")) {
        fs.mkdirSync("./uploads");
    }
};

const processImage = async (buffer, originalname) => {
    ensureUploadsDirExists();

    const timestamp = new Date().toISOString();
    const ref = `${timestamp}-${originalname}.webp`;
    await sharp(buffer)
        .webp({ quality: 20 })
        .toFile("./uploads/" + ref);

    return ref;
};

module.exports = {
    processImage,
};
