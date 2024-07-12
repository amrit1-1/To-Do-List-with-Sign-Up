import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './Register';
import Login from './Login';

function App() {
    return (
      <div className="App">
        <Router >
          <h1 className='title-and-tasks'>Task Manager</h1>
            <div>
                <nav>
                  <Link to="/register">Register</Link>
                  <br />
                  <Link to="/login">Login</Link>
                </nav>

                <hr />

                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </Router>
      </div>
    );
}

export default App;