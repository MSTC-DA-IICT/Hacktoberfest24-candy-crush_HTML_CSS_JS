var candies = ["Blue", "Green", "Orange", "Purple", "Red", "Yellow"];
let draggedCandy = null;
let draggedCandyIndex;
let replacingCandy;
let replacingCandyIndex;
let draggedGhost = null;
const width = 5;

function randomCandy() {
  return candies[Math.floor(Math.random() * candies.length)];
}

function generateCandy() {
  var cells = document.querySelectorAll(".cell");

  cells.forEach(function (cell, index) {
    // console.log(index);

    var img = document.createElement("img");
    img.src = "./Images/" + randomCandy() + ".png";
    img.setAttribute("id", index);
    img.draggable = true;
    cell.appendChild(img);

    // Add event listeners for drag-and-drop
    img.addEventListener("dragstart", onDragStart);
    img.addEventListener("dragend", onDragEnd);
    cell.addEventListener("dragover", onDragOver);
    cell.addEventListener("dragenter", onDragEnter);
    cell.addEventListener("dragleave", onDragLeave);
    cell.addEventListener("drop", onDrop);
  });
}

function onDragStart(event) {
  draggedCandy = event.target;
  draggedCandyIndex = parseInt(draggedCandy.id);

  // // Create ghost image
  // draggedGhost = event.target.cloneNode(true);
  // draggedGhost.classList.add("dragged-ghost");
  // document.body.appendChild(draggedGhost);
  // event.dataTransfer.setDragImage(draggedGhost, 30, 30);

  // setTimeout(() => event.target.classList.add("dragging"), 0);
}

function onDragOver(event) {
  event.preventDefault(); // Necessary for drag-and-drop to work
}

function onDragEnter(event) {
  event.preventDefault(); // Necessary for drag-and-drop to work
}

function onDragLeave() {}

function onDrop(event) {
  //storing the current candy src and id
  let tempReplacingCandyStorage = event.target.src;

  replacingCandy = event.target;
  replacingCandyIndex = parseInt(replacingCandy.id);

  //swapping of the dragged and current candy tiles
  replacingCandy.src = draggedCandy.src;
  draggedCandy.src = tempReplacingCandyStorage;
}

function onDragEnd() {
  // valid adjacent moves (left, right, up, down)
  let validMoves = [
    draggedCandyIndex + 1,
    draggedCandyIndex + width,
    draggedCandyIndex - 1,
    draggedCandyIndex - width,
  ];

  let validMove = validMoves.includes(replacingCandyIndex);
  let temp = replacingCandy.src;

  // If the move is valid, clear the replacingCandyIndex and update the movesCount
  if (replacingCandyIndex && validMove) {
    replacingCandyIndex = null;
    updateMovesRemaining();
  } else if (replacingCandyIndex && !validMove) {
    replacingCandy.src = draggedCandy.src;
    draggedCandy.src = temp;
  } else {
    draggedCandy.src = draggedCandy.src;
  }
}

function updateMovesRemaining() {
  const movesElement = document.getElementById("movesRemaining");
  let moves = parseInt(movesElement.textContent);
  moves--;
  movesElement.textContent = moves;

  if (moves === 0) {
    alert("Game Over!");
    // Additional game-over logic here if needed
  }
}

window.onload = generateCandy;
