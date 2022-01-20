let cellsContainer = document.querySelector(".cells");

let sheetsDB = []; // jab bhi koi nyi sheet add hogi to iss sheetDB me ek nya object push hoga jisme us sheet ka db aur us sheet me visited cells kon konsi hai uski information hogi
let db; // points to current DB. DB koi actual database nhi hai balki bas ek array jisme humne values store krwayi hai
let visitedCells; // points to current visited cells // visitedCells ek array hai jisme jo cells visit ho chuke hai unke i aur j ki values pdi hogi

function initCells() { // ye fxn cells create karta hai 

    // logic to create top left cell = chota sa fixed div number ke uper wala 
    let cellsContent = '<div class="top-left-cell"></div>';

    // logic for creating a-z cells 
    cellsContent += '<div class="top-row">'; // ek row ka div banaya
    for (let j = 0; j < 26; j++) {
        cellsContent += `<div class="top-row-cell">${String.fromCharCode(65 + j)}</div>`; // uske andar chote chote 26 div bna diye
    } // uper likha fxn hume code se char me convert karke deta hai

    // logic for creating left counting cells 
    cellsContent += "</div>"; // ek bda div bnaya
    cellsContent += '<div class="left-col">';
    for (let j = 0; j < 100; j++) {
        cellsContent += `<div class="left-col-cell">${j + 1}</div>`; // usme chote chote 100 div bna diye
    }
    cellsContent += "</div>";

    // logic for creating 2600 cells 
    cellsContent += '<div class="all-cells">'; // 2600 cell iss bde se div me hogi
    for (let i = 0; i < 100; i++) { // isse 100 row create hogi
        cellsContent += '<div class="row">'; // ek row ka div banaya/ start kiya
        for (let j = 0; j < 26; j++) { // us row ke andar 26 chote chote div bnenge
            cellsContent += `<div class="cell" contenteditable="true" rowid="${i}" colid="${j}"></div>`; // chote chote div banane ka logic
        }
        cellsContent += "</div>"; // row ka div close kar diya diya
    }
    cellsContent += "</div"; // bda wala div band 
    cellsContainer.innerHTML = cellsContent;
}

// virtual database create karta hai 
function initDB() {
    let newDB = [];
    for (let i = 0; i < 100; i++) {
        let row = [];
        for (let j = 0; j < 26; j++) {
            // if i=1 & j=1 then cell name will be =>  B2
            let cellName = String.fromCharCode(65 + j) + (i + 1);
            let cellObject = {
                name: cellName,
                value: "",
                formula: "",
                childrens: [],
                parents: [],
                visited: false,
                fontStyles: { bold: false, italic: false, underline: false },
                textAlign: "left"
            };
            row.push(cellObject);
        }
        newDB.push(row);
    }
    let dbObject = { db: newDB, visitedCells: [] };
    sheetsDB.push(dbObject);
    db = newDB; // jb bhi sheet switch/creat hogi to usme humne initDB wala fxn chla rkha hoga to is line se sheet creation or switching ke time uska corresponding db set ho jaayega 
    visitedCells = dbObject.visitedCells; // jb bhi sheet switch/creat hogi to usme humne initDB wala fxn chla rkha hoga to is line se sheet creation or switching ke time uske corresponding visitedCells set ho jaayenge 
}

initCells();
initDB();