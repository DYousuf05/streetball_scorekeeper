const reset = document.querySelector('#reset');
const winSelect = document.querySelector('#playTo');
const playerSelect = document.querySelector('#playerNum');
const gameDropdown = document.querySelector('#gameDropdown');
const gameSelect = document.querySelector('#gameSelect');
const gameButton = document.querySelector('.dropdown-item');
const gameDisplay = document.querySelector('#gameType');
const symbols = document.querySelectorAll('.symbol');
const options = document.querySelectorAll('.dropdown-item');
const scoreLabel = document.querySelector('#scoreLabel');
const scoreTable = document.querySelector('#scoreTable');
const amountCol = document.querySelector('#amountCol');
const addCol = document.querySelector('#addCol');
const addColButton = document.querySelectorAll('.addColButton');

let winningScore = 3;
let hasWon = false;
let players = 3;
let newGame = "classic";
let noOfHorses = 0;

const p1 = {
    score: 0,
    button: document.querySelector('#add1'),
    display: document.querySelector('#score1')
}

const p2 = {
    score: 0,
    button: document.querySelector('#add2'),
    display: document.querySelector('#score2')
}

function updateScores(player, opponent) {
    if (!hasWon) {
        player.score++;
        player.display.innerText++;
        if (player.score === winningScore) {
            hasWon = true;
            player.display.classList.add('has-text-success');
            opponent.display.classList.add('has-text-danger');
            player.button.disabled = true;
            opponent.button.disabled = true;
        }
    } 
}

options.forEach((option) => {
    option.addEventListener('mouseenter', function(e){
        const symbol = option.querySelector('i');
        if (symbol) {
            symbol.classList.add("fa-bounce");
        }
    })
    option.addEventListener('mouseleave', function(e){
        const symbol = option.querySelector('i');
        if (symbol) {
            symbol.classList.remove("fa-bounce");
        }
    })
})

addColButton.forEach((button) => {
    button.addEventListener('click', function(e) {
        addToTable(button.parentElement.parentElement.rowIndex);
    })
})

p1.button.addEventListener('click', function(e) {
    updateScores(p1, p2);
})

p2.button.addEventListener('click', function(e) {
    updateScores(p2, p1);
})

gameDropdown.addEventListener('click', function(e) {
    gameSelect.classList.toggle("is-active");
})

winSelect.addEventListener('change', function(e) {
   winningScore = parseInt(this.value);
   resetScore();
})

playerSelect.addEventListener('change', function(e) {
    players = parseInt(this.value);
    resetScore();
    horseSetup();
})

reset.addEventListener('click', function(e) {
   resetScore();
})

function animate(e) {
    e.preventDefault();
    symbols.forEach(symbol => {
        symbol.classList.add("fa-bounce");
    })
}

function resetScore() {
    for (let p of [p1,p2]){
        p.display.innerText = 0;
        p.score = 0;
        p.display.classList.remove('has-text-success', 'has-text-danger');
        p.button.disabled = false;
    }
    for (let i = 1, row; row = scoreTable.rows[i]; i++) {
        row.cells[1].innerText = "";
        row.cells[2].querySelector('button').disabled = false
        row.cells[1].classList.remove('has-text-success', 'has-text-danger')
        row.cells[0].classList.remove('has-text-success', 'has-text-danger')
    }
    hasWon = false;
    noOfHorses = 0;
}

function addToTable(playerNumber) {
    //console.log("ee er")
    if (newGame == "horse") {
        const letters = ['H', 'O', 'R', 'S', 'E']
        let currentData = scoreTable.rows[playerNumber].cells[1].innerText;
        if (currentData != "HORSE") {
            currentData += letters[currentData.length]
            scoreTable.rows[playerNumber].cells[1].innerText = currentData
            if (currentData === "HORSE") {
                scoreTable.rows[playerNumber].cells[0].classList.add("has-text-danger");
                scoreTable.rows[playerNumber].cells[1].classList.add("has-text-danger");
                scoreTable.rows[playerNumber].cells[2].querySelector('button').disabled = true;
                noOfHorses++;
                if (noOfHorses == players - 1) {
                    for (let i = 1, row; row = scoreTable.rows[i]; i++) {
                        if (row.cells[1].innerText != "HORSE") {
                            alert(`Player ${i} Wins!`)
                            row.cells[0].classList.add("has-text-success")
                            row.cells[1].classList.add("has-text-success")
                            row.cells[2].querySelector('button').disabled = true;
                        }
                    }
                }
            }
        }
    }
    else if (newGame == "kings") {
        let currentData = scoreTable.rows[playerNumber].cells[1].innerText;
        if (currentData != winningScore) {
            currentData++;
            scoreTable.rows[playerNumber].cells[1].innerText = currentData
            if (currentData === winningScore) {
                for (let i = 1, row; row = scoreTable.rows[i]; i++) {
                    if (row.cells[1].innerText == winningScore) {
                        alert(`Player ${i} Wins!`)
                        row.cells[0].classList.add("has-text-success")
                        row.cells[1].classList.add("has-text-success")
                    }
                    else {
                        row.cells[0].classList.add("has-text-danger")
                        row.cells[1].classList.add("has-text-danger")
                    }
                    row.cells[2].querySelector('button').disabled = true;
                }
            }
        }
    }
}

function tableSetup() {
    const count = scoreTable.rows.length - 1;
    if (count < players) {
        for (let i = count + 1; i <= players; i++) {
            let newRow = scoreTable.insertRow(-1);
            let newCell0 = newRow.insertCell(0);
            let newCell1 = newRow.insertCell(1);
            let newCell2 = newRow.insertCell(2);
            newCell0.innerText = "Player " + i
            newCell2.innerHTML = `<button id="playerAdd${i}" class="button has-background-info addColButton">Add</button>`;
            newCell2.querySelector('button').addEventListener('click', (e) => addToTable(newCell2.querySelector('button').parentElement.parentElement.rowIndex))
        }
    }
    else if (count > players) {
        for (let i = count + 1; i > players + 1; i--) {
            let newRow = scoreTable.deleteRow(-1);
        }
    }
}

function kingsSetup() {
    amountCol.innerText = "Wins";
    addCol.innerText = "+1 Win";
    tableSetup()
}

function horseSetup() {
    amountCol.innerText = "Letters";
    addCol.innerText = "+1 Letter";
    tableSetup()
}

function gameChange(e, element) {
    e.preventDefault();
    newGame = element.id;
    resetScore();
    if (newGame == "classic") {
        scoreLabel.style.visibility = "visible";
        scoreTable.style.visibility = "collapse";
        p1.button.style.display = "block";
        p2.button.style.display = "block";
        winSelect.disabled = false;
        playerSelect.disabled = true;
    }
    else if (newGame == "kings") {
        scoreLabel.style.visibility = "collapse";
        scoreTable.style.visibility = "visible";
        p1.button.style.display = "none";
        p2.button.style.display = "none";
        winSelect.disabled = false;
        playerSelect.disabled = false;
        kingsSetup();
    }
    else {
        scoreLabel.style.visibility = "collapse";
        scoreTable.style.visibility = "visible";
        p1.button.style.display = "none";
        p2.button.style.display = "none";
        winSelect.disabled = true;
        playerSelect.disabled = false;
        horseSetup();
    }
    // console.log("click");
    gameSelect.classList.toggle("is-active");
    const gameTypeMap = {
        classic: "Classic",
        kings: "King's Court",
        horse: "H.O.R.S.E"
    };

    gameDisplay.innerText = gameTypeMap[element.id]
}