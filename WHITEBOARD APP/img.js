let photoDiv = document.querySelector("#photo");
let photoUploadInput = document.querySelector("#photo-upload");
let downloadDiv = document.querySelector("#download");

photoDiv.addEventListener("click", function () {
  photoUploadInput.click();   // jab bhi photo ke div pe click hoga to iski wajah se input wala fxn trigger hoga
});

photoUploadInput.addEventListener("change", function (event) {   // jis element pe ye event lga hoga to jab bhi usme change aayega to iska fxn chalega
  console.log(event);
  let fileObj = event.target.files[0];
  console.log(fileObj);
  let filePath = URL.createObjectURL(fileObj, { type: "image/jpg" });
  let img = document.createElement("img");
  img.setAttribute("src", filePath);
  img.classList.add("sticky-image");
  addSticky(img);
});


downloadDiv.addEventListener("click" , function(){
    let imagePath = canvas.toDataURL("image/jpg");
    console.log(imagePath);
    // <a href="" download="canvas.jpg"></a> 
    let aTag = document.createElement("a");
    aTag.download = "canvas.jpg";  // isse download pe click karte hi wo canvas "canvas.jpg" ke naam se download hoga 
    aTag.href = imagePath;
    aTag.click();
})