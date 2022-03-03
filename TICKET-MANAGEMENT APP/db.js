let myDB = window.localStorage;  // ye hume local host ka local storage laakar deta hai #1
let ticketsContainer = document.querySelector(".tickets-container");
let allFilterClasses = ["red" , "blue" , "green" , "yellow" , "black"];


function loadTickets() {  //[#3]
  let allTickets = myDB.getItem("allTickets");
  if(allTickets) {
    allTickets = JSON.parse(allTickets);
    for (let i = 0; i < allTickets.length; i++) {
      let ticketInfoObject = allTickets[i];
      appendTicket(ticketInfoObject);
    }
  }
}
loadTickets(); // [#4]

// ye fxn same loadTickets wale fxn ke jaisa hi hai bas hum isme appendTicket ko call lgane se pahle
// condition lga dete hai ki agr jo filter aaya hai agr wo us ticket ke infoObject me pde filter se match ho rha hai
// to hi appendTicket ko call lgao wrna mat lagao jisse sirf us filter wali ticket hi container pe append hongi
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


function saveTicketToDB(ticketInfoObject) {   //[#1]
  let allTickets = myDB.getItem("allTickets");   // get item hume hamre storage me padi wo key laake deta hai jo key value(allTickets) humnepass ki ho
  if (allTickets) {
    // already all tickets are present
    allTickets = JSON.parse(allTickets); 
    allTickets.push(ticketInfoObject);
    myDB.setItem("allTickets", JSON.stringify(allTickets)); // setItem hmari key me value set karta hai isme hum do chije pass karte hai pehla argument key name(allTicket) aur dusra argument value(allTickets which contains tickets ka info object)
  } else {                                                  // set item strings me value accept karta hai 
    // no allTicket key found 
    let allTickets = [ticketInfoObject];  
    myDB.setItem("allTickets", JSON.stringify(allTickets)); // local Storage me key string ki form me store hoti hai thats why we stringify the obj.
  }
}

function appendTicket(ticketInfoObject) {   // [#5]
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

  // this is logic to switch ticket header color/filter on ui and db both
    let ticketHeader = ticketDiv.querySelector(".ticket-header"); // ticketHeader pkd ke laaye
  ticketHeader.addEventListener("click", function (e) {  // uspe click event lgaya
      // logic to switch filter on ui
      let currentFilter = e.target.classList[1]; //konsa filter abhi hai wo nikala e.g.black
      let indexOfCurrFilter = allFilterClasses.indexOf(currentFilter); //black filter index nikal - 4
      let newIndex = (indexOfCurrFilter + 1)%allFilterClasses.length; //kyunki uspe click hua to filter change hoga to jo nya filter hoga uska index - 0
      let newFilter = allFilterClasses[newIndex]; //nya filter hoga - red

      ticketHeader.classList.remove(currentFilter); // remove black
      ticketHeader.classList.add(newFilter); // add red

      //logic to switch filter in db
      let allTickets = JSON.parse(myDB.getItem("allTickets")); // get array of ticketInfoObjects
      for(let i=0 ; i<allTickets.length ; i++){
        if(allTickets[i].ticketId == ticketId){ // jis object ki ticketId jispe click hua hai uski ticketId se match hui 
          allTickets[i].ticketFilter = newFilter; // usme object ke ticketFilter me newFilter daal denge
        }
      }
      myDB.setItem("allTickets" , JSON.stringify(allTickets));  // db me dobara se set kr denge
    })

    let deleteTicketBtn = ticketDiv.querySelector(".ticket-delete");
    
    deleteTicketBtn.addEventListener("click" , function(e){ // attach event to delete btn 
        ticketDiv.remove(); // ui se hata dega
        deleteTicketFromDb(ticketId); // delete from the database
    })

  ticketsContainer.append(ticketDiv);  // last me ticket append ho jaayegi.
}


