// Define 
let navbar = document.querySelector('.mnav');
let b = document.getElementById('bars');
let closeButton = document.getElementById("cross");
// Functions 
function nav() {
    navbar.classList.toggle("active");

    if(navbar.classList.contains("active"))closeButton.style.display = "block";
    else closeButton.style.display = "none";
}

// Verify
b.addEventListener('click', nav); 
closeButton.addEventListener('click',nav);