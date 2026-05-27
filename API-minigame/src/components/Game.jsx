import {useState} from "react"
import {useEffect} from "react"
import axios from "axios"

const TicTacToeGame = () => {
  
  const [board, setBoard] = useState(Array(9).fill(''));
  const [isXNext, setIsXNext] = useState(true); // True = Du (X), False = API/Datorn (O)
  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState(null);

  const apiKey = 'DIN_RAPIDAPI_NYCKEL_HÄR'; 
  const apiHost = 'tic-tac-toe6.p.rapidapi.com';

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every(square => square !== '')) return 'Tie';
    return null;
  };

  useEffect(() => {
    if (!isXNext && !winner) {
      fetchComputerMove();
    }
  }, [isXNext, winner]);

  const convertBoardToString = (currentBoard) => {
    return currentBoard.map(cell => cell === '' ? ' ' : cell).join('');
  };

  const fetchComputerMove = async () => {
    setLoading(true);
    const boardString = convertBoardToString(board);

    const options = {
      method: 'POST',
      url: `https://${apiHost}/gimme_a_move`,
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost
      },
      data: {
        board: boardString
      }
    };
    try {
      const response = await axios.request(options);
      const computerMoveIndex = response.data.move; 

      if (computerMoveIndex !== undefined && board[computerMoveIndex] === '') {
        const newBoard = [...board];
        newBoard[computerMoveIndex] = 'O';
        setBoard(newBoard);
        
        const gameResult = checkWinner(newBoard);
        if (gameResult) {
          setWinner(gameResult);
        } else {
          setIsXNext(true);
        }
      }
    } catch (error) {
      console.error("Could not get move from API:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (index) => {
    if (board[index] !== '' || !isXNext || winner || loading) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult);
    } else {
      setIsXNext(false);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(''));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="game-container">
      <h2>Tic-Tac-Toe</h2>
      
      <div className="status-message">
        {winner ? (
          winner === "Tie" ? "It's a tie!" : "Vinnare: ${winner}"
        ) : (
          "It is: ${isXNext ? 'Player move (X)' : 'AI move (O)...'}"
        )}
      </div>

      {loading && <div className="spinner">Thinking...</div>}

      <div className="grid">
        {board.map((value, index) => (
          <button 
            key={index} 
            className={`cell ${value}`} 
            onClick={() => handleClick(index)}
            disabled={value !== '' || !isXNext || winner}
          >
            {value}
          </button>
        ))}
      </div>

      <button className="reset-btn" onClick={resetGame}>Play Again!</button>
    </div>
  );
};

export default TicTacToeGame;