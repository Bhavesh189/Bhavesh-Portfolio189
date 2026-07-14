let form = document.querySelector('#c');
let btn = document.getElementById("submitBtn");

let token = "TOKEN";

let id = "ID_C";

form.addEventListener('submit', sends);
async function sends(e) {
    e.preventDefault();
    let namep = document.getElementById("name")
    let email = document.getElementById("email")
    let message = document.getElementById("message")

    btn.innerText = "Sending......"
    btn.disabled = true;
    let text = `New Message \n Name : ${namep.value} \n Email : ${email.value} \n Message : ${message.value}\n`;
    let url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${id}&text=${encodeURIComponent(text)}`;
    try {
        let resp = await fetch(url);
        if (resp.ok) {
            alert("Send Successfully Wait for Bhavesh response");
            namep.value = "";
            email.value = "";
            message.value = "";
        }
        else alert("Please try again");
        btn.innerText = "Submit";
        btn.disabled = false;
    }
    catch (e) {
        alert("Please send agiain");
        btn.innerText = "Submit";
        btn.disabled = false;
    }
}