module.exports = class ConnectFour{
    
    constructor(player1, player2) {
        this.board = [[]];
        this.height = 6;
        this.width = 6;

        // Initialize all pieces to zero
        for( row = 0; row < this.height; ++row ) {
            for( col = 0; col < this.width; ++col ) {
                this.board[row][col] = 0;
            }
        }
    }


}