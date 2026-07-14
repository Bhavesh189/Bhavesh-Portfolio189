let user = document.getElementById('user')
let pass = document.getElementById('pass')
let loginBtn = document.getElementById('loginBtn')
let remember = document.getElementById('r')

loginBtn.addEventListener('click', () => {
    let username = user.value.trim().toLowerCase()
    let password = pass.value.trim().toLowerCase()
    if(remember.checked) {
        localStorage.setItem('username', username)
        localStorage.setItem('password', password)
    }
    if(username === "bhavesh" && password == "demonking") {
        window.location.href = "home.html"
    }
    else alert("Nikal be ")
})
window.onload = () => {
    let savedUser = localStorage.getItem('username')
    let savedPass = localStorage.getItem('password')
    if(savedUser && savedPass) {
        user.value = savedUser
        pass.value = savedPass
        remember.checked = true
    }
}
document.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        loginBtn.click()
    }
})