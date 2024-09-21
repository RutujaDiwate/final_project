const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.get('/books', async (req, res) => {
    try {
        const allBooks = await getBooks(); // Call an async function to get all books
        return res.status(200).json(allBooks);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Simulate an async function to get all books
const getBooks = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(books); // Resolve the promise with the books data
        }, 100); // Simulate a delay
});
};


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    
    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "No books found for this author." });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    
    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;

