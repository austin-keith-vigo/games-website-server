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
        return this.currentPlayerTurn;
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
            str += '\n';
        }
        str = str.substring(0,str.length - 1);
        return str;
    }


}