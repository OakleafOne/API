import {useState} from "react"
import {useEffect} from "react"
import axios from "axios"
import "./game.css"

const Game = () => {
  
  const [name, setName] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameResult, setGameResult] = useState('');

  const handlePlay = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!userGuess) {
      setGameResult('Please select a guess before consulting the Oracle!');
      return;
    }

    setLoading(true);
    setError(null);
    setApiData(null);
    setGameResult('');

    try {
      const response = await fetch(`https://api.agify.io?name=${name.toLowerCase().trim()}`);
      if (!response.ok) throw new Error('The Oracle failed to respond. Try again later.');
      
      const data = await response.json();
      
      if (data.age === null) {
        throw new Error("The Oracle has never heard that name! Try a more common one.");
      }

      setApiData(data);
      evaluateResult(data.age);
    } catch (err) {
      setError(err.message);
      setStreak(0);
    } finally {
      setLoading(false);
    }
  };

  const evaluateResult = (predictedAge) => {
    const isYoung = predictedAge < 40;
    const actualCategory = isYoung ? 'young' : 'old';

    if (userGuess === actualCategory) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setGameResult(`Correct! The Oracle predicts ${name} is ${predictedAge} years old.`);
    } else {
      setStreak(0);
      setGameResult(`Incorrect! The Oracle predicts ${name} is ${predictedAge} years old.`);
    }
  };

  const handleReset = () => {
    setName('');
    setUserGuess('');
    setApiData(null);
    setGameResult('');
    setError(null);
  };

  return (
    <div className="oracle-container">
      <header className="oracle-header">
        <h2>The Name Oracle Mini-Game</h2>
        <p>Can you outsmart the data? Guess if the API clocks a name as young or old.</p>
      </header>

      <div className="scoreboard">
        <div className="score-box">
          <span>Score</span>
          <strong>{score}</strong>
        </div>
        <div className="score-box">
          <span>Streak</span>
          <strong>{streak}</strong>
        </div>
      </div>

      <form onSubmit={handlePlay} className="oracle-form">
        <div className="input-group">
          <label htmlFor="name-input">Enter a Name:</label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type a name..."
            disabled={loading}
            maxLength={20}
          />
        </div>

        <div className="guess-group">
          <p>Your Guess:</p>
          <div className="radio-options">
            <label className={`radio-label ${userGuess === 'young' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="age-guess"
                value="young"
                checked={userGuess === 'young'}
                onChange={(e) => setUserGuess(e.target.value)}
                disabled={loading}
              />
               Young (&lt; 40)
            </label>
            <label className={`radio-label ${userGuess === 'old' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="age-guess"
                value="old"
                checked={userGuess === 'old'}
                onChange={(e) => setUserGuess(e.target.value)}
                disabled={loading}
              />
              Old (40+)
            </label>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading || !name}>
          {loading ? 'Consulting...' : 'Lock Choice & Summon Data'}
        </button>
      </form>

      {error && <div className="status-message error">{error}</div>}

      {gameResult && <div className={`status-message result ${gameResult.includes('') ? 'win' : 'lose'}`}>{gameResult}</div>}

      {apiData && (
        <div className="data-display-card">
          <h3>Retrieved API Payload Data:</h3>
          <ul>
            <li><strong>Analyzed Name:</strong> {apiData.name}</li>
            <li><strong>Estimated Median Age:</strong> {apiData.age} years</li>
            <li><strong>Sample Count Size:</strong> {apiData.count.toLocaleString()} profiles</li>
          </ul>
          <button onClick={handleReset} className="reset-btn">Play Again</button>
        </div>
      )}
    </div>
  );
};
export default Game;