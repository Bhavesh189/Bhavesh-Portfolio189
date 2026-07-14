const bulb = document.querySelector("#bulb");
const body = document.querySelector("body");
let chalu = false;
bulb.addEventListener("click", darkt);

const btn = document.querySelector("#btn");
const a = document.querySelector("#a");
const b = document.querySelector("#b");
const x = document.querySelector("#a i");

a.addEventListener("click", showAdd);

function darkt() {
  if (chalu) {
    body.style.backgroundColor = "#07070a";
    body.style.backgroundImage = "radial-gradient(at 10% 20%, rgba(223, 169, 92, 0.05) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(197, 168, 128, 0.03) 0px, transparent 50%)";
    chalu = false;
  } else {
    body.style.backgroundColor = "#0b0813";
    body.style.backgroundImage = "radial-gradient(at 10% 20%, rgba(167, 139, 250, 0.06) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(236, 72, 153, 0.04) 0px, transparent 50%)";
    chalu = true;
  }
}

let c = false;
function showAdd() {
  if (c) {
    b.style.display = "none";
    x.classList.remove("rotate");
    c = false;
  } else {
    b.style.display = "flex";
    x.classList.add("rotate");
    c = true;
  }
}
let count = 0;
let namme = document.querySelector("#name");
let time = document.querySelector("#time");
let date = document.querySelector("#date");
let btnn = document.querySelector("#btn");
const noti = document.querySelector(".notification");
btn.addEventListener("click", create);

namme.addEventListener("keypress", (event) => {
  if (event.key === "Enter") create();
});
function create() {
  let task = namme.value;

  if (task === "") {
    alert("Firstly Add Details");
    return;
  }

  let newDiv = document.createElement("div");

  newDiv.classList.add("task");

  noti.style.display = "none";

  newDiv.innerHTML = `
  <div class="taskk">
  <h4>${task}</h4>
  <div class="done">
  <i class="fa-solid fa-check" title="done" id="cross"></i>
  <i class="fa-solid fa-xmark" title="Not" id="cross"></i>
  </div>
  </div>
  `;

  count++;

  let cross = newDiv.querySelector(".fa-xmark");
  let check = newDiv.querySelector(".fa-check");

  if (cross) cross.addEventListener("click", removee);
  if (check) {
    check.addEventListener("click", () => {
      newDiv.querySelector("h4").classList.toggle("completed");
    });
  }

  function removee() {
    newDiv.remove();
    count--;
    if (!count) noti.style.display = "flex";
  }

  body.insertBefore(newDiv, a);
  namme.value = "";
  saveData();
  showAdd();
}
const likh = document.querySelector(".likh");

let isWrite = true;

let letter = 0;

const para = "Your Task's is Shown Here";

function write() {
  let speed = 100;

  if (isWrite && letter < para.length) {
    letter++;
    likh.innerHTML = para.substr(0, letter);
    speed = 60;
  } else if (isWrite && letter === para.length) {
    isWrite = false;
    speed = 3000000;
  } else if (!isWrite && letter > 0) {
    letter--;
    likh.innerHTML = para.substr(0, letter);
    speed = 10;
  } else {
    isWrite = true;
    likh.innerHTML = "";
    speed = 200;
  }

  setTimeout(write, speed);
}

write();

function saveData() {
  let tasks = [];

  let allTaksName = document.querySelectorAll(".taskk h4");

  allTaksName.forEach((element) => {
    tasks.push(element.innerText);
  });
  // console.log(tasks);
  localStorage.setItem("k", JSON.stringify(tasks));
}
function showData() {
  let saved = localStorage.getItem("k");
  if (saved) {
    let tasks = JSON.parse(saved);
    tasks.forEach((element) => {
      let newDiv = document.createElement("div");
      newDiv.classList.add("task");

      newDiv.innerHTML = `
                <div class="taskk">
                <h4>${element}</h4>
                <div class="done">
                <i class="fa-solid fa-check" title="done" id="cross"></i>
                <i class="fa-solid fa-xmark" title="Not" id="cross"></i>
                </div>
                </div>
                `;
      let cross = newDiv.querySelector(".fa-xmark");
      let check = newDiv.querySelector(".fa-check");
      if (cross) cross.addEventListener("click", removee);
      if (check) {
        check.addEventListener("click", () => {
          newDiv.querySelector("h4").classList.toggle("completed");
        });
      }
      function removee() {
        newDiv.remove();
        saveData();
        count--;
        if (!count) noti.style.display = "flex";
      }
      body.insertBefore(newDiv, a);
      count++;
    });
    if (count > 0) noti.style.display = "none";
  }
}

showData();

let moti = document.querySelector(".moti");

async function motivation() {
  moti.innerHTML = "Loading TOday Motivaitoin";
  try {
    const response = await fetch("https://dummyjson.com/quotes/random");
    const reply = await response.json();
    console.log(reply);
    let text = `${reply.quote}`;

    let aut = " <br><br> <font size='2rem'>Author - Mr. Bhavesh Sharma</font>";

    moti.innerHTML = "";

    typee(text, 0, aut);
  } catch (e) {
    console.log(e);
    moti.innerHTML =
      "Light up the fire of love inside and blaze the thoughts away.";
  }
} 

motivation();

setInterval(motivation, 10000);

let writing = true;
function typee(text, letter, aut) {
  if (letter < text.length) {
    speed = 40;
    moti.innerHTML = text.substr(0, letter + 1);
    timeee = setTimeout(() => {
      typee(text, letter + 1, aut);
    }, speed);
  } else {
    moti.innerHTML = text + aut;
  }
  setTimeout(typee, 100);
}
