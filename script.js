var candies = ["Blue", "Green", "Orange", "Purple", "Red", "Yellow"];
let draggedCandy = null;
let draggedCandyIndex;
let replacingCandy;
let replacingCandyIndex;
let draggedGhost = null;
const width = 5;
let score = 0;
var cells = document.querySelectorAll(".cell");
let scoreDisplay = document.querySelector("#scoreDisplay");
function randomCandy() {
  return candies[Math.floor(Math.random() * candies.length)];
}

function generateCandy() {
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
  console.log(cells);
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

function checkRowForThree() {
  for (let i = 0; i < width * width - 2; i++) {
    const rowOfThree = [i, i + 1, i + 2];
    const decidedImage = cells[i].querySelector("img").src;
    const isBlank = decidedImage === "";

    // Check if the row is within the same row
    const notInLastColumn = i % width < width - 2;

    if (
      notInLastColumn &&
      rowOfThree.every((index) => {
        const imgSrc = cells[index].querySelector("img").src;
        return imgSrc === decidedImage && !isBlank; // Return the comparison result
      })
    ) {
      score += 3;

      rowOfThree.forEach(
        (index) => (cells[index].querySelector("img").src = "")
      );
    }
  }
}

function checkRowForFour() {
  for (let i = 0; i < width * width - 3; i++) {
    // Adjusted the limit
    const rowOfFour = [i, i + 1, i + 2, i + 3];
    const decidedImage = cells[i].querySelector("img").src;
    const isBlank = decidedImage === "";

    // Check if the row is within the same row
    const notInLastColumn = i % width < width - 3;

    if (
      notInLastColumn &&
      rowOfFour.every((index) => {
        const imgSrc = cells[index].querySelector("img").src;
        return imgSrc === decidedImage && !isBlank; // Return the comparison result
      })
    ) {
      score += 4;

      rowOfFour.forEach(
        (index) => (cells[index].querySelector("img").src = "")
      );
    }
  }
}

function checkColumnForThree() {
  for (let i = 0; i < width * (width - 2); i++) {
    const columnOfThree = [i, i + width, i + width * 2];
    const decidedImage = cells[i].querySelector("img").src;
    const isBlank = decidedImage === "";

    if (
      !isBlank && // Check if the image is not blank
      columnOfThree.every(
        (index) => cells[index].querySelector("img").src === decidedImage
      )
    ) {
      score += 3;

      columnOfThree.forEach(
        (index) => (cells[index].querySelector("img").src = "")
      );
    }
  }
}

function checkColumnForFour() {
  for (let i = 0; i < width * (width - 3); i++) {
    const columnOfThree = [i, i + width, i + width * 2, i + width * 3];
    const decidedImage = cells[i].querySelector("img").src;
    const isBlank = decidedImage === "";

    if (
      !isBlank && // Check if the image is not blank
      columnOfThree.every(
        (index) => cells[index].querySelector("img").src === decidedImage
      )
    ) {
      score += 4;

      columnOfThree.forEach(
        (index) => (cells[index].querySelector("img").src = "")
      );
    }
  }
}

window.onload = generateCandy;
window.setInterval(() => {
  checkRowForFour();
  checkColumnForFour();
  checkRowForThree();
  checkColumnForThree();
}, 100);
