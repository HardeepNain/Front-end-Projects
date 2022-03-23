let canvas = document.querySelector("#canvas");

canvas.width = window.innerWidth; // hum canvas ki width aur height css se set nhi karte usse drawing area faded ho jaata hai
canvas.height = window.innerHeight - 100; // icons ko chodke baki height canvas le lega

window.addEventListener("resize", function() { // jab bhi window ki height width change hogi to saath me canvas ki width height ki alter hogi iss event ki wajah se
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 100;

    // canvas drawing gets erased on window resize ???
    
    drawLinesFromDB(); // resize pe drawing ht rhi thi to humne is fxn ko idhar likh diya ab jab bhi resize hoga ye fxn drawing ko dobara se bna dega

});


// a context object which provides fun for 2d drawing
let ctx = canvas.getContext("2d");


let linesDB = []; // [#3]
let redoLinesDB = []; // [#4]
let isPenDown = false;
let line = [];

canvas.addEventListener("mousedown", function(e) {
    if (redoLinesDB.length) { // agr undo karte karte koi nyi line draw kardi to redoLinesDB ko hum khali kar denge taki redo ki fxn disable ho jaaye
        redoLinesDB = [];
    }
    redo.classList.add('fade'); // taki mousedown pe redo fade ho jaaye // redo tools me nikal rkha hai

    console.log("Inside mouse down");
    isPenDown = true;
    let x = e.clientX; // clientX and clientY wo point hote hai jaha pe mouse point/click kar rha hota hai
    let y = e.clientY - 100; // why -100 [#2.ON]
    ctx.beginPath(); // used to start a line path. Jab tak ye dobara se nhi likha jaayega tab tak nyi line start nhi hogi
    ctx.moveTo(x, y); // ye line ka beginig point hota hai [#1.ON]
    // moveTo se lineTo ke bich to line hoti hai lekin lineTo se moveTo ke bich me koi line nhi hoti 
    // lekin jo nyi line alag banti hai wo bhi usi pahle wali line ka hi ek subpart hoti hai
    let pointObject = {
        x: x,
        y: y,
        type: "md",
        lineWidth: ctx.lineWidth,
        strokeStyle: ctx.strokeStyle,
    };
    line.push(pointObject);
});

canvas.addEventListener("mousemove", function(e) {
    if (isPenDown) {
        console.log("Inside mousemove");
        let x = e.clientX;
        let y = e.clientY - 100;
        ctx.lineTo(x, y);
        ctx.stroke();

        let pointObject = {
            x: x,
            y: y,
            type: "mm",
        };
        line.push(pointObject);
    }
});

canvas.addEventListener("mouseup", function(e) {
    console.log("mouseup");
    isPenDown = false;

    linesDB.push(line);
    line = [];

    console.log(linesDB);
});


/*===================toggle theme script===================== */

const chk = document.getElementById('chk');
const toolContent = document.querySelector('.tools-content');
const toolContainer = document.querySelector('.tools-container');
const toggleDiv = document.querySelector('.label');
const ball = document.querySelector('.ball');

chk.addEventListener('change', () => {
    console.log('checkbox changed');
    canvas.classList.toggle('canvas-dark');
    toolContent.classList.toggle('tools-content-dark');
    toolContainer.classList.toggle('tools-container-dark');
    toggleDiv.classList.toggle('night');
    ball.classList.toggle('dark-ball');
    
    if (taskbarDiv) {
        taskbarDiv.classList.toggle('dark-s-taskbar');
        taskbarDiv.classList.toggle('light-s-taskbar');
    }

    penOptions.classList.toggle('tool-options-dark');
    eraserOptions.classList.toggle('tool-options-dark');
    
    changeCanvas();

    if (canvas.classList.contains('canvas-dark')) {
        console.log('toggle check - dark theme');
        if (currentPenColor == 'black') {
            currentPenColor = 'white';   
        }
        currentEraserColor = 'black';
        if (pen.classList.contains("active-tool")) {
            ctx.strokeStyle = currentPenColor;
        } else {
            ctx.strokeStyle = currentEraserColor;
        }
    } else {
        console.log('toggle check - light theme');
        if (currentPenColor == 'white') {
            currentPenColor = 'black';
        }
        currentEraserColor = 'white';
        if (pen.classList.contains("active-tool")) {
            ctx.strokeStyle = currentPenColor;
        } else {
            ctx.strokeStyle = currentEraserColor;
        }
    }

    penColors[0].classList.toggle('black');
    penColors[0].classList.toggle('white');
});

// iss fxn ka kaam hai theme toogle hone pe canvas ka color change krna
function changeCanvas() {
    if (canvas.classList.contains('canvas-dark')) {
        console.log('black canvas');
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        alterPointObjectStroke();
    } else {
        console.log('white canvas');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        alterPointObjectStroke();
    }
}

/*
#3. undo functionality - Check Video
#4. redo functionality - Check Video
*/