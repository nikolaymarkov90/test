//игра запускатся при клике по любой ячейке игрового поля

for (var i = 0; i < 9; i++) {
    document.getElementById('game-area').innerHTML += '<div class="cell"></div>';
}
var comb = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [6, 4, 2]
]; //Массив всех возможных победных комбинаций

var step = 0; //Ход
var player = 0; //Текущий игрок
var allCells = document.getElementsByClassName('cell');
var win = false; //победа

function game() {
    step++;
    if (checkWinner() == true) {
        win = true;
        if (player == 0) {
            getModalWindow(0);
        } else {
            getModalWindow(1);
        }
    } else if (step == 9) {
        getModalWindow(2);
    } else if (win == false) {
        if (step != 0) {
            if (player == 0) player = 1;
            else player = 0;
        }
        if (player == 1) {
            var numWinPlayer = checkNextStepWin('x');
            var numWinAi = checkNextStepWin('0');
            if (numWinAi != undefined)
                aiStep(false, numWinAi, '');
            else if (numWinPlayer != undefined) {
                aiStep(false, numWinPlayer, '');
            } else {
                var mass = getMassEmptyCells();
                var rand = mass[Math.floor(Math.random() * mass.length)];
                aiStep(true, '', rand);
            }
        }
    }
}

function reset() {
    step = 0;
    player = 0;
    win = false;
    for (var i = 0; i < 9; i++) {
        allCells[i].innerHTML = "";
    }
}
//возвращает массив индексов свободных ячеек
function getMassEmptyCells() {
    var mass = [];
    for (var i = 0; i < allCells.length; i++) {
        if (allCells[i].innerHTML == '') {
            mass.push(i);
        }
    }
    return mass;
}
//проверка на выигрышную комбинацию
function checkWinner() {
    var win = false;
    for (var i = 0; i < comb.length; i++) {
        var c = comb[i];
        if (
            allCells[c[0]].innerHTML == allCells[c[1]].innerHTML &&
            allCells[c[1]].innerHTML == allCells[c[2]].innerHTML &&
            allCells[c[0]].innerHTML != ''
        ) {
            win = true;
        }
    }
    return win;
}
// проверка следующего хода на возможность выиграть или проиграть для ии
function checkNextStepWin(value) {
    for (var i = 0; i < comb.length; i++) {
        var c = comb[i];
        if (
            ((allCells[c[0]].innerHTML == allCells[c[1]].innerHTML) && allCells[c[0]].innerHTML == value &&
                allCells[c[2]].innerHTML == '') ||
            ((allCells[c[1]].innerHTML == allCells[c[2]].innerHTML) && allCells[c[1]].innerHTML == value &&
                allCells[c[0]].innerHTML == '') ||
            ((allCells[c[0]].innerHTML == allCells[c[2]].innerHTML) && allCells[c[0]].innerHTML == value &&
                allCells[c[1]].innerHTML == '')
        ) {
            return i;
        }
    }
}
//ходы ии
function aiStep(modeGen, i, genNumber) {
    var c = comb[i];
    if (modeGen == true) {
        allCells[genNumber].innerHTML = '0';
    } else {
        var c = comb[i];
        if (allCells[c[0]].innerHTML == '')
            allCells[c[0]].innerHTML = '0';
        else if (allCells[c[1]].innerHTML == '')
            allCells[c[1]].innerHTML = '0';
        else if (allCells[c[2]].innerHTML == '')
            allCells[c[2]].innerHTML = '0';
    }
    game();
}

//обработчик кликов игрока по ячейкам
document.getElementById("game-area").addEventListener("click", function (event) {
    if (event.target.className == 'cell' && event.target.innerHTML == '' && win == false) {
        event.target.innerHTML = 'x';
        setTimeout(game, 200);
    }
});

//обработчик нажатия кнопки "начать заново"
document.getElementById("new-game").addEventListener("click", function () {
    reset();
});

//Создает и выводит модальное окно при завершении игры
function getModalWindow(value) {
    var text;
    if (value == 0)
        text = "Поздравляю!!!! <br> Вы победили!";
    else if (value == 1)
        text = "Вы проиграли!!!";
    else
        text = "Ничья";
    var html = '<div id = "modal-bg" class="modal-bg"><div class="modal-window"><div><p>' + text + '</p><button class = "btn1" id="new-game-modal">Начать заново</button></div></div>';
    if (!(document.getElementById("modal-bg"))) {
        document.body.insertAdjacentHTML("beforeend", html);
    }
    document.getElementById("new-game-modal").addEventListener("click", function () {
        document.getElementById("modal-bg").remove();
        setTimeout(reset, 200);

    });
}