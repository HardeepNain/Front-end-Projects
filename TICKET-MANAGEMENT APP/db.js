let myDB = window.localStorage;  // ye hume local host laakar deta hai *1
let ticketsContainer = document.querySelector(".tickets-container");
let allFilterClasses = ["red" , "blue" , "green" , "yellow" , "black"];


function loadTickets() {  // ye fxn ek ek karke jo ticket db me stored hai unko ui pe lagata jaayega
  let allTickets = myDB.getItem("allTickets");
  if(allTickets) {
    allTickets = JSON.parse(allTickets);
    for (let i = 0; i < allTickets.length; i++) {
      let ticketInfoObject = allTickets[i];
      appendTicket(ticketInfoObject);
    }
  }
}
loadTickets();

function loadSelectedTickets(filter){
  let allTickets = myDB.getItem("allTickets");
  if(allTickets) {
    allTickets = JSON.parse(allTickets);
    for (let i = 0; i < allTickets.length; i++) {
      let ticketInfoObject = allTickets[i];
      if(ticketInfoObject.ticketFilter == filter){
        appendTicket(ticketInfoObject);
      }
    }
  }
}


function saveTicketToDB(ticketInfoObject) {   // ye fxn ticket append hone ke just baad use local storage me save karta hai
  let allTickets = myDB.getItem("allTickets");   // get item hume hamre storage me padi key laake deta hai jo hume key value(allTickets) pass ki ho
  if (allTickets) {
    // already all tickets are present
    allTickets = JSON.parse(allTickets);  // kyunki humne ticket ko stringify karke bheja tha to nyi ticket ka object usme push karne se pahle usko obj me convert karna pdega
    allTickets.push(ticketInfoObject);
    myDB.setItem("allTickets", JSON.stringify(allTickets)); // setItem hmari key me value set karta hai isme hum do chije pass karte hai pahli key name(allTicket) aur dusri key value(allTickets yani tickets ka object)
  } else {                                                  // set item strings me value accept karta hai 
    // no all Ticket key found
    let allTickets = [ticketInfoObject];  // jab 1st time koi ticket aati hai to hum ek allTicket naam se array bante hai aur us ticket ka obj usme store kar lete hai
    myDB.setItem("allTickets", JSON.stringify(allTickets));
  }
}

function appendTicket(ticketInfoObject) {   // iska kamm hai modal close hote hi tickeInfoObject ke hisab se ticket ko append karna
  let { ticketFilter, ticketValue , ticketId } = ticketInfoObject;  // alag alag nikalne ki bjaye ek saath teeno object nikal diye
  let ticketDiv = document.createElement("div");
  ticketDiv.classList.add("ticket");
  ticketDiv.innerHTML = `<div class="ticket-header ${ticketFilter}"></div>
    <div class="ticket-content">
        <div class="ticket-info">
            <div class="ticket-id">#${ticketId}</div>
            <div class="ticket-delete fas fa-trash"></div>
        </div>
        <div class="ticket-value">${ticketValue}</div>
    </div>`;

    let ticketHeader = ticketDiv.querySelector(".ticket-header");
    ticketHeader.addEventListener("click" , function(e){
      // logic which can switch ticket header color/filter
      let currentFilter = e.target.classList[1]; //black
      let indexOfCurrFilter = allFilterClasses.indexOf(currentFilter); //4
      let newIndex = (indexOfCurrFilter + 1)%allFilterClasses.length; //0
      let newFilter = allFilterClasses[newIndex]; //red

      ticketHeader.classList.remove(currentFilter); // remove black
      ticketHeader.classList.add(newFilter); // add red

      let allTickets = JSON.parse(myDB.getItem("allTickets"));
      for(let i=0 ; i<allTickets.length ; i++){
        if(allTickets[i].ticketId == ticketId){
          allTickets[i].ticketFilter = newFilter;
        }
      }
      myDB.setItem("allTickets" , JSON.stringify(allTickets));
    })

    let deleteTicketBtn = ticketDiv.querySelector(".ticket-delete");
    
    deleteTicketBtn.addEventListener("click" , function(e){
        ticketDiv.remove(); // ui se hata dega
        deleteTicketFromDb(ticketId);
    })

  ticketsContainer.append(ticketDiv);
}


function deleteTicketFromDb(ticketId){
    let allTickets = JSON.parse(myDB.getItem("allTickets"));
    // [ {} , {} , {} , {} , {}  ]
    let updatedTickets = allTickets.filter(  function(ticketObject){
        if(ticketObject.ticketId == ticketId){    
            return false;
        }
        return true;
    });
    myDB.setItem("allTickets" , JSON.stringify(updatedTickets));  // jab tickets filter ho jaayegi tab hum unko firse apne db me store kra dete hai
}




/*

*1 -> file ka storage kya hoga ye depend karta hai ki us file ka origin kya hai
matlab ki agr file ko local host yani go live se chalaya hai to uska local storage alag hoga 
aur yadi file ko file system se chlaya hai to uska local storage alag hoga 


*/