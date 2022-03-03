document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  for (let j = 0; j < 300; j++) {
    let gridSinglediv = document.createElement("div")
    grid.append(gridSinglediv)  
  }
  for (let j = 0; j < 15; j++) {
    let gridSingledivTaken = document.createElement("div")
    gridSingledivTaken.classList.add("taken");
    grid.append(gridSingledivTaken)  
  } 
  const minigrid = document.querySelector('.mini-grid')
  for (let j = 0; j < 16; j++) {
    let minigridSinglediv = document.createElement("div")
    minigrid.append(minigridSinglediv)  
  }   
  const clickSound = new Audio("./move.mp3");    
  const vanishSound = new Audio("./vanish.mp3");    
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const pauseBtn = document.querySelector('#pause-button')
  const width = 15
  let nextRandom = 0
  console.log(nextRandom);
  let timerId
  let score = 0
  let flag = true;
  let sflag = true;
  let pflag = false;
  const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
  ]

  //The Tetrominoes
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4
  let currentRotation = 0

  console.log(theTetrominoes[0][0])

  //randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random()*theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]
  console.log(random);
  //draw the Tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add(colors[random]); 
      // squares[currentPosition + index].classList.add('tetromino')
      // squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  //undraw the Tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove(colors[random]);
      // squares[currentPosition + index].classList.remove('tetromino')
      // squares[currentPosition + index].style.backgroundColor = ''

    })
  }

  //assign functions to keyCodes
  function control(e) {
    if(e.keyCode === 37) {
      moveLeft()
      clickSound.play();

    } else if (e.keyCode === 38) {
      rotate()
      clickSound.play();

    } else if (e.keyCode === 39) {
      moveRight()
      clickSound.play();

    } else if (e.keyCode === 40) {
      moveDown()
      clickSound.play();
    }
  }
  document.addEventListener('keyup', control)

  //move down function
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  //freeze function
  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //start a new tetromino falling
      random = nextRandom
      console.log(random);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      console.log(nextRandom);
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  //move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge) currentPosition -=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1
    }
    draw()
  }

  //move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    if(!isAtRightEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1
    }
    draw()
  }

  
  ///FIX ROTATION OF TETROMINOS A THE EDGE 
  function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
  }
  
  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }
  
  function checkRotatedPosition(P){
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }
  
  //rotate the tetromino
  function rotate() {
    undraw()
    currentRotation ++
    if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    checkRotatedPosition()
    draw()
  }
  /////////

  
  
  //show up-next tetromino in mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0


  //the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
  ]

  //display the shape in the mini-grid display
  function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach(square => {
      square.classList.remove(colors[random]);
      // square.classList.remove('tetromino')
      // square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add(colors[nextRandom]);
      // displaySquares[displayIndex + index].classList.add('tetromino')
      // displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  //add functionality to the button
  startBtn.addEventListener('click', () => {
    if(sflag){
      draw()
      timerId = setInterval(moveDown, 1000)
      if(flag){
        nextRandom = Math.floor(Math.random()*theTetrominoes.length);
        console.log(nextRandom);
        flag = false;
      }
      displayShape()
      pflag = true;
      sflag = false;
    }
  })
  pauseBtn.addEventListener('click', () => {
    if(pflag){
      if (timerId) {
        clearInterval(timerId)
        timerId = null
        pflag = false;
        sflag = true;
      }
    }
})
  //add score
  function addScore() {
    for (let i = 0; i < 299; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9,i+10,i+11,i+12,i+13,i+14]

      if(row.every(index => squares[index].classList.contains('taken'))) {
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          // squares[index].classList.remove(colors[random]);
          // squares[index].classList.remove(colors[nextRandom]);
          // squares[index].classList.remove('tetromino')
          // squares[index].style.backgroundColor = ''
          squares[index].classList = '';
        })
        const squaresRemoved = squares.splice(i, width)
        vanishSound.play();
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  //game over
  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }

})
