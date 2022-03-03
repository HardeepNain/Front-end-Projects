// Game Constants & Variables
let board = document.querySelector('#board')
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('./music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let easyDiv = document.querySelector(".easy");
let medDiv = document.querySelector(".medium");
let hardDiv = document.querySelector(".hard");
let speed = 10;
easyDiv.addEventListener("click", function() {
    console.log("easy");
    let selectedDiv = document.querySelector(".select");
    selectedDiv.classList.remove("select");
    console.log(selectedDiv);
    easyDiv.classList.add("select");
    speed = 10;
})
medDiv.addEventListener("click", function() {
    console.log("med");
    // document.querySelector(".select").classList.remove(".select");
    let selectedDiv = document.querySelector(".select");
    console.log(selectedDiv);
    selectedDiv.classList.remove("select");
    medDiv.classList.add("select");
    speed = 20;
})
hardDiv.addEventListener("click", function() {
    console.log("hard");
    // document.querySelector(".select").classList.remove(".select");
    let selectedDiv = document.querySelector(".select");
    console.log(selectedDiv);
    selectedDiv.classList.remove("select");
    hardDiv.classList.add("select");
    speed = 30;
})

let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
];

food = { x: 6, y: 7 };
let flag = true;
// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    // console.log(ctime)
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If you bump into the wall
    if (snake[0].x >= 23 || snake[0].x <= 0 || snake[0].y >= 23 || snake[0].y <= 0) {
        return true;
    }

    return false;
}

function gameEngine() {
    // Part 1: Updating the snake array & Food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        // alert("Game Over. Press any key to play again!");
        snakeArr = [{ x: 13, y: 15 }];
        // musicSound.play();
        let scoreCardDiv = document.createElement("div");
        scoreCardDiv.classList.add("score-card");

        scoreCardDiv.innerHTML = `<div class="go">
        <h1 class="ctn">Game Over!</h3>
        </div>
        <div class="ys">
        <h2 class="ctn">Your Score : ${score} </h4>
        </div>`

        // <div>
        //     <button class="btn">OK</button>
        // </div>
        let okButton = document.createElement("button");
        okButton.classList.add("btn");
        okButton.textContent = "OK";
        score = 0;

        okButton.addEventListener("click", function() {
            document.querySelector(".score-card").remove();
            flag = true;
        });

        scoreCardDiv.append(okButton);
        // board.append(scoreCardDiv);
        document.querySelector(".body").append(scoreCardDiv);
        flag = false;

    }
    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 21;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }
    }

    // Moving the snake
    if (flag) {
        for (let i = snakeArr.length - 2; i >= 0; i--) {
            // musicSound.play();
            snakeArr[i + 1] = {...snakeArr[i] };
        }

        snakeArr[0].x += inputDir.x;
        snakeArr[0].y += inputDir.y;
    }
    // Part 2: Display the snake and Food
    // Display the snake
    board.innerHTML = ""; // taki har baar nye start pe nya snake na bane
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('snakeHead');
        } else {
            snakeElement.classList.add('snakeBody');
        }
        board.appendChild(snakeElement);
    });
    // Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement);


}


// Main logic starts here
musicSound.play();
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
} else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

// why to use window.requestAnimationFrame  over settimeout/setinterval  --> https://stackoverflow.com/questions/38709923/why-is-requestanimationframe-better-than-setinterval-or-settimeout
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    inputDir = { x: 0, y: 1 } // Start the game
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }

});