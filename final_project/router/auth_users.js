const express = require('express');
const jwt = require('jsonwebtoken');
let { books } = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { "username": "user2", "password": "password2" }
];

const isValid = (username)=>{ //returns boolean
    const existed = users.filter((user) => user.username === username);
    if (existed.length > 0) {
        return false;
    }
    return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const existed = users.filter((user) => {
        return user.username === username && user.password === password;
    });
    if (existed.length > 0) {
        return true;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(404).json({ "message": "Username and password are required" });
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
          data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
          accessToken, username
        }
        return res.status(200).json({ "message": "User successfully logged in" });
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const { username } = req.session.authorization;
    books[isbn].reviews[username] = review;
    res.status(201).json({ "message": "Review added successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { username } = req.session.authorization;
    delete books[isbn].reviews[username];
    res.status(201).json({ "message": "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
