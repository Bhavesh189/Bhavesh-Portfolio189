let text = document.querySelector('.first')

let p = 0;
let q = 0;
let isDel = false;
const bolna = [
    "My Name is Bhavesh Sharma",
    "My Aim To Be a Software Engineer",
    "Doing Daily 1 Leetcode Question",
    "Curruntly I am Building Websites",
    "I am also a Problem Solver"
];
let s = 0;

const chal = () => {
    if(p == bolna.length) p = 0;
    let curruntW = bolna[p];
    let curruntL = curruntW.substring(0,q);

    let change = curruntL;
    text.innerHTML = change;

    if(!isDel && q < curruntW.length) {
        q++;
        s = 100;
    }
    else if(isDel && q > 0) {
        q--;
        s = 100;
    }
    else {
        if(isDel && q == 0) {
            isDel = false;
            p++;
            s  = 100;
        }
        else if(!isDel && q == curruntW.length) {
            isDel = true;
            s = 200;
        }
        else {
            p = 0;
            s = 200;
        }
    }

    setTimeout(chal,s);
}

chal();