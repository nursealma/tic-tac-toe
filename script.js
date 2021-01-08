const randomToggle = document.getElementById('randomToggle');
const keynavToggle = document.getElementById('keynavToggle');
const errorContainer = document.querySelector('.error-container');
const resumeButton = document.getElementById('resumeButton');
const gameoverContainer = document.querySelector('.gameover-container');
const gameoverText = document.getElementById('gameoverText');
const restartButton = document.getElementById('restartButton');

const domBoxes = Array.from(document.getElementsByClassName('box'));
let virtualBoxes = [ 0, 1, 2, 3, 4, 5, 6, 7, 8];
const blue = "#235789";
const yellow = "#F1D302";
let currentPlayer = blue;

const buildGame = () => {
    document.addEventListener('keydown', handleKeys);
    domBoxes.forEach(box => box.addEventListener('click', boxClicked));
    restartButton.addEventListener('click', restartClicked);
    keynavToggle.addEventListener('change', handleKeys);
    resumeButton.addEventListener('click', resumeClicked);
    if (keynavToggle.checked) { 
        document.getElementById("4").focus();
        }
    }

const boxClicked = (e) => {
    if (e.target.classList.contains('box')) {
        const id = e.target.id;
        if (randomToggle.checked) {
            selectRandomBox();
        } else if (typeof virtualBoxes[id] === "string") {
            errorContainer.classList.add('modal-active');
        } else {
            virtualBoxes[id] = currentPlayer;
            e.target.style.backgroundColor = currentPlayer;
            checkWin();
            currentPlayer = currentPlayer === blue ? yellow : blue;
        }
    }   
}
    
const checkWin = () => {
    const winningSets = [ [0,1,2], [0,3,6], [0,4,8], [1,4,7], [2,4,6], [2,5,8], [3,4,5], [6,7,8] ];
    let victory = false;
    winningSets.forEach( (set) => {
        const sequence = [virtualBoxes[set[0]], virtualBoxes[set[1]], virtualBoxes[set[2]]];
        if (sequence[0] === sequence[1] && sequence[0] === sequence[2]) {
            victory = true;
        }
        if (!victory && virtualBoxes.every(e => {return typeof e === "string"})) {
            domBoxes.forEach(box => box.removeEventListener('click', boxClicked));
            document.removeEventListener('keydown', handleKeys)
            gameoverContainer.classList.add('modal-active');
            restartButton.focus();
            gameoverText.innerHTML = `DRAW! Tweet About It or Play Again!`;
        }
        if (victory) {
            domBoxes.forEach(box => box.removeEventListener('click', boxClicked));
            document.removeEventListener('keydown', handleKeys)
            gameoverContainer.classList.add('modal-active');
            restartButton.focus();
            gameoverText.innerHTML = `Congratulations ${currentPlayer === blue ? "BLUE" : "YELLOW"}! Tweet about your victory or play again!`;
        }
    })
}

const restartClicked = () => {
    gameoverContainer.classList.remove('modal-active');
    virtualBoxes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    domBoxes.forEach(box => { box.style.backgroundColor = null });
    buildGame();
    currentPlayer = blue;
    if (keynavToggle.checked) {
        document.getElementById("4").focus()
    }
}

const resumeClicked = () => {
     errorContainer.classList.remove('modal-active')
}

const selectRandomBox = () => {
    const emptyVirtualBoxes = () => virtualBoxes.filter(box => typeof box != "string");
    const getRandomBox = () => emptyVirtualBoxes()[Math.floor(Math.random() * emptyVirtualBoxes().length)]
    const  randomEmptyBox = getRandomBox();
    virtualBoxes[randomEmptyBox] = currentPlayer;
    domBoxes[randomEmptyBox].style.backgroundColor = currentPlayer;
    checkWin();
    currentPlayer = currentPlayer === blue ? yellow : blue
}

const handleKeys = (e) => {
    if (keynavToggle.checked) { 
        document.getElementById("4").focus();
    }
    let keycode = e.keyCode;
    let domBox = e.target;
    const arrowkeyMap = {38:-3, 40:3, 39:1, 37:-1}
    if (keycode == 13 || keycode == 32) {
        boxClicked(e);
    }
    if (arrowkeyMap[keycode]) {
        if (domBox.id) {
            if (domBoxes[parseInt(domBox.id) + arrowkeyMap[keycode]]) {
                domBoxes[parseInt(domBox.id) + arrowkeyMap[keycode]].focus();
            }
        }
    }
}

buildGame();
