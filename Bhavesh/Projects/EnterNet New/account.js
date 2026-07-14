let grid = document.querySelector('.grid');

for(let i = 1; i < 1000; i++) {
    let div = document.createElement('div');
    div.classList.add('grids');
    grid.appendChild(div);
}