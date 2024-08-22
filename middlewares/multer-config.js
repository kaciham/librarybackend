const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '../images'));
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_').split('.')[0];
        const extension = MIME_TYPES[file.mimetype];
        const filename = `${name}_${Date.now()}.${extension}`;
        callback(null, filename);
    }
});

const upload = multer({ storage }).single('imageUrl');

// Middleware to handle image upload and optimization
const uploadAndOptimizeImage = (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const originalFilePath = req.file.path;
        const optimizedFilePath = path.join(req.file.destination, `optimized_${req.file.filename}`);

        try {
            // Optimize the image
            await sharp(originalFilePath)
                .resize(800) // Resize to 800px width
                .jpeg({ quality: 80 }) // Compress the image
                .toFile(optimizedFilePath);

            // Optionally, delete the original file after optimization
            fs.unlinkSync(originalFilePath);

            // Update req.file to point to the optimized image
            req.file.path = optimizedFilePath;
            req.file.filename = `optimized_${req.file.filename}`;

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            return res.status(500).json({ error: 'Error optimizing image' });
        }
    });
};

module.exports = uploadAndOptimizeImage;
