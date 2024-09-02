var numSelected = null;
var tileSelected = null;
var errors = 0;
var timer;
var time = 0;

var easyBoard = [
    "--74916-5",
    "2---6-3-9",
    "-----7-1-",
    "-586----4",
    "--3----9-",
    "--62--187",
    "9-4-7---2",
    "67-83----",
    "81--45---"
];

// Example of different levels (just reuse the current one for demonstration)
var mediumBoard = [...easyBoard];
var hardBoard = [...easyBoard];

var solution = [
    "387491625",
    "241568379",
    "569327418",
    "758619234",
    "123784596",
    "496253187",
    "934176852",
    "675832941",
    "812945763"
];

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        time++;
        document.getElementById("timer").innerText = formatTime(time);
    }, 1000);
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function newGame() {
    errors = 0;
    time = 0;
    document.getElementById('errors').innerText = `Errors: ${errors}`;
    setGame();
    startTimer();
}

window.onload = function() {
    setGame();
    startTimer();
}

function setGame(difficulty = 'easy') {
    // Adjust board based on difficulty
    let board = difficulty === 'medium' ? mediumBoard : difficulty === 'hard' ? hardBoard : easyBoard;
    
    document.getElementById("board").innerHTML = '';
    document.getElementById("digits").innerHTML = '';

    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.classList.add("number");
        number.addEventListener("click", selectNumber);
        document.getElementById('digits').appendChild(number);
    }

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            if (board[r][c] !== '-') {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener('click', selectTile);
            document.getElementById("board").appendChild(tile);
        }
    }
}

function selectNumber() {
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    console.log(numSelected)
    
    if (numSelected) {
        if (this.innerText !== "") {
            return;
        }

        let coords = this.id.split('-');
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solution[r][c] === numSelected.id) {
            this.innerText = numSelected.id;
        } else {
            errors++;
            
            document.getElementById('errors').innerText = `Errors: ${errors}`;
        }
    }
}
