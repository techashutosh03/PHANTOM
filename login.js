function login(){

const username =
document.getElementById("username").value;

const password =
document.getElementById("password").value;

if(
username === "admin" &&
password === "phantom"
){

localStorage.setItem(
"phantomAuth",
"true"
);

document.getElementById(
"status"
).innerText =
"ACCESS GRANTED";

setTimeout(()=>{

window.location.href =
"boot.html";

},1500);

}
else{

document.getElementById(
"status"
).innerText =
"ACCESS DENIED";

}

}