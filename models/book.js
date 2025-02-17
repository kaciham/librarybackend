const mongoose = require("mongoose");
const { Schema } = mongoose;


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
    genre: String,
    ratings: [ratingsSchema],
    averageRating: Number
  });

// Function to calculate the average rating and update the book
bookSchema.methods.calculateAverageRating = async function () {
    if (this.ratings.length === 0) {
        if (this.averageRating !== 0) {
            this.averageRating = 0;
            await this.save();
        }
        return 0;
    }

    const validRatings = this.ratings
        .map(r => r.grade)
        .filter(grade => typeof grade === 'number' && grade >= 0 && grade <= 5);

    if (validRatings.length === 0) {
        if (this.averageRating !== 0) {
            this.averageRating = 0;
            await this.save();
        }
        return 0;
    }

    const sum = validRatings.reduce((acc, grade) => acc + grade, 0);
    const newAverage = Number((sum / validRatings.length).toFixed(2)); // Round to 2 decimals

    if (this.averageRating !== newAverage) {
        this.averageRating = newAverage;
        await this.save();
    }

    return this.averageRating;
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
