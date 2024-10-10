document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById('board');
  const movesRemaining = document.getElementById('movesRemaining');
  const width = 5;
  const gridSize = width * width;
  const candies = ["Blue", "Green", "Orange", "Purple", "Red", "Yellow"];
  let currentCandies = [];
  let draggedCandy = null;
  let draggedGhost = null;
  let moves = 20;


  function createBoard() {
    for (let i = 0; i < gridSize; i++) {
      const candy = document.createElement('div');
      candy.setAttribute('draggable', true);
      candy.setAttribute('data-id', i);
      candy.classList.add('cell');

      const candyImg = document.createElement('img');
      candyImg.src = `./Images/${randomCandy()}.png`;
      candyImg.alt = 'Candy';
      candy.appendChild(candyImg);
      board.appendChild(candy);

      currentCandies.push(candy);


      candy.addEventListener('dragstart', dragStart);
      candy.addEventListener('dragend', dragEnd);
      candy.addEventListener('dragover', dragOver);
      candy.addEventListener('dragenter', dragEnter);
      candy.addEventListener('dragleave', dragLeave);
      candy.addEventListener('drop', dragDrop);
    }
  }


  function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
  }


  function dragStart(e) {
    draggedCandy = this;
    e.dataTransfer.setDragImage(new Image(), 0, 0);


    draggedGhost = this.cloneNode(true);
    draggedGhost.classList.add('dragged-ghost');
    document.body.appendChild(draggedGhost);
    updateGhostPosition(e);
  }

  function dragOver(e) {
    e.preventDefault();
    updateGhostPosition(e);
  }

  function dragEnter(e) {
    e.preventDefault();
    this.classList.add('drag-over');
  }

  function dragLeave() {
    this.classList.remove('drag-over');
  }

  function dragDrop() {
    this.classList.remove('drag-over');
    const draggedCandyId = parseInt(draggedCandy.getAttribute('data-id'));
    const targetCandyId = parseInt(this.getAttribute('data-id'));


    const validMoves = [
      draggedCandyId - 1,
      draggedCandyId + 1,
      draggedCandyId - width,
      draggedCandyId + width
    ];

    if (validMoves.includes(targetCandyId)) {
      swapCandies(draggedCandy, this);
      setTimeout(() => {
        if (checkMatches()) {
          updateMoves();
        } else {
          swapCandies(draggedCandy, this);
        }
      }, 100);
    }
  }

  function dragEnd() {
    draggedCandy = null;
    if (draggedGhost) {
      document.body.removeChild(draggedGhost);
      draggedGhost = null;
    }
  }


  function updateGhostPosition(e) {
    if (draggedGhost) {
      draggedGhost.style.left = `${e.pageX - 25}px`;
      draggedGhost.style.top = `${e.pageY - 25}px`;
    }
  }


  function swapCandies(candy1, candy2) {
    const tempSrc = candy1.querySelector('img').src;
    candy1.querySelector('img').src = candy2.querySelector('img').src;
    candy2.querySelector('img').src = tempSrc;
  }


  function checkMatches() {
    let matchFound = false;

    for (let i = 0; i < gridSize; i++) {
      if (i % width < width - 2) {
        let rowMatch = [i, i + 1, i + 2];
        if (
          currentCandies[i].querySelector('img').src === currentCandies[i + 1].querySelector('img').src &&
          currentCandies[i].querySelector('img').src === currentCandies[i + 2].querySelector('img').src
        ) {
          rowMatch.forEach(index => currentCandies[index].querySelector('img').classList.add('match'));
          setTimeout(() => rowMatch.forEach(index => currentCandies[index].querySelector('img').src = `./Images/${randomCandy()}.png`), 300);
          matchFound = true;
        }
      }
    }

    for (let i = 0; i < gridSize - 2 * width; i++) {
      let columnMatch = [i, i + width, i + 2 * width];
      if (
        currentCandies[i].querySelector('img').src === currentCandies[i + width].querySelector('img').src &&
        currentCandies[i].querySelector('img').src === currentCandies[i + 2 * width].querySelector('img').src
      ) {
        columnMatch.forEach(index => currentCandies[index].querySelector('img').classList.add('match'));
        setTimeout(() => columnMatch.forEach(index => currentCandies[index].querySelector('img').src = `./Images/${randomCandy()}.png`), 300);
        matchFound = true;
      }
    }

    return matchFound;
  }

  function updateMoves() {
    moves--;
    movesRemaining.innerText = moves;

    if (moves === 0) {
      setTimeout(() => alert('Game Over!'), 200);
      disableBoard();
    }
  }

  function disableBoard() {
    currentCandies.forEach(candy => candy.setAttribute('draggable', false));
  }

  createBoard();
});
