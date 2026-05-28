import React from "react"
import {useState} from "react"
import Login from "./components/Login.jsx"
import Register from "./components/Register.jsx"
import Game from "./components/Game.jsx"
import "./components/Login.css"

function App() {

    const [view, setView] = useState('login');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogout = () => {
    setIsLoggedIn(false);
    setView('login');
    };

    return (
        <div className ="app-container">
            {/*Logout button if the user is logged in*/}
            {isLoggedIn && (
                <header className ="game-navbar">
                    <span>Logged in as: {localStorage.getItem('saved_username')}</span>
                    <button onClick ={handleLogout} className ="logout-btn">Log out.</button>
                </header>
            )}
            {/*Views the different pages depending on user choice*/}
            <main className ="main-content">
                {view === 'login' && (
                    <Login setView ={setView} setIsLoggedIn ={setIsLoggedIn} />
                )}

                {view === 'register' && (
                    <Register setView ={setView} />
                )}

                {view === 'game' && isLoggedIn && (
                    <Game />
                )}
            </main>
        </div>
    )
}
export default App
