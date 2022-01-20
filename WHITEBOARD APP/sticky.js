let sticky = document.querySelector("#sticky");

sticky.addEventListener("click", function(e){  // isko humne aise "sticky.addEventListener("click", addSticky()" aise call nhi lagayi kyunki isse fir addSticky() ke apna khud ka ek event pass hota aur hum imageElement pass nhi kar paate 
  addSticky();
});

function addSticky(imageElement) {
  let stickyDiv = document.createElement("div");
  stickyDiv.classList.add("sticky");
  stickyDiv.innerHTML = `<div class="sticky-header">
    <div class="minimize"></div>
    <div class="close"></div>
  </div>`;
  let minimize = stickyDiv.querySelector(".minimize");
  let close = stickyDiv.querySelector(".close");
  let stickyHeader = stickyDiv.querySelector(".sticky-header");
  let stickyContent;   // ye alag s global bnaya kyunki ispe humne if else ke blocks ke bahar bhi kaam kar rkha hai
  if(imageElement){
    let stickyImageDiv = document.createElement("div");
    stickyImageDiv.classList.add("sticky-image-div");
    stickyDiv.append(stickyImageDiv);
    stickyImageDiv.append(imageElement);
    stickyContent = stickyImageDiv;
  }else{
     // <div class="sticky-content" contenteditable="true"></div>
     let stickyContentDiv = document.createElement("div");
     stickyContentDiv.classList.add("sticky-content");
     stickyContentDiv.setAttribute("contenteditable" , "true");
     stickyDiv.append(stickyContentDiv);
     stickyContent = stickyContentDiv;
  }

  minimize.addEventListener("click", function () {
    stickyContent.style.display == "none"
      ? (stickyContent.style.display = "block")
      : (stickyContent.style.display = "none");
  });

  close.addEventListener("click", function () {
    stickyDiv.remove();
  });

  let stickyHold = false;
  let initialX;
  let initialY;
  stickyHeader.addEventListener("mousedown", function (e) {
      stickyHold=true;
      initialX = e.clientX;
      initialY = e.clientY;
  });

  stickyHeader.addEventListener("mousemove", function (e) {
      if(stickyHold){
          let finalX = e.clientX;
          let finalY = e.clientY;
    
          let dx = finalX - initialX;
          let dy = finalY - initialY;
    
          let {top , left} = stickyDiv.getBoundingClientRect();  // ye hume element ki diff values laake deta hai jaise top left x y etc.
          // console.log(stickyDiv.getBoundingClientRect()); 
          //   sticky => top + dy
          //  sticky => left + dx
          stickyDiv.style.top = top + dy + "px";  // elem.style se hum set kar skte hai get nhi
          stickyDiv.style.left = left +dx + "px";
    
          initialX = finalX;
          initialY = finalY;
      }
  });

  stickyHeader.addEventListener("mouseup", function (e) {
      stickyHold = false;
  });

  document.body.append(stickyDiv);
}
