var candies = ["Blue", "Green", "Orange", "Purple", "Red", "Yellow"];
let draggedCandy = null;
let draggedGhost = null;

function randomCandy() {
  return candies[Math.floor(Math.random() * candies.length)];
}

function generateCandy() {
  var cells = document.querySelectorAll(".cell");

  cells.forEach(function (cell, index) {
    var img = document.createElement("img");
    img.src = "./Images/" + randomCandy() + ".png";
    img.setAttribute("data-index", index);
    img.draggable = true;
    cell.appendChild(img);

    // Add event listeners
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
  event.dataTransfer.setData(
    "text/plain",
    event.target.getAttribute("data-index")
  );

  // Create ghost image
  draggedGhost = event.target.cloneNode(true);
  draggedGhost.classList.add("dragged-ghost");
  document.body.appendChild(draggedGhost);
  event.dataTransfer.setDragImage(draggedGhost, 30, 30);

  setTimeout(() => event.target.classList.add("dragging"), 0);
}

function onDragEnd(event) {
  event.target.classList.remove("dragging");
  if (draggedGhost) {
    draggedGhost.remove();
    draggedGhost = null;
  }
}

function onDragOver(event) {
  event.preventDefault();
}

function onDragEnter(event) {
  if (event.target.classList.contains("cell")) {
    event.target.classList.add("drag-over");
  }
}

function onDragLeave(event) {
  if (event.target.classList.contains("cell")) {
    event.target.classList.remove("drag-over");
  }
}

function onDrop(event) {
  event.preventDefault();
  const cell = event.target.classList.contains("cell")
    ? event.target
    : event.target.parentElement;
  cell.classList.remove("drag-over");

  const fromIndex = parseInt(event.dataTransfer.getData("text"));
  const toIndex = parseInt(cell.firstChild.getAttribute("data-index"));

  if (areAdjacent(fromIndex, toIndex)) {
    swapCandies(draggedCandy, cell.firstChild);
    updateMovesRemaining();
  }
}

function areAdjacent(index1, index2) {
  const row1 = Math.floor(index1 / 5);
  const col1 = index1 % 5;
  const row2 = Math.floor(index2 / 5);
  const col2 = index2 % 5;

  return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
}

function swapCandies(candy1, candy2) {
  const tempSrc = candy1.src;
  const tempIndex = candy1.getAttribute("data-index");

  candy1.src = candy2.src;
  candy1.setAttribute("data-index", candy2.getAttribute("data-index"));

  candy2.src = tempSrc;
  candy2.setAttribute("data-index", tempIndex);
  //shihii
}

function updateMovesRemaining() {
  const movesElement = document.getElementById("movesRemaining");
  let moves = parseInt(movesElement.textContent);
  moves--;
  movesElement.textContent = moves;

  if (moves === 0) {
    alert("Game Over!");
    // You can add more game-over logic here
  }
}

window.onload = generateCandy;
