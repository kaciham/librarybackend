const { processImage } = require("../services/image.service");
const bookService = require("../services/book.service");
const { get } = require("mongoose");

// const uploadImage = async (req, res) => {
//     try {
//         const { buffer, originalname } = req.file;
//         const ref = await processImage(buffer, originalname);
//         const link = `http://localhost:3000/${ref}`;
//         return res.json({ link });
//     } catch (error) {
//         return res.status(500).json({ error: "Failed to process image" });
//     }
// };

// const greet = (req, res) => {
//     return res.json({ message: "Hello world 🔥🇵🇹" });
// };

const createBook = async (req, res) => {
    try {
        console.log(req.body);
        const bookStringified = req.body.book;
        const book = JSON.parse(bookStringified);
        const file = req.file;
    
            const newbook = await bookService.createBook(book, file);
            console.log(book);  
            res.status(201).json({ message: 'Objet enregistré !', newbook });
    } catch (error) {
        console.error("Error creating book:", error);
        // Handle different types of errors properly
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", details: error.errors });
            
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        } else {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
};


const getBooks = async (req, res) => {
    try {
        const books = await bookService.getBooks();
        res.status(200).json({message:"this is all the books from the DB","books":books})
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
        res.status(201).json(rate);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", details: error.errors });
        } else {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

const getCategory = (req,res) => {
    try {
        const categoriesDeLivres = [
            "Fiction",
            "Non-fiction",
            "Science-fiction",
            "Fantaisie",
            "Mystère",
            "Thriller",
            "Biographie",
            "Développement personnel",
            "Histoire",
            "Philosophie",
            "Éducation",    
            "Poésie",
            "Autres"
        ];
        return res.status(200).json(categoriesDeLivres);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", details: error.errors });
        } else {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = {
    // uploadImage,
    // greet,
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
    getByBestRating,
    postRate,
    getCategory
};
