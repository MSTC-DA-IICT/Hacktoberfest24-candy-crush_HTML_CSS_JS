var candies = ["Blue", "Green", "Orange", "Purple", "Red", "Yellow"];
let draggedCandy = null;
let draggedCandyIndex;
let replacingCandy;
let replacingCandyIndex;
const width = 5;
let score = 0;
var cells = document.querySelectorAll(".cell");
let scoreDisplay = document.querySelector("#scoreDisplay");

function randomCandy() {
  return candies[Math.floor(Math.random() * candies.length)];
}

function generateCandy() {
  cells.forEach(function (cell, index) {
    cell.setAttribute("id", index);

    var img = document.createElement("img");
    img.src = "./Images/" + randomCandy() + ".png";
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
  draggedCandy = event.target; // The img element being dragged
  draggedCandyIndex = parseInt(draggedCandy.parentElement.id); // Get the id of the parent div
}

function onDragOver(event) {
  event.preventDefault(); // Necessary for drag-and-drop to work
}

function onDragEnter(event) {
  event.preventDefault(); // Necessary for drag-and-drop to work
}

function onDragLeave() {}

function onDrop(event) {
  // Store the current candy src for swap
  let tempReplacingCandyStorage = event.target.src;

  replacingCandy = event.target;
  replacingCandyIndex = parseInt(replacingCandy.parentElement.id); // Use the cell's ID

  // Swap the dragged and target candy images
  replacingCandy.src = draggedCandy.src;
  draggedCandy.src = tempReplacingCandyStorage;
}

function onDragEnd() {
  // Define valid adjacent moves (left, right, up, down)
  let validMoves = [
    draggedCandyIndex + 1,
    draggedCandyIndex + width,
    draggedCandyIndex - 1,
    draggedCandyIndex - width,
  ];

  let validMove = validMoves.includes(replacingCandyIndex);

  if (!validMove) {
    // Invalid move: Revert the image swap
    const temp = replacingCandy.src;
    replacingCandy.src = draggedCandy.src;
    draggedCandy.src = temp;
  }
  // Clear drag references
  draggedCandy = null;
  replacingCandy = null;
}

//Score updation Logic
function updateMovesRemaining() {
  const movesElement = document.getElementById("movesRemaining");
  let moves = parseInt(movesElement.textContent);
  moves--;
  movesElement.textContent = moves;

  if (moves === 0) {
    alert("Game Over!");
  }
}

//Candy Matching and Removal logic
function checkRowForThree() {
  for (let i = 0; i < width * width - 2; i++) {
    const rowOfThree = [i, i + 1, i + 2];
    const decidedImage = cells[i].querySelector("img")
      ? cells[i].querySelector("img").src
      : null;
    const isBlank = decidedImage === "./Images/blank.png";

    // Check if the row is within the same row
    const notInLastColumn = i % width < width - 2;

    if (
      notInLastColumn &&
      rowOfThree.every((index) => {
        const imgElement = cells[index].querySelector("img");
        const imgSrc = imgElement ? imgElement.src : null;
        return imgSrc === decidedImage && !isBlank; // Return the comparison result
      })
    ) {
      score += 3;


      // Remove the <img> tag from each matched cell
      rowOfThree.forEach((index) => {
        const imgElement = cells[index].querySelector("img");
        if (imgElement) {
          cells[index].removeChild(imgElement); // Remove the img element entirely
        }
      });

    }
  }
}

function checkRowForFour() {
  for (let i = 0; i < width * width - 3; i++) {
    const rowOfFour = [i, i + 1, i + 2, i + 3];
    const imgElement = cells[i].querySelector("img");
    const decidedImage = imgElement ? imgElement.src : null;
    const isBlank = !decidedImage || decidedImage === "";

    // Check if the row is within the same row
    const notInLastColumn = i % width < width - 3;

    if (
      notInLastColumn &&
      rowOfFour.every((index) => {
        const imgElement = cells[index].querySelector("img");
        const imgSrc = imgElement ? imgElement.src : null;
        return imgSrc === decidedImage && !isBlank;
      })
    ) {
      score += 4;


      // Remove the <img> tag from each matched cell
      rowOfFour.forEach((index) => {
        const imgElement = cells[index].querySelector("img");
        if (imgElement) {
          cells[index].removeChild(imgElement); // Remove the img element entirely
        }
      });

    }
  }
}

function checkColumnForThree() {
  for (let i = 0; i < width * (width - 2); i++) {
    const columnOfThree = [i, i + width, i + width * 2];
    const imgElement = cells[i].querySelector("img");
    const decidedImage = imgElement ? imgElement.src : null;
    const isBlank = !decidedImage || decidedImage === "";

    if (
      !isBlank && // Check if the image is not blank
      columnOfThree.every((index) => {
        const imgElement = cells[index].querySelector("img");
        const imgSrc = imgElement ? imgElement.src : null;
        return imgSrc === decidedImage && !isBlank; // Ensure all images match and aren't blank
      })
    ) {
      score += 3;


      // Remove the <img> tag from each matched cell
      columnOfThree.forEach((index) => {
        const imgElement = cells[index].querySelector("img");
        if (imgElement) {
          cells[index].removeChild(imgElement); // Remove the img element entirely
        }
      });

    }
  }
}

function checkColumnForFour() {
  for (let i = 0; i < width * (width - 3); i++) {
    const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
    const imgElement = cells[i].querySelector("img");
    const decidedImage = imgElement ? imgElement.src : null;
    const isBlank = !decidedImage || decidedImage === "";

    if (
      !isBlank && // Check if the image is not blank
      columnOfFour.every((index) => {
        const imgElement = cells[index].querySelector("img");
        const imgSrc = imgElement ? imgElement.src : null;
        return imgSrc === decidedImage && !isBlank; // Ensure all images match and aren't blank
      })
    ) {
      score += 4;


      // Remove the <img> tag from each matched cell
      columnOfFour.forEach((index) => {
        const imgElement = cells[index].querySelector("img");
        if (imgElement) {
          cells[index].removeChild(imgElement); // Remove the img element entirely
        }
      });
    }
  }
}

//Candy dropping and replacement logic

function dropCandies() {
  // Loop through the cells from bottom to top, excluding the last row
  for (let i = cells.length - width - 1; i >= 0; i--) {
    let currentIndex = i;

    // Check if the cell below is empty
    if (!cells[currentIndex + width].querySelector("img")) {
      let imgElement = cells[currentIndex].querySelector("img");

      // If the current cell has an <img> element, move it to the below cell
      if (imgElement) {
        cells[currentIndex + width].appendChild(imgElement);
      }
    }
  }

  // Dynamically calculate the first row based on the width of the grid
  let firstRow = [0, 1, 2, 3, 4];

  // Replace empty cells in the first row with new random candies
  for (let i of firstRow) {
    if (!cells[i].querySelector("img")) {
      let img = document.createElement("img");
      img.src = "./Images/" + randomCandy() + ".png";
      img.setAttribute("id", i);
      img.draggable = true;

      // Add the event listeners for drag-and-drop functionality (if needed)
      img.addEventListener("dragstart", onDragStart);
      img.addEventListener("dragend", onDragEnd);

      // Append the new candy image to the cell
      cells[i].appendChild(img);

    }
  }
}

window.onload = generateCandy;
window.setInterval(() => {
  dropCandies();
  checkRowForFour();
  checkColumnForFour();
  checkRowForThree();
  checkColumnForThree();
}, 100);
