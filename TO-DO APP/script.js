let addTodoButton = document.querySelector(".add-todo"); 
let todoInput = document.querySelector(".todo-input");
let todosList = document.querySelector(".todos-list-container");

todoInput.addEventListener("keypress", function (e) {
  if (e.key == "Enter") {
    addTodo();
  }
});
addTodoButton.addEventListener("click", function () {
  addTodo();
});

// attach click event on addTodoButton
function addTodo() {
  //console.log(event);
  let todoInputValue = todoInput.value;
  if (todoInputValue) {
    appendTodo(todoInputValue);
    // it will empty the todoInput
    todoInput.value = ""; // taki ek baar add kar lene par input box empty ho jaaye
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

  deleteTodoButton.addEventListener("click", deleteTodo);

  todoItemDiv.append(pTag);
  todoItemDiv.append(deleteTodoButton);

  todosList.append(todoItemDiv);
}

function deleteTodo(e) {
  e.target.parentNode.remove();
}

/*
document.querySelector     --> isko jaise hi pahli baar elem/classetc. milegi ye wahi se return kar jaayega 
document.querySelectorAll  --> ye pure tree me traverse karke har ek node pe jaake check krega jo elem/class etc. kuch bhi chahiye hoga aur saare elem etc. laake de dega

addEventListener --> ye ek type ka special fxn hota hai jo element pe diff types ke event attach karne ke kaam aata hai
                       ye ek event aur fxn maangta hai 
                       jaise hi event occur hoga ye fxn ko call lga dega
                       Note:- jab bhi fxn ko call lagayi jaati hai to ek event bhi bheja jaata hai saath me

element.key = ye element ke event me jo key me value padi hogi laake de deta hai 


*/