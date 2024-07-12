import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Login() {
    // States to store the user's details, todos, token, and whether they're an admin or not
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [todos, setTodos] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    // Stores the user input when they add a new task
    const [inputTodo, setInputTodo] = useState("");
    // Stores the user input when they edit a task
    const [editValue, setEditValue] = useState("");
    // Stores the index of that edited task so we can change it in the back-end
    const [editIndex, setEditIndex] = useState("");
    // Controls which elements are shown on the page depending on if the user has logged in or not
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // Controls the edit form being shown or not.
    const [editFormVisibility, setEditFormVisibility] = useState(false);

    // This submits the user log in details to the API which checks it in the backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:1539/login', { username, password });
            setToken(response.data.token);
            setIsAdmin(response.data.user.isAdmin);
            setTodos(response.data.user.todos);
            setIsLoggedIn(true);
            console.log(response.data);
            alert('User logged in successfully');
        } catch (error) {
            console.error(error);
            alert(error.response.data);
        }
    };

    // This submits the new task data to the API which will add it to the user's 'todos'
    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:1539/add', 
            { username, inputTodo, isAdmin }, 
            { headers: { Authorization: token },
            });
            setInputTodo("");
            setTodos(response.data);
            console.log(todos);
        } catch (error) {
            console.error(error);
            setInputTodo("");
            alert(error.response.data);
        }

    };

    // This deletes a chosen task by using its index to find it in the user's 'todos'
    const removeTodo = async (index) => {
        try {
            const response = await axios.post(`http://localhost:1539/delete`, 
            { username, index, isAdmin },
            { headers: { Authorization: token },
            })
            setTodos(response.data);
        } catch (error) {
            console.error(error);
            alert(error.response.data);
        }
    };

    // This pops up the 'edit' input field and pre-fills it with the task name so it is ready to be edited
    const handleEditClick = (index, content) => {
        setEditFormVisibility(true);
        setEditValue(content);
        setEditIndex(index)
    };

    // This submits the new task name and index to replace the task in the user's 'todos'
    const handleEdit = async (e, index) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:1539/edit`, 
            { username, editIndex, editValue, isAdmin },
            { headers: { Authorization: token },
            })
            setTodos(response.data);
        } catch (error) {
            console.error(error);
            setEditFormVisibility(false);
            alert(error.response.data);
        }
    };

    // Handles the button that logs the user out
    const logOut = () => {
        // Returns all values to empty/default values
        setUsername("");
        setPassword("");
        setToken("");
        setIsAdmin(false);
        setTodos("");
        setIsLoggedIn(false);
    }

    return (
        <div className='App'>
            <h2>Login</h2>

            { // If the user hasn't logged in yet, the input fields are shown. Otherwise, a 'log out' button is shown.
            (isLoggedIn === false)? (
                <>
                    <form className="form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="info" type="submit">Login</button>
                    </form>
                </>
            ): 
            <>
                <button className="go-back" onClick={() => logOut()}>Log Out</button>
            </>}

            <br />
            <hr />

                <div>
                    <h3>Todos</h3>
                    {(isLoggedIn === true)? 
                    <>
                        {/*Conditional rendering that shows an 'add task' functionality or an 'edit' functionality depending
                        on whether the edit button has been clicked or not. None of this will show if the user isn't an admin (which occurs if they
                        register with a username that doesn't end in '@gmail.com' */}

                        {(isAdmin === true)? (
                         <p>As a Gmail user, you can add, edit and delete tasks!</p>
                        ):
                        <p>As a non-Gmail user, you are only able to view the sample tasks.</p>
                        }

                        {editFormVisibility===false?(
                            <form className="form" onSubmit={handleAdd}>
                                <label>Add your task: </label>
                                <div>
                                    <input type="text" required value={inputTodo} onChange={(e) => setInputTodo(e.target.value)}/>
                                    <button type="submit" className={(isAdmin === true)? "button" : "nope"}>ADD</button>
                                </div>
                            </form>
                            ):(
                            <form className="form" onSubmit={handleEdit}>
                                <label>Update your task: </label>
                                <div>
                                    <input type="text" required value={editValue} onChange={(e) => setEditValue(e.target.value)}/>
                                    <button type="submit" className={(isAdmin === true)? "update" : "nope"}>UPDATE</button>
                                </div>
                                {/* This button allows the user to cancel the 'edit' element and return to normal page which 
                                has the 'add task' element. */}
                                <button type="button" className="back" onClick={() => setEditFormVisibility(false)}>GO BACK</button>
                            </form>
                            )}
                    </>
                    : null}


                    { // If there is 1 or more items in the 'todos' array then they'll be mapped. Otherwise a message is shown saying how there aren't any todos yet.
                    todos.length > 0 ? (
                        <ul>
                            {// If the user didn't register with a username ending in '@gmail.com', then they aren't an admin and can only view sample tasks
                            (isAdmin === false) ? 
                                todos.map((todo, index) => (
                                    <div key={index} className="todo">
                                    <Container>
                                        <Row>
                                            <Col>
                                                <p>{todo}</p>
                                            </Col>
                                            <Col xs={3}>
                                                <div style={{alignContent: "center"}}>
                                                    <span type="button" onClick={() => handleEditClick(index, todo)} className='disabled'>EDIT</span>
                                                    <span type="button" onClick={() => removeTodo(index)} className='disabled'>DELETE</span>
                                                </div>
                                            </Col>
                                        </Row>
                                     </Container>
                                </div>
                                ))
                            : 
                            <>
                                { // If the user did register with a username ending in '@gmail.com' then they are an admin and can edit and delete tasks
                                todos.map((todo, index) => (
                                            <div key={index} className="todo">
                                            <Container>
                                                <Row>
                                                    <Col>
                                                        <p>{todo}</p>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <div style={{alignContent: "center"}}>
                                                            <span type="button" onClick={() => handleEditClick(index, todo)} className='edit-tool'>EDIT</span>
                                                            <span type="button" onClick={() => removeTodo(index)} className='delete-tool'>DELETE</span>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </div>
                                ))}
                            </>
                            }
                        </ul>
                    ):
                    <div>
                        <p>No tasks to show</p>
                    </div>
                    }
                </div>
        </div>
    );
}

export default Login;
