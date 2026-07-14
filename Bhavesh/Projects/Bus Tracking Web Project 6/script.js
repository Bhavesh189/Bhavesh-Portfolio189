var map = L.map('map').setView([28.6139, 77.2090], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// For Bus Pass

const url = "https://api.telegram.org/bot8547081041:AAEv27A7upmk9E6awoqxZ-J2dgS9zOdRFnI/sendPhoto";

let namee = document.getElementById('name');
let studentId = document.getElementById('studentId');
let locationn = document.getElementById('busLoc');
let recipt = document.getElementById('recipt');
let feeRecipt = document.getElementById('feeRecipt');
let applyPass = document.getElementById('applyPass');

applyPass.addEventListener('click', makePass);
async function makePass() {
    const name = namee.value;
    const id = studentId.value;
    const loc = locationn.value;
    const reciptNum = recipt.value;
    const feeReciptFile = feeRecipt.files[0];
    applyPass.innerText = "Sending....";
    applyPass.disabled = true;
    try {
        let formData = new FormData();
        formData.append("chat_id", 7411383108);
        formData.append("photo", feeReciptFile);
        formData.append("caption", 
            `New Entry :
            Name : ${name}
            Student-ID : ${id}
            Location : ${loc}
            Recipt Number : ${reciptNum}`
        );
        const response = await fetch(url, {
            method : "POST",
            body : formData
        });
        const send = await response.json();
        if(send.ok) alert("Application Sent Succesfully");
        else alert("Try Again");
    }
    catch (err) {
        alert("Try Again Later");
    }
    applyPass.innerText = "Apply Now";
    applyPass.disabled = false;
    namee.value = "";
    studentId.value = "";
    locationn.value = "";
    recipt.value = "";
    feeRecipt.value = "";
}