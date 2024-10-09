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
    checkAndRemoveMatches();
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

  const direction = getSwapDirection(candy1, candy2);

  candy1.classList.add(`swap-${direction.candy1}`);
  candy2.classList.add(`swap-${direction.candy2}`);

  setTimeout(() => {
    candy1.src = candy2.src;
    candy1.setAttribute("data-index", candy2.getAttribute("data-index"));

    candy2.src = tempSrc;
    candy2.setAttribute("data-index", tempIndex);

    candy1.classList.remove(`swap-${direction.candy1}`);
    candy2.classList.remove(`swap-${direction.candy2}`);
  }, 150);
}

function getSwapDirection(candy1, candy2) {
  const index1 = parseInt(candy1.getAttribute("data-index"));
  const index2 = parseInt(candy2.getAttribute("data-index"));

  if (index2 === index1 + 1) return { candy1: "right", candy2: "left" };
  if (index2 === index1 - 1) return { candy1: "left", candy2: "right" };
  if (index2 === index1 + 5) return { candy1: "down", candy2: "up" };
  if (index2 === index1 - 5) return { candy1: "up", candy2: "down" };
}

function checkAndRemoveMatches() {
  const cells = document.querySelectorAll(".cell");
  let matchFound = false;

  // Check horizontal matches
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 3; col++) {
      const index = row * 5 + col;
      const candy1 = cells[index].firstChild;
      const candy2 = cells[index + 1].firstChild;
      const candy3 = cells[index + 2].firstChild;

      if (candy1.src === candy2.src && candy2.src === candy3.src) {
        candy1.classList.add("match");
        candy2.classList.add("match");
        candy3.classList.add("match");
        matchFound = true;
      }
    }
  }

  // Check vertical matches
  for (let col = 0; col < 5; col++) {
    for (let row = 0; row < 3; row++) {
      const index = row * 5 + col;
      const candy1 = cells[index].firstChild;
      const candy2 = cells[index + 5].firstChild;
      const candy3 = cells[index + 10].firstChild;

      if (candy1.src === candy2.src && candy2.src === candy3.src) {
        candy1.classList.add("match");
        candy2.classList.add("match");
        candy3.classList.add("match");
        matchFound = true;
      }
    }
  }

  if (matchFound) {
    removeMatches();
    fillEmptySpaces();
    // Check for chain reactions
    setTimeout(checkAndRemoveMatches, 500);
  }
}

function removeMatches() {
  const matchedCandies = document.querySelectorAll(".match");
  matchedCandies.forEach((candy) => {
    candy.classList.remove("match");
    candy.remove();
  });
}

function fillEmptySpaces() {
  const cells = document.querySelectorAll(".cell");

  // Move existing candies down
  for (let col = 0; col < 5; col++) {
    let emptyRow = 4;
    for (let row = 4; row >= 0; row--) {
      const index = row * 5 + col;
      if (cells[index].firstChild) {
        if (emptyRow !== row) {
          cells[emptyRow * 5 + col].appendChild(cells[index].firstChild);
        }
        emptyRow--;
      }
    }

      for (let row = emptyRow; row >= 0; row--) {
        const index = row * 5 + col;
        const newCandy = document.createElement("img");
        newCandy.src = "./Images/" + randomCandy() + ".png";
        newCandy.setAttribute("data-index", index);
        newCandy.draggable = true;
        newCandy.classList.add("new-candy");
        newCandy.addEventListener("dragstart", onDragStart);
        newCandy.addEventListener("dragend", onDragEnd);
        cells[index].appendChild(newCandy);

        // Remove the 'new-candy' class after the animation
        setTimeout(() => newCandy.classList.remove("new-candy"), 500);
      }
  }
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
