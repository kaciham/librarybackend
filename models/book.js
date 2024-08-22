const mongoose = require("mongoose");
const { Schema } = mongoose;

const ratingSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    grade: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    }
});

const bookSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    year: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    ratings: [ratingSchema],
    averageRating: {
        type: Number,
        default: 0
    }
});

bookSchema.methods.calculateAverageRating = function () {
    if (this.ratings.length === 0) {
        this.averageRating = 0;
    } else {
        const sum = this.ratings.reduce((acc, rating) => acc + rating.grade, 0);
        this.averageRating = sum / this.ratings.length;
    }
    return this.averageRating;
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;