function deleteTicketFromDb(ticketId){ // [#6]
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

#1 -> file ka local storage kya hoga ye depend karta hai ki us file ka origin kya hai
matlab ki agr file ko local host yani go live se chalaya hai to uska local storage alag hoga 
aur yadi file ko file system se chlaya hai to uska local storage alag hoga 

#2. saveTicketToDB
ye fxn ticket append hone ke just baad us ticket ko local storage me save karta hai
hum sbse pahle apne local storage me pdi 'allTickets' naam ki key ko get krte hai
agr ab tak koi ticket append nhi hui hogi means ye ticket 1st time aayi hogi to local storage me 'allTickets' naam ki key nhi milegi aur hum else me chle jaayenge
aur udhar jaake hum allTickets naam ka ek array bnate hai jisme ticketInfoObject hoga aur us array ko stringfy krke local Storage me 'allTickets' naam ki key me set kr dete hai
agr 'allTickets' wali key mil jaati hai means pahle se allTickets wala array bn chuka hoga to 'allTickets' key me pda stringified array humne allTickets var me save kr liya 
aur kyuki allTickets var null nhi aaya that means hum if me jaate hai
kyunki allTickets ek stringified array hai isiliye pahle usko parse kr lete hai
aur fir jo new ticket ka ticketInfoObject hai usko allTicket array me push kr dete hai
aur firse allTickets array ko stringify krke 'allTickets' naam ki key se local storage me set kr dete hai

#3. loadTickets
jaise hi files local host pe run hogi ye fxn ek ek karke jo tickets db me stored hai unko ui pe lagata jaayega
'allTickets' key me pda stringified array humne allTickets var me save kr liya
agr koi ticket nhi hogi to allTickets null hoga aur hum if me enternhi krengeaur koi bhi ticket append nhi hogi
agr koi tickets hogi to hum if me enter krenge jaha jaate hi hum sbse pahle allTickets ko parse kr lete hai
fir allTickets pe ek loop maarte hai jo ek ek krke allTickets me se ticketInfoObject nikalega 
aur append fxn ko call lga dega jo ui pe ticket append krta jaayega us ticketInfoObject ka use krke

#4. 
kyunki html me humne db ko pahle lga rkha hai aur script ko baad me 
aur db me humne loadTickets fxn ko aate hi call lga rhe hai to tab tak script.js load nhi hui hoti
to usko appendTicket fxn nhi milta(kyunki wo pahle script.js me likh rkha tha)
isiliye hum us fxn ko db.js me likh dete hai

iska alternative ye tha ki is loadTicket fxn ko script.js me last me call lgwaye 
taki tab tak appendTicket fxn(agr wo script.js me likh rkha ho to) load ho jaaye 

#5. appendTicket

iska kamm hai modal close hote hi tickeInfoObject ke hisab se ticket ko append karna
isko jo ticketInfoObjent milta hai usme se values nikal leta hai
aur fir un values ko appropriate jagah pe use krke ticket ke div ki html create krte hai
aur fir us div ko last me ticketContainer pe append kr dete hai


#6. deleteTicketFromDB
iss fxn ko ek ticketId milti hai  jo humne calling ke time pass ki hoti hai
aur kyunki humne ticket ke append hote time hi delete btn pe event attach kiya hua hai to ye ticketId wahi hoti hai jis ticket pe click hua ho

hum local storage me pdi 'allTickets' key me pde stringified array ko parse krke allTickets var me store krwa lete hai
aur allTickets pe filter fxn call krte hai jisse allTickets ke objects ek ek krke fxn me pass hote hai 
jisme check hota hai ki jo object aaya hai uski ticketId milti hai kya jo ticketId mili hai usse (means ki jis ticket ke delete btn pe click hua hai uski ticketId se)
agr to ticketId math ho jaati hai to hum false return kr dete hai wrna true return krte hai
aur filter fxn me jis bhi element ke liye false output aata hai usko array me se nikal dete hai 
aur ek baar jaise hi jis ticket ko delete krna tha uska obj allTickets me se remove ho jaata hai usko updatedTcickets me store krwa lete hai 
aur fir us updatedTickets ko stringify krke dobara se local storage me 'allTickets' ke naam ki key me save kr dete hai

*/