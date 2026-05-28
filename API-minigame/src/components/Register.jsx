import React from "react";
import {useState} from "react";
import "./Login.css"

const Register = ({setView}) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    //Sets required length for password
    if (password.length < 8) {
      setError('Password must contain atleast 8 characters.');
      return;
    }

    //Requires the user to use a symbol in the password
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(password)) {
      setError('Password must contain a special symbol. (example. !, @, #, $).');
      return;
    }

    //Saved in local storage
    localStorage.setItem('saved_username', username.trim());
    localStorage.setItem('saved_password', password);

    setSuccess(true);
    
    // Send user to login screen
    setTimeout(() => {
      setView('login');
    }, 1500);
  };

  return (
    <div className ="auth-card">
      <h2>Let's Play!</h2>
      <p>Create an account.</p>

      {error && <div className ="alert error">{error}</div>}
      {success && <div className ="alert success">Account created. please wait...</div>}

      <form onSubmit ={handleRegister}>
        <div className ="form-group">
          <label>Username</label>
          <input
            type ="text"
            value ={username}
            onChange ={(e) => setUsername(e.target.value)}
            required
            placeholder ="Choose a username."
          />
        </div>

        <div className ="form-group">
          <label>Password</label>
          <input
            type ="password"
            value ={password}
            onChange ={(e) => setPassword(e.target.value)}
            required
            placeholder ="Atleast 8 characters and 1 special symbol."
          />
        </div>

        <button type ="submit" className ="auth-btn">Register</button>
      </form>

      <p className ="switch-text">Got an account?{' '}<span onClick ={() => setView('login')} className ="link-text">Log in here!</span></p>
    </div>
  );
};

export default Register;