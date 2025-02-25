const express = require('express');
const router = express.Router();
const bookController = require("../controllers/book.controller")
const authController = require("../controllers/auth.controller")
const verifyJWT = require('../middlewares/verifyJWT')
const {storage} = require("../middlewares/multer-config")
const multer = require("multer");

router.post('/auth/signup', authController.createUser)
router.post('/auth/login', authController.login)

router.get('/books', bookController.getBooks)
router.get('/bestrating', bookController.getByBestRating)
router.get('/books/:id', bookController.getBookById)
router.get('/categories', bookController.getCategory)


router.post('/books',
    verifyJWT, 
    multer({ storage: storage }).single("image"), bookController.createBook)

router.put('/books/:id', verifyJWT, bookController.updateBook)

router.delete('/books/:id', verifyJWT, bookController.deleteBook)

router.post('/books/:id/rating', verifyJWT, bookController.postRate)

module.exports = router;