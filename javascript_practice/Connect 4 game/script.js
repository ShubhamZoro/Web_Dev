var playerRed="R";
var playerYello="Y";
var currPlayer=playerRed;
var gameOver=false;
var board;
var currColumns;
var rows=6;
var columns=7;
window.onload=function(){
    setGame();
}

function setGame(){
    board=[];
    currColumns=[5,5,5,5,5,5,5];
    for(let r=0;r<rows;r++){
        let row=[];
        for(let c=0;c<columns;c++){
            row.push(' ');
            let tile=document.createElement('div')
            tile.id=r.toString() + "_" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click",setPiece);
            document.getElementById('board').append(tile);
        }
        board.push(row);
    }

}

function setPiece(){
    if(gameOver){
        return;
    }
    let coords=this.id.split("_");
    let r=parseInt(coords[0]);
    let c=parseInt(coords[1]);
    r=currColumns[c];
    if(r<0){
        return ;
    }
    board[r][c]=currPlayer;
    let tile=document.getElementById(r.toString()+ "_"+c.toString());
    if(currPlayer==playerRed){
        tile.classList.add("red-piece");
        currPlayer=playerYello;
    }
    else{
        tile.classList.add("yello-piece");
        currPlayer=playerRed;
    }

r-=1;
currColumns[c]=r;
checkWinner();
}

function checkWinner() {
    // horizontal
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++){
           if (board[r][c] != ' ') {
               if (board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2] && board[r][c+2] == board[r][c+3]) {
                   setWinner(r, c);
                   return;
               }
           }
        }
   }

   // vertical
   for (let c = 0; c < columns; c++) {
       for (let r = 0; r < rows - 3; r++) {
           if (board[r][c] != ' ') {
               if (board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c] && board[r+2][c] == board[r+3][c]) {
                   setWinner(r, c);
                   return;
               }
           }
       }
   }

   // anti diagonal
   for (let r = 0; r < rows - 3; r++) {
       for (let c = 0; c < columns - 3; c++) {
           if (board[r][c] != ' ') {
               if (board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2] && board[r+2][c+2] == board[r+3][c+3]) {
                   setWinner(r, c);
                   return;
               }
           }
       }
   }

   // diagonal
   for (let r = 3; r < rows; r++) {
       for (let c = 0; c < columns - 3; c++) {
           if (board[r][c] != ' ') {
               if (board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2] && board[r-2][c+2] == board[r-3][c+3]) {
                   setWinner(r, c);
                   return;
               }
           }
       }
   }
}

function setWinner(r, c) {
   let winner = document.getElementById("winner");
   if (board[r][c] == playerRed) {
       winner.innerText = "Red Wins";             
   } else {
       winner.innerText = "Yellow Wins";
   }
   gameOver = true;
}

