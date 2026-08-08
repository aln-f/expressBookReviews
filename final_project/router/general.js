const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/books', function (req, res) {
    return res.status(200).json(books);
});

const url = 'http://localhost:5000/books';

// Get all books using async-await with Axios
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(url);

        return res.status(200).json(response.data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;

        const response = await axios.get(url);

        const booksData = response.data;

        if (booksData[isbn]) {
            return res.status(200).json(booksData[isbn]);
        }
        return res.status(404).json({ message: "Book not found" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;

        const response = await axios.get(url);

        const booksData = response.data;

        const booksByAuthor = [];
        Object.keys(booksData).forEach((key) => {
            if (booksData[key].author == author) {
                booksByAuthor.push(booksData[key]);
            }
        })

        return res.status(200).json(booksByAuthor);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;

        const response = await axios.get(url);

        const booksData = response.data;

        const booksByTitle = [];
        Object.keys(booksData).forEach((key) => {
            if (booksData[key].title == title) {
                booksByTitle.push(booksData[key]);
            }
        })

        return res.status(200).json(booksByTitle);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
