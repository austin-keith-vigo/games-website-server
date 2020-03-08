module.exports = class TicTacToe {
    constructor() {
        this.height = 3;
        this.width = 3;
        this.board = new Array(3);
        this.currentPlayerTurn = 1;

        // Initialize board
        for( var row = 0; row < this.height; ++row ) {
            this.board[row] = new Array(3);
            for( var col = 0; col < this.width; ++col) {
                this.board[row][col] = 0;
            }
        }
    }
    /*
    Class Methods
    */

    // Current player marks this spot.
    // Error handling should be done by the client
    move(row, col) {
        this.board[row][col] = this.currentPlayerTurn;
        if(this.currentPlayerTurn == 1) {
            this.currentPlayerTurn = 2;
        }
        else {
            this.currentPlayerTurn = 1;
        }

        // Check if their is a winner
    }

    /*
    Accessors
    */
    getHeight() {
        return this.height;
    }
    getWidth() {
        return this.width;
    }
    getBoard() {
        return this.board;
    }
    getTurn() {
        return this.currentPlayerTurn.toString();
    }
    getPosition(row,col) {
        return this.board[row][col];
    }
    toString(){
        var str = '';
        for(var row = 0; row < this.height; ++row) {
            for(var col = 0; col < this.width; ++col) {
                str += this.board[row][col];
            }
        }
        return str;
    }


}