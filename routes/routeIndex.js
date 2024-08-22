const express = require('express');
const router = express.Router();
const bookController = require("../controllers/book.controller")
const authController = require("../controllers/auth.controller")
const verifyJWT = require('../middlewares/verifyJWT')
// const { uploadImage, greet } = require("../controllers/book.controller");
// const { verify } = require('jsonwebtoken');
const upload = require("../middlewares/multer-config")

// const upload = multer({ storage: multer.memoryStorage() });

// router.get("/", greet); // Fetch img
// router.post("/", upload.single("picture"), uploadImage); //post img

router.post('/auth/signup', authController.createUser)
router.post('/auth/login', authController.login)

router.get('/books', bookController.getBooks)
router.get('/books/:id', bookController.getBookById)
router.get('/booksbestrating', bookController.getByBestRating)

router.post('/books', verifyJWT, upload, bookController.createBook)

router.put('/books/:id', verifyJWT, bookController.updateBook)

router.delete('/books/:id', verifyJWT, bookController.deleteBook)

router.post('/books/:id/rating', verifyJWT, bookController.postRate)

module.exports = router;