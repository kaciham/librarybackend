require('dotenv').config()
const Book = require("../models/book");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const fs = require('fs');
const path = require('path');

//BESTRATING

const getByBestRating = async () => {
    try {
        const topBooks = await Book.find().sort({ averageRating: -1 }).limit(3);
        return topBooks;
    } catch (error) {
        console.error("Error fetching books by best rating:", error);
        throw error;
    }
};

//CREATE
const createBook = async (book, file) => {
    try {
        const userRating = book.ratings?.find((obj) => obj.userId === book.userId);

        const newBook = new Book({
            userId: book.userId,
            title: book.title,
            author: book.author,
            year: book.year,
            imageUrl: file.filename,
            genre: book.genre,
            ratings: userRating ? [{ userId: book.userId, grade: userRating.grade }] : [],
            // averageRating: this.book.calculateAverageRating()
        });

        newBook.calculateAverageRating();

        await newBook.save(); 
        return newBook;
    } catch (error) {
        console.error("Error creating book:", error);
        throw error; 
    }
};

const postRate = async (bookId, rateData, token) => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Decoded JWT:", decoded);
        const email = decoded.UserInfo.email;
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User not found');
        }
        console.log(user);

        const book = await Book.findById(bookId);
        if (!book) {
            throw new Error('Book not found');
        }
        const { grade } = rateData;

        // Find the existing rating by this user, if any
        const existingRatingIndex = book.ratings.findIndex(rating => rating.userId.toString() === user._id.toString());

        if (existingRatingIndex > -1) {
            // Update existing rating
            book.ratings[existingRatingIndex].grade = grade;
        } else {
            // Add new rating
            book.ratings.push({ userId: user._id, grade });
        }

        // Recalculate the average rating
        book.calculateAverageRating();

        await book.save();

        return book;

    } catch (error) {
        console.error("Error rating book:", error);
        throw error;
    }
}
//READ

const getBooks = async () => {
    try {
        const books = await Book.find();
        return books;
    } catch (error) {
        console.error("Error getting books:", error);
        throw error;
    }
}

const getBookById = async (bookId) => {

    try {
        const book = await Book.findById(bookId);
        return book;
    } catch (error) {
        console.error("Error getting books:", error);
        throw error;
    }
}

//UPDATE

const updateBook = async (bookData, bookId, file) => {
    try {
        const book = await Book.findById(bookId);

        if (!book) {
            throw new Error('Book not found');
        }

        const { title, author, imageUrl, year, genre } = bookData;

        // Update the book's properties if they are provided
        if (title !== undefined) book.title = title;
        if (author !== undefined) book.author = author;
        if (file !== undefined) book.imageUrl = file.filename;
        if (year !== undefined) book.year = year;
        if (genre !== undefined) book.genre = genre;

        // Save the updated book
        await book.save();

        // Return the updated book or some success response
        return book;

    } catch (error) {
        console.error("Error updating books:", error);
        throw error;
    }
}

//DELETE

const deleteBook = async (bookId) => {
    try {
        const book = await Book.findById(bookId);
        if (!book) {
            throw new Error('Book not found');
        }

        // Delete the image file associated with the book
        const imagePath = path.join(__dirname, "../uploads", book.imageUrl);
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Error deleting image file:", err);
            }
        });

        await book.deleteOne();
        return null;
    } catch (error) {
        console.error("Error deleting books:", error);
        throw error;
    }
}

module.exports = {
    createBook, getBooks, getBookById, updateBook, deleteBook, getByBestRating, postRate
}