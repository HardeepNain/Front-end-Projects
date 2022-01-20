let canvas = document.querySelector("#canvas");

canvas.width = window.innerWidth;   // hum canvas ki width aur height css se set nhi karte
canvas.height = window.innerHeight - 100;

window.addEventListener("resize", function () {  // jab bhi window ki height width change hogi to saath me canvas ki width height ki alter hogi iss event ki wajah se
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 100;
  drawLinesFromDB();
});

// canvas drawing gets erased on window resize ???

// a context object which provides fun for 2d drawing
let ctx = canvas.getContext("2d");

let linesDB = [];
let redoLinesDB = [];
let isPenDown = false;
let line = [];

canvas.addEventListener("mousedown", function (e) {
  if (redoLinesDB.length) {  // agr undo karte karte koi nyi line draw kardi to redoLinesDB ko hum khali kar denge taki redo ki fxn disable ho jaaye
    redoLinesDB = [];
  }
  console.log("Inside mouse down");
  isPenDown = true;
  let x = e.clientX;  // clientX and clientY wo point hote hai jaha pe mouse point kar rha hota hai
  let y = e.clientY - 100;
  ctx.beginPath();  // used to start a line path. Jab tak ye dobara se nhi likha jaayega tab tak nyi line start nhi hogi
  ctx.moveTo(x, y);  // ye line ka beginig point hota hai 
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

canvas.addEventListener("mousemove", function (e) {
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

canvas.addEventListener("mouseup", function (e) {
  console.log("mouseup");
  isPenDown = false;

  linesDB.push(line);
  line = [];

  console.log(linesDB);
});
