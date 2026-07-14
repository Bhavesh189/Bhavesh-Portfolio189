let pass = document.querySelector('.pass')
let chk = document.querySelector('.chk')
let admin = document.querySelector('input[value="admin"]')
let namee = document.querySelector('input[type="text"]')
let file = document.querySelector('input[type="file"]')
const api = "8443969842:AAEA-3TaSX2VjPDi8GAejIJ27WFQ_4h4aMc"
let id = "7411383108";
let url = `https://api.telegram.org/bot${api}/sendDocument`
let subject = document.querySelector('#subject')
function password(element) {
    if (element.value === 'admin') {
        pass.classList.add('active')
        pass.setAttribute('required', '')
    }
    else {
        pass.classList.remove('active')
        pass.removeAttribute('required')
        pass.value = "";
    }
}


document.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        done();
    }
})
async function done() {
    if (admin.checked) {
        if (pass.value !== 'BhaveshSDE') {
            alert("Galat h Password be Sahi Daal")
            return;
        }
    }
    if (namee.value === "" || file.value === "") {
        alert("Naam Notes Kon Dalega !!!")
        return;
    }


    let btn = document.querySelector('.submit')
    btn.value = "Sending To Bhavesh..."
    btn.disabled = true
    let data = new FormData
    data.append("chat_id", id)
    let message = `Request By ${namee.value}\nSubject : ${subject.value}`
    data.append("caption", message)
    data.append("document", file.files[0])

    try {
        let response = await fetch(url, {
            method: 'POST',
            body: data
        })
        if (response.ok) {
            chk.classList.add('active')
            setTimeout(() => {
                namee.value = "";
                file.value = "";
                pass.value = "";    
                chk.classList.remove('active')
                btn.value = "Submit"
                btn.disabled = false
            }, 1000)
        }
        else {
            alert("Server Busy hai badme krio")
            btn.value="Submit"
            btn.disabled = false
        }
    }
    catch(error) {
        btn.value = "Submit"
        btn.disabled = false
        alert("Recharge kra le")
    }
}
