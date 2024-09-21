const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Register a new user
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "Username already taken." });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered." });
});

// Login as a registered user
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (authenticatedUser(username, password)) {
        req.session.username = username;
        const accessToken = jwt.sign({ username }, "secret_key", { expiresIn: '1h' });
        return res.status(200).json({ message: "Login successful", accessToken });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;

    const book = books[isbn];
    if (book) {
        book.reviews[req.session.username] = review;
        return res.status(200).json({ message: "Review added/modified successfully." });
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews[req.session.username]) {
        delete book.reviews[req.session.username];
        return res.status(200).json({ message: "Review deleted successfully." });
    } else {
        return res.status(404).json({ message: "Book not found or review does not exist." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
