const { processImage } = require("../services/image.service");
const bookService = require("../services/book.service")

const uploadImage = async (req, res) => {
    try {
        const { buffer, originalname } = req.file;
        const ref = await processImage(buffer, originalname);
        const link = `http://localhost:3000/${ref}`;
        return res.json({ link });
    } catch (error) {
        return res.status(500).json({ error: "Failed to process image" });
    }
};

const greet = (req, res) => {
    return res.json({ message: "Hello world 🔥🇵🇹" });
};

const createBook = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        // console.log(token)
        const bookData = {
            ...req.body,
            imageUrl: req.file ? `images/${req.file.filename}` : null
        };
        const newBook = await bookService.createBook(bookData, token);
        res.status(201).json({ "message": "A new book has been created " });
    } catch (error) {
        console.error("Error creating book:", error);

        // Send appropriate error response
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", details: error.errors });
        } else {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

const getBooks = async (req, res) => {
    try {
        const books = await bookService.getBooks();
        res.status(200).json(books)
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", details: error.errors });
        } else {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

const getBookById = async (req, res) => {
    try {
        const _id = req.params.id;
        const book = await bookService.getBookById(_id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(book)
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", details: error.errors });
        } else {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

const updateBook = async (req, res) => {
    try {
        const _id = req.params.id;
        const book = await bookService.updateBook(req.body, _id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ "message": "Book updated !" })
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", details: error.errors });
        } else {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

const deleteBook = async (req, res) => {
    try {
        const _id = req.params.id;
        const book = await bookService.deleteBook(_id);
        res.status(200).json({ message: "Book deleted !" })
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", details: error.errors });
        } else {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

const getByBestRating = async (req, res) => {
    try {
        const rate = await bookService.getByBestRating();
        res.status(200).json(rate)
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", details: error.errors });
        } else {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

const postRate = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const rateData = req.body;
        const id = req.params.id;
        const rate = await bookService.postRate(id, rateData, token);
        res.status(200).json(rate);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", details: error.errors });
        } else {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = {
    uploadImage,
    greet,
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
    getByBestRating,
    postRate
};
