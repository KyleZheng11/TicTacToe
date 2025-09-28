/*
    - GameBoard is the state of the 3x3 board
    - Each square should hold a Cell
    - we use an addState method to be able to add a state to each cell (x or o)
*/
function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Create a 2d array that will represent the 3x3 board
    for (let i = 0; i < rows; i++) {
        board[i] = []
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    //method to get entire board, so that UI can render it
    const getBoard = () => board;

    const addState = (row, col, token) => {
        // need to check if the cell of row, col contains a value already
        // if not, then we add a Cell to it, if it does, then we ask the user to pick again
        if (isNaN(row) || isNaN(col)) {
            console.log("Invalid input! Must be a number 0–2.");
            return;
        }
        if (row < 0 || row > 2 || col < 0 || col > 2) {
            console.log("Invalid position! Pick row and col between 0 and 2");
            return;
        }
        if (board[row][col].getValue() === '_') {
            board[row][col].setValue(token);
        }
        else {
            console.log("Cell already taken! Pick again.");
            return 
        }

    }

    // method used to print board to console
    // won't need it after we build UI
    const printBoard = () => {
        const boardWithStateValues = board.map((row) => row.map((state) => state.getValue()));
        console.log(boardWithStateValues);
    };

    return { getBoard, addState, printBoard };
}

function Cell() {
    let value = "_";

    const getValue = () => value;

    const setValue = (player) => {
        if (value === "_") {
            value = player;
        }
    }

    return {
        getValue, 
        setValue
    };
}

function GameController(
    playerOneName = "Player One (x)",
    playerTwoName = "Player Two (o)"
) {
    const board = GameBoard();

    const players = [
        {
            name: playerOneName,
            token: "x"
        },
        {
            name: playerTwoName,
            token: "o"
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, col) => {
        console.log(`Dropping ${getActivePlayer().name}'s state into cell: ${row}, ${col}`);
        board.addState(row, col, getActivePlayer().token);

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();
    playRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
}

function checkWinner(board) {
    wins = [
        // rows
        [ [0, 0], [0, 1], [0, 2] ],
        [ [1, 0], [1, 1], [1, 2] ],
        [ [2, 0], [2, 1], [2, 2] ],

        // cols
        [ [0, 0], [1, 0], [2, 0] ],
        [ [0, 1], [1, 1], [2, 1] ],
        [ [0, 2], [1, 2], [2, 2] ],

        //diagonal
        [ [0, 0], [1, 1], [2, 2] ],
        [ [0, 2], [1, 1], [2, 0] ]
    ];

    for (const win of wins) {
        const [a, b, c] = win;
        const valA = board[a[0]][a[1]].getValue();
        const valB = board[b[0]][b[1]].getValue();
        const valC = board[c[0]][c[1]].getValue();

        if (valA !== "_" && valA === valB && valA === valC) {
            return valA;
        }
    }

    return null;
}

function startGame() {
    const game = GameController();

    const board = game.getBoard();

    let moves = 0;
    const maxMoves = 9;

    while (moves < maxMoves) {
        const player = game.getActivePlayer();

        // input
        // const row = parseInt(prompt(`${player.name}, enter row (0-2): `));
        // const col = parseInt(prompt(`${player.name}, enter column (0-2): `));

        if (isNaN(row) || isNaN(col)) {
            console.log("Invalid input! Must be a number 0–2.");
            continue;
        }
        else if (row < 0 || row > 2 || col < 0 || col > 2) {
            console.log("Invalid position! Pick row and col between 0 and 2");
            continue;
        }
        else if (board[row][col].getValue() !== "_") {
            console.log("Cell already taken! Pick again.");
            continue;
        }

        //check for winner logic
        const winner = checkWinner(board);
        if (winner === 'x') {
            console.log("Player One Won!");
            return;
        }
        else if (winner === 'o') {
            console.log("Player Two Won!");
            return;
        }

        game.playRound(row, col);
        moves++;  
    }
    console.log("Game over! It's a draw.");
}

function displayGame() {
    const game = GameController();
    const playerTurn = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const row0 = document.querySelector('.row0');
    const row1 = document.querySelector('.row1');
    const row2 = document.querySelector('.row2');

    const updateScreen = () => {
        row0.textContent = "";
        row1.textContent = "";
        row2.textContent = "";

        //gets newest version of board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        //display player's turn
        playerTurn.textContent = `${activePlayer.name}'s turn...`

        // render tic-tac-toe board 
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.textContent = cell.getValue();
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.col = colIndex;

                if (rowIndex === 0) row0.appendChild(cellButton);
                else if (rowIndex == 1) row1.appendChild(cellButton);
                else row2.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;
        if (row === undefined || col === undefined) return;

        game.playRound(parseInt(row), parseInt(col));
        
        updateScreen();
        const winner = checkWinner(game.getBoard());
        if (winner) {
            playerTurn.textContent = winner === "x" ? "Player One Won!" : "Player Two Won!";
            row0.removeEventListener("click", clickHandlerBoard);
            row1.removeEventListener("click", clickHandlerBoard);
            row2.removeEventListener("click", clickHandlerBoard);
            return;
        }
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
}   

displayGame();
// startGame();

