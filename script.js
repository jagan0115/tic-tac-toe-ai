const boardElement = document.getElementById("board");
const statusText = document.getElementById("status");

const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");

const difficultySelect = document.getElementById("difficulty");
const firstMoveSelect = document.getElementById("firstMove");

let mode = "ai";
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;

// Start game
function startGame(selectedMode) {
    mode = selectedMode;

    homeScreen.style.display = "none";
    gameScreen.style.display = "block";

    // Hide AI settings in 2-player mode
    if (mode === "human") {
        document.getElementById("aiSettings").style.display = "none";
        statusText.innerText = "Player X Turn";
    } else {
        document.getElementById("aiSettings").style.display = "block";
        statusText.innerText = "Your Turn";
    }

    restartGame();
}

// Go back to home
function goHome() {
    homeScreen.style.display = "block";
    gameScreen.style.display = "none";
}

// Create board
function createBoard() {
    boardElement.innerHTML = "";
    board.forEach((cell, index) => {
        const btn = document.createElement("button");
        btn.classList.add("cell");
        btn.innerText = cell;
        btn.onclick = () => handleMove(index);
        boardElement.appendChild(btn);
    });
}

// Handle move
function handleMove(index) {
    if (board[index] !== "" || gameOver) return;

    if (mode === "human") {
        board[index] = currentPlayer;
        createBoard();

        if (checkWinner(board, currentPlayer)) {
            return showWinner("Player " + currentPlayer + " Wins 🎉");
        }

        if (board.every(c => c !== "")) {
            return showWinner("🤝 It's a Draw!");
        }

        // Switch player
        currentPlayer = currentPlayer === "X" ? "O" : "X";

        // Update turn text
        statusText.innerText = "Player " + currentPlayer + " Turn";

    } else {
        // Player move
        board[index] = "X";
        createBoard();

        if (checkWinner(board, "X")) {
            return showWinner("🎉 You Win!");
        }

        if (board.every(c => c !== "")) {
            return showWinner("🤝 It's a Draw!");
        }

        statusText.innerText = "AI Thinking...";

        setTimeout(aiMove, 400);
    }
}

// AI move
function aiMove() {
    let move;

    if (difficultySelect.value === "easy") {
        move = randomMove();
    } else if (difficultySelect.value === "medium") {
        move = Math.random() < 0.5 ? randomMove() : bestMove();
    } else {
        move = bestMove();
    }

    board[move] = "O";
    createBoard();

    if (checkWinner(board, "O")) {
        return showWinner("🤖 AI Wins!");
    }

    if (board.every(c => c !== "")) {
        return showWinner("🤝 It's a Draw!");
    }

    statusText.innerText = "Your Turn";
}

// Random move
function randomMove() {
    let empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    return empty[Math.floor(Math.random() * empty.length)];
}

// Best move (Minimax)
function bestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

// Minimax
function minimax(board, depth, isMaximizing) {
    if (checkWinner(board, "O")) return 10 - depth;
    if (checkWinner(board, "X")) return depth - 10;
    if (board.every(c => c !== "")) return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = "";
            }
        }
        return best;
    }
}

// Check winner
function checkWinner(board, player) {
    const patterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return patterns.some(p => p.every(i => board[i] === player));
}

// Show winner popup
function showWinner(message) {
    document.getElementById("winnerText").innerText = message;
    document.getElementById("winnerPopup").style.display = "flex";
    gameOver = true;
}

// Close popup
function closePopup() {
    document.getElementById("winnerPopup").style.display = "none";
}

// Restart game
function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    currentPlayer = "X";
    createBoard();

    closePopup();

    if (mode === "ai" && firstMoveSelect.value === "ai") {
        statusText.innerText = "AI Thinking...";
        setTimeout(aiMove, 300);
    } else {
        statusText.innerText = mode === "human" ? "Player X Turn" : "Your Turn";
    }
}

// Initialize
createBoard();