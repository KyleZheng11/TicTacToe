/*
    - GameBoard is the state of the 3x3 board
    - Each square should hold a Cell
    - we use an addState method to be able to add a Cell to each square (x or o)
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

    const addState = (row, col, player) => {
        // need to check if the cell of row, col contains a value already
        // if not, then we add a Cell to it, if it does, then we ask the user to pick again

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
    let value = 0;

    const addState = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addState,
        getValue
    };
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = GameBoard();

    const players = [
        
    ]
}