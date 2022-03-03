let addTodoButton = document.querySelector(".add-todo"); //[#1] ye ek aisa element search krega jispe add-todo class lgi hogi 
let todoInput = document.querySelector(".todo-input");
let todosList = document.querySelector(".todos-list-container");

// humne todoInput pe keypress event lga diya hai means ki jab bhi koi key press hogi to ye event occur hoga 
// aur agr pressed key is equal to Enter to addTodo ko call lg jaayegi
todoInput.addEventListener("keypress", function(e) { //[#2]
    if (e.key == "Enter") {
        addTodo();
    }
});
// attach click event on addTodoButton
addTodoButton.addEventListener("click", function() {
    addTodo();
});


function addTodo() {
    //console.log(event); //[#4]
    let todoInputValue = todoInput.value; //[#3]
    if (todoInputValue) { // agr input box empty hoga to appendTodo nhi chlega
        appendTodo(todoInputValue);
        // it will empty the todoInput
        todoInput.value = ""; // taki ek baar append ho jaane par input box empty ho jaaye
    }
}

function appendTodo(todo) {

    let todoItemDiv = document.createElement("div");
    todoItemDiv.classList.add("todo-item");
    // <div class="todo-item"> </div>

    let pTag = document.createElement("p");
    pTag.classList.add("todo");
    pTag.textContent = todo;
    // <p class="todo-input">Learn Css</p>

    let deleteTodoButton = document.createElement("button");
    deleteTodoButton.classList.add("delete-todo");
    deleteTodoButton.textContent = "Delete";
    // <button class="delete-todo">Delete</button>
  
  // ye event humne idhar hi attach krna pdega hum bahar is button pe event nhi lga skte
  // kyunki tb tak dom pe ye button bna hi nhi hoga 
  // to jaise hi deleteTodButton bnega uspe event attach ho jaayega 
    deleteTodoButton.addEventListener("click", deleteTodo); 

    todoItemDiv.append(pTag); // x.append(y) -> ye y element ko x element ka child node bna deta hai
    todoItemDiv.append(deleteTodoButton);

    todosList.append(todoItemDiv); // jo div create kiya hai wo todoList me append kr dete hai
}

function deleteTodo(e) {
    e.target.parentNode.remove(); //[*4.1]
    // console.log(e);
}

/*
#1.
document.querySelector     --> isko jaise hi pahli baar elem/class etc. milegi ye wahi se return kar jaayega 
document.querySelectorAll  --> ye pure tree me traverse karke har ek node pe jaake check krega jo elem/class etc. kuch bhi chahiye hoga aur saare elem etc. laake de dega

#2.
addEventListener --> ye ek type ka special fxn hota hai jo element pe diff types ke event attach karne ke kaam aata hai
                     ye ek event name aur callback fxn maangta hai 
                     jaise hi event occur hoga ye fxn ko call lga dega
                     Note:- jab bhi fxn ko call lagayi jaati hai to ek event object bhi bheja jaata hai saath me jo us element ka event obj hoga jispe event lga hai

#3.
DOM me har ek element ka ek obj hota hai jisme kuch keys pdi hoti hai
element.key = ye element ke obj me jo key me value padi hogi laake de deta hai 
e.g. Jo input box hota hai usme jo bhi hum type krte hai wo sb uske value naam ki key me jaata hai
     to agr hume use access krna hai to hum kuch aise likh skte hai
     todoInput.value -> yha pe todoInput(input box) element ke value key me jo pda hoga wo aa jaayega

#4.
Jab bhi hum kisi bhi element pe koi event lgate hai to us element ke liye ek event obj bnta hai
hum us event object ko console krke dekh skte hai aur apne code me use kr skte hai 
*4.1
for e.g. line 50 :
                  kyunki humne deleteTodoButton pe ek event lgaya hai to iss element ka ek event obj bnega
                  to agr hum e.target ko console krenge to ye button console pe dhikega ki humne deleteTodoButton ko click kiya hai
                  to line no. 50 ka matlab hai ki jaha pe hum click kr rhe hai(deleteTodoButton) uski parentNode(div with class todo-item) ko remove krdo

*/