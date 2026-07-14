let cross = document.getElementById('cross');
let bars = document.getElementById('bars');
let mnav = document.querySelector('.mnav');
bars.addEventListener('click', () => {
    mnav.classList.add('active');
    bars.style.display = 'none';
    cross.style.display = 'block';
});
cross.addEventListener('click', () => {
    mnav.classList.remove('active');
    bars.style.display = 'block';
    cross.style.display = 'none';
}
);