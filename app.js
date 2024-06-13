// Gameboard Module
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const updateBoard = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, updateBoard, resetBoard };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let isGameOver = false;

    const startGame = (player1Name, player2Name) => {
        players = [
            Player(player1Name, "X"),
            Player(player2Name, "O")
        ];
        currentPlayerIndex = 0;
        isGameOver = false;
        Gameboard.resetBoard();
        DisplayController.renderBoard();
        DisplayController.updateMessage(`${players[currentPlayerIndex].name}'s turn`);
    };

    const playTurn = (index) => {
        if (isGameOver) return;
        const board = Gameboard.getBoard();
        if (Gameboard.updateBoard(index, players[currentPlayerIndex].marker)) {
            DisplayController.renderBoard();
            if (checkWinner()) {
                DisplayController.updateMessage(`${players[currentPlayerIndex].name} wins!`);
                isGameOver = true;
            } else if (board.every(cell => cell !== "")) {
                DisplayController.updateMessage("It's a tie!");
                isGameOver = true;
            } else {
                currentPlayerIndex = (currentPlayerIndex + 1) % 2;
                DisplayController.updateMessage(`${players[currentPlayerIndex].name}'s turn`);
            }
        }
    };

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winPatterns.some(pattern => 
            pattern.every(index => board[index] === players[currentPlayerIndex].marker)
        );
    };

    return { startGame, playTurn };
})();

const DisplayController = (() => {
    const boardElement = document.getElementById('gameboard');
    const messageElement = document.getElementById('message');
    const startBtn = document.getElementById('reset');

    startBtn.addEventListener('click', () => {
        const player1Name = prompt("Enter name for Player 1:") || "Player 1";
        const player2Name = prompt("Enter name for Player 2:") || "Player 2";
        GameController.startGame(player1Name, player2Name);
    });

    boardElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('tile')) {
            const index = Array.from(boardElement.children).indexOf(e.target);
            GameController.playTurn(index);
        }
    });

    const renderBoard = () => {
        const board = Gameboard.getBoard();
        boardElement.innerHTML = "";
        board.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('tile');
            if (cell === "X") {
                cellElement.classList.add('playerX');
            } else if (cell === "O") {
                cellElement.classList.add('playerO');
            }
            cellElement.textContent = cell;
            boardElement.appendChild(cellElement);
        });
    };


    const updateMessage = (message) => {
        messageElement.textContent = message;
        messageElement.classList.remove('hide');
    };

    return { renderBoard, updateMessage };
})();

// Initialize game
window.onload = () => {
    GameController.startGame("Player 1", "Player 2");
};
