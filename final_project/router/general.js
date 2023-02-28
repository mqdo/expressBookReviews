const express = require('express');
let { booksAsync } = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
      return res.status(404).json({ "message": "Username and password are required" })
  }
  if (!isValid(username)) {
      return res.status(404).json({ "message": "The username is already exists"});
  }
  users.push({ username, password });
  return res.status(201).json({ "message": "Register successfully. Please log in!" })
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    let books = await booksAsync;
    return res.json({ "data": books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    const { isbn } = req.params;
    let books = await booksAsync;
    const book = books[isbn];
    if (book) {
        return res.json({ "data": book });
    }
    return res.status(404).json({ "message": `the book with ISBN ${isbn} not found` })
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    const { author } = req.params;
    let result = [];
    let books = await booksAsync;
    for (let key in books) {
        if (books[key].author === author) {
            result.push(books[key]);
        }
    }
    return res.json({ "data": result });
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const { title } = req.params;
    let result = [];
    let books = await booksAsync;
    for (let key in books) {
        if (books[key].title === title) {
            result.push(books[key]);
        }
    }
    return res.json({ "data": result });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const { isbn } = req.params;
    const result = books[isbn];
    if (result) {
        return res.json({ "data": result.reviews });
    }
    return res.status(404).json({ "message": `the book with ISBN ${isbn} not found` })
});

module.exports.general = public_users;
