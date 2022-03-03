let allFilters = document.querySelectorAll(".filter");
let openModal = document.querySelector(".open-modal");
let closeModal = document.querySelector(".close-modal");
let ticketModalOpen = false;
let isTextTyped = false; //[#3]


for (let i = 0; i < allFilters.length; i++) {
  allFilters[i].addEventListener("click", selectFilter);
}

openModal.addEventListener("click", openTicketModal);
closeModal.addEventListener("click", closeTicketModal);

function selectFilter(e) { 
  if(e.target.classList.contains("active-filter")){ 
    // ticket append are on basis of some filter 
    e.target.classList.remove("active-filter");  
    // append all tickets  
    ticketsContainer.innerHTML = "";
    loadTickets();
  }
  else{
    if(document.querySelector(".active-filter")){
      document.querySelector(".active-filter").classList.remove("active-filter");
    }
    e.target.classList.add("active-filter");
    ticketsContainer.innerHTML = "";
    let filterClicked = e.target.classList[1];  // kis filter pe click hua hai wo milegi isse
    loadSelectedTickets(filterClicked);
  }
}

function openTicketModal(e) { // [#1]
  if (ticketModalOpen) {
    return;
  }
  let ticketModal = document.createElement("div");
  ticketModal.classList.add("ticket-modal");
  ticketModal.innerHTML = `<div class="ticket-text" contentEditable="true" spellcheck="false">Enter Your Text !</div>
    <div class="ticket-filters">
        <div class="ticket-filter red selected-filter"></div>
        <div class="ticket-filter blue"></div>
        <div class="ticket-filter green"></div>
        <div class="ticket-filter yellow"></div>
        <div class="ticket-filter black"></div>
    </div>`;
  document.querySelector("body").append(ticketModal);
  ticketModalOpen = true;

  isTextTyped = false;

  let ticketTextDiv = ticketModal.querySelector(".ticket-text");
  ticketTextDiv.addEventListener("keypress", handleKeyPress);

  let ticketFilters = ticketModal.querySelectorAll(".ticket-filter"); //[*1.1]
  for (let i = 0; i < ticketFilters.length; i++) {
    ticketFilters[i].addEventListener("click", function (e) {
      if (e.target.classList.contains("selected-filter")) {
        return;
      }
      document.querySelector(".selected-filter").classList.remove("selected-filter");
      e.target.classList.add("selected-filter");
    });
  }
}

function closeTicketModal(e) { // [#2]
  if (ticketModalOpen) {
    document.querySelector(".ticket-modal").remove();
    ticketModalOpen = false;
    isTextTyped = false;
  }
}

function handleKeyPress(e) { //[#4]
  if (e.key == "Enter" && isTextTyped && e.target.textContent) {
    let filterSelected = document.querySelector(".selected-filter").classList[1];
    let ticketId = uuid();
    let ticketInfoObject = {
      ticketFilter: filterSelected,
      ticketValue: e.target.textContent,
      ticketId : ticketId
    };
    appendTicket(ticketInfoObject);
    closeModal.click();
    saveTicketToDB(ticketInfoObject);
  }

  if(!isTextTyped) {
    isTextTyped = true;
    e.target.textContent = "";
  }
}

/*
#1. openTicketModal function

agr ticket modal pahle se open hua to wahi se return kr jaayenge taki multiple ticket modals open na ho
agr tickeet modal open nhi hua to ek div create hoga usme class add hogi aur uska html set hoga 
aur usko hum document se body laake body pe append kr denge
aur ticketModalOpen jo false tha use true set kr dete hai

*1.1 
what this code do :
ye jo 7-8 lines ka code hai ye basically kaam ye krta hai ki
jo ticket-modal me filters usme agr hum koi dursa filter select kre to wo select hoje aur jo selected hai wo unselect hoje
How code works : 
Hum saare ticket filter le aaye
unpe loop lgake click event lga diya 
jisse jaise hi us filter pe click hota hai to iska fxn chalega 
function me kya hota hai 
function me check hota hai ki jispe click kiya hai wo already selected hai kya
agr selected hai to wahi se return kr jaao 
agr selected nhi hua to return nhi krenge aur aage ka code chalega
jisme jo selected hai uspe se selected-filter wali class hta dete hai 
aur jispe click kiya hai uspe selected-filter wali class lga dete hai 
*/
/*
#2. closeTicketModal 

agr ticketModalOpen true hai to use hum body se remove kr dete hai 
aur ticketModalOpen ko false kr dete hai taki jab + pe click ho to us time hum return na kre 
aur ticke modal attach ho.
hum if condition isiliye lgayi hai kyunki agr ticketModalOpen false hoga to iska matlab body pe koi ticke modal ka div nhi hai 
to null.remove() call hoga jab hum cross pe click krenge aur error aa jaayega
*/
/*
#3. 
Hum chahte hai ki jaise hi koi key press ho to ticket-text div ke andar likha text `Enter Your Text !` ht jaaye
to iske liye hum ek flag le lete hai jo initally false hota hai
jo ticketTextDiv hai uspe humne `keypress` event lga rkha hai 
to jaise hi koi key press hogi to handelKeyPress wala fxn chal jaayega
ab is fxn me aate hi 1st wale if ki condition true nhi hogi(kyu nhi hogi: see handleKeyPress fxn explaination)
iske baad hum 2nd if pe aate hai jiski condition true ho jaayeg because isTextTyped flag hmara false hai
to isTextTyped ko hum true bna dete hai ki kuch type hua hai
aur jo text-div me pahle se text likha tha uska hta dete hai
humne closeTicketModal me aur OpenTicketModal me isTextTyped ko false bnaya hua hai
matlab ki jaise hi current wala ticket ke modal ko close kiya jaaye ya fir nya ticket ka modal open ho to isTextTyped false hona chahiye
taki uske liye bhi handleKeyPress fxn me 2nd if wali condition true ho ske ho uska text bhi key press krne pe khaali ho
*/
/*
#4. handleKeyPress function
reder video with name HandleKeyPress function for explaination
*/
/*
#5. selectFilter()
jo uper wala box hai filter ka uske hisab se ticketContainer me tickets show krta hai ye fxn
sbse pahle hum check krte hai ki jispe click kiya hai kahi uspe pahle se 'active-filter' wali class h to nhi

if yes then uski classlist me se 'active-filter' wali class remove krdo 
aur ticket ka container khaali krke loadTickets wale fxn ko call lga do 
jisse ticket container pe saari tickets load ho jaaye jo jo db me hai 

if no then else executes
else me sbse pahle hum us element ko pkd ke leke aate hai jispe 'active-filter' wali class lgi ho 
agr to kisi element pe class lgi hogi to hum us if me enter krenge 
aur us element ki classlist me se 'active-filter' wali class ko remove krenge
aur jis filter pe click kiya hai uski class list me 'active-filter' wali class ko add kr denge
aur fir ticketContainer ko khaali krke loadSelectedTickets wale fxn ko call lga denge jo sirf wahi tickets show krega jis filter pe click hua hai
loadSelectedFilter me jis filter pe click hua hai wo filter bhi pass hota hai
*/
