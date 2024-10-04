var candies = ["Blue", "Green", "Orange", "Purple", "Red", "Yellow"];

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

function generateCandy() {
    var cells = document.querySelectorAll('.cell');
    
    cells.forEach(function(cell) {
        var img = document.createElement('img');
        img.src = "./Images/" + randomCandy() + ".png";
        cell.appendChild(img);
    });
}
window.onload = generateCandy;
