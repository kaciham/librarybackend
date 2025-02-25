const mongoose = require("mongoose");
const { Schema } = mongoose;

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

const ratingsSchema = new Schema({
    userId: String,
    grade: Number
});

const bookSchema = new Schema({
    userId: String,
    title: String,
    author: String,
    imageUrl: String,
    year: Number,
    genre: {
        type: String,
        enum: categoriesDeLivres, // Use the enum for validation
            },
    ratings: [ratingsSchema],
    averageRating: Number
});

// Function to calculate the average rating and update the book
bookSchema.methods.calculateAverageRating = function () {
    if (!this.ratings || this.ratings.length === 0) {
        this.averageRating = 0;
        return this.averageRating;
    }

    // Ensure valid ratings (between 0 and 5)
    const validRatings = this.ratings
        .map(r => r.grade)
        .filter(grade => typeof grade === 'number' && grade >= 0 && grade <= 5);

    if (validRatings.length === 0) {
        this.averageRating = 0;
        return this.averageRating;
    }

    // Calculate the new average rating
    const sum = validRatings.reduce((acc, grade) => acc + grade, 0);
    const newAverage = Number((sum / validRatings.length).toFixed(2));

    // Update the average rating only if it has changed
    if (this.averageRating !== newAverage) {
        this.averageRating = newAverage;
    }

    return this.averageRating;
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
