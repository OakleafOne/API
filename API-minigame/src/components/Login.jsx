import React from "react"
import {useState} from "react"
import "./Login.css"

const Login = ({setView, setIsLoggedIn}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    //Fetches locally stored information.
    const storedUser = localStorage.getItem('saved_username');
    const storedPass = localStorage.getItem('saved_password');

    //Looks for a match.
    if (username.trim() === storedUser && password === storedPass) {
      setIsLoggedIn(true);
      setView('game'); //Sends user to the game.
    } else {
      setError('Wrong username or password. Please try again!');
    }
  };

  return (
    <div className ="auth-card">
      <h2>Welcome!</h2>
      <p>Log in to play.</p>

      {error && <div className ="alert error">{error}</div>}

      <form onSubmit ={handleLogin}>
        <div className ="form-group">
          <label>Username</label>
          <input
            type ="text"
            value ={username}
            onChange ={(e) => setUsername(e.target.value)}
            required
            placeholder ="Username..."
          />
        </div>

        <div className ="form-group">
          <label>Password</label>
          <input
            type ="password"
            value ={password}
            onChange ={(e) => setPassword(e.target.value)}
            required
            placeholder ="Password..."
          />
        </div>

        <button type ="submit" className ="auth-btn">Log in</button>
      </form>

      <p className ="switch-text">No account?{' '}<span onClick ={() => setView('register')} className ="link-text">Create one here!</span></p>
    </div>
  );
};

export default Login;