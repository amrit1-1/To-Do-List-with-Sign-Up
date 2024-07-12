const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 1539;
const SECRET_KEY = 'diva';

app.use(bodyParser.json());
app.use(cors());

const { middleware } = require('./middleware/protected');

// This array will store the user information like the username, encrypted password, and the todo tasks
const users = [];

// Registering the user
app.post('/register', middleware.requireJsonContent, middleware.assignAdmin, (req, res) => {
    const { username, password, isAdmin } = req.body;

    // Error if the username already exists
    if (users != []) {
        const user = users.find(user => user.username === username);
        if (user) {
            return res.status(403).send("Error: Username is already in use.");
        }
    }

    // Encrypting the password and adding everything to the 'users' array.
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = { 
        username: username, 
        password: hashedPassword, 
        isAdmin: isAdmin, 
        todos: ["This is a sample todo", "Buy groceries", "Mow the lawn", "Call the GP"]
    }

    users.push(newUser);

    res.status(201).send('User registered');
});

// Login
app.post('/login', middleware.requireJsonContent, (req, res) => {
    const { username, password } = req.body;

    // Finding the user in the 'users' array
    const user = users.find(user => user.username === username);

    if (!user) {
        return res.status(403).send('User not found');
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
        return res.status(403).send('Invalid credentials');
    }

    // Creating the token 
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '3h' });

    res.json({ token, user });
});

// Adding the todo from user input into the user's array of todos
app.post('/add', middleware.checkAdmin, middleware.tooLong, middleware.requireJsonContent, (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('Access denied. You may have to log in again');
    }

    const { username, inputTodo } = req.body;

    const user = users.find(user => user.username === username);
    if (user) {
        user.todos.push(inputTodo);
        res.json(user.todos);
    } else {
        res.status(403).send('Couldnt add the todo');
    }

});

// Deleting the todo from a specific user's array of todos
app.post('/delete', middleware.checkAdmin, (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('Access denied. You may have to log in again');
    }

    const { username, index } = req.body;

    const user = users.find(user => user.username === username);
    if (user) {
        user.todos.splice(index, 1);
        res.json(user.todos);
    } else {
        res.status(403).send('Couldnt find user or delete the todo');
    }
});

// Edits a specific todo in the user's array of todos
app.post('/edit', middleware.checkAdmin, middleware.tooLongEdit, middleware.requireJsonContent, (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('Access denied. You may have to log in again');
    }

    const { username, editIndex, editValue } = req.body;

    const user = users.find(user => user.username === username);
    if (user) {
        user.todos.splice(editIndex, 1, editValue);
        res.json(user.todos);
    } else {
        res.status(403).send('Couldnt add the todo');
    }

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { users };