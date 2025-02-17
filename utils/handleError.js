const handleError = (error, res) => {

    if (error.name === "ValidationError") {
        return res.status(400).json({ message: "Validation Error", details: error.errors });
    } else {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}   

module.exports = handleError;