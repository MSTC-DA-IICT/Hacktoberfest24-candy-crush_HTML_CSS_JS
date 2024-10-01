document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const candyColors = [
        'url(assets/red.png)', 
        'url(assets/blue.png)', 
        'url(assets/green.png)', 
        'url(assets/yellow.png)', 
    ];

    function createBoard() {
        const availableCandies = 4;
        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.setAttribute('class', 'cell');
            const randomColor = candyColors[Math.floor(Math.random() * availableCandies)];
            cell.style.backgroundImage = randomColor;
            grid.appendChild(cell);
        }
    }

    createBoard();
});